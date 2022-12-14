import { Vector3 } from './Vector3'
import { Plane } from './Plane'
import { BoundingBox3 } from './BoundingBox3'
import { BoundingSphere } from './BoundingSphere'
import { Vector2 } from './Vector2';
import { Camera } from '../core/Camera'
import { Mesh } from '../geometry/3d/Mesh'
import { Transform3 } from '../core/Transform3'

export class Ray 
{
    public origin: Vector3;
    public direction: Vector3;

    constructor(origin = new Vector3(), direction = new Vector3(0, 0, -1))
    {
        this.origin = origin;
        this.direction = direction;
    }
    
    set(origin: Vector3, direction: Vector3): void
    {
        this.origin = origin;
        this.direction = direction;
    }

    setPickRay(deviceCoords: Vector2, camera: Camera): void
    {
        
        const [worldPosition, worldRotation, worldScale] = camera.worldMatrix.decompose();
            
        this.origin.copy(worldPosition);
        this.direction.set(deviceCoords.x, deviceCoords.y, -1);
        this.direction.transform(camera.projectionMatrix.inverse());
        this.direction.rotate(worldRotation);
        this.direction.normalize();
    }

    // Reference: https://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-plane-and-ray-disk-intersection
    intersectsPlane(plane: Plane): Vector3 | null
    {

        // This method assumes the normals are unit vectors
        const denominator = this.direction.dot(plane.normal);

        if(Math.abs(denominator) > 0.000001)
        {
            const rayOriginToPlanePoint = Vector3.subtract(plane.point, this.origin);
            const t = rayOriginToPlanePoint.dot(plane.normal) / denominator;
            
            if(t > 0)
            {
                const intersectionPoint = Vector3.multiplyScalar(this.direction, t);
                intersectionPoint.add(this.origin);
                return intersectionPoint;
            }
        }
        
        return null;
    }

    // Reference: https://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-sphere-intersection
    intersectsSphere(sphere: BoundingSphere): Vector3 | null
    {

        const l = Vector3.subtract(sphere.center, this.origin);
        const tca = l.dot(this.direction);
        const radiusSquared = sphere.radius * sphere.radius;

        const d2 = l.dot(l) - tca * tca;
        if(d2 > radiusSquared)
            return null;

        const thc = Math.sqrt(radiusSquared - d2);
        const t0 = tca - thc;
        const t1 = tca + thc;

        if(t0 < 0 && t1 < 0)
            return null;
        
        const intersection = this.direction.clone();

        if(t0 < t1)
            intersection.multiplyScalar(t0);
        else
            intersection.multiplyScalar(t1);
        
        intersection.add(this.origin);

        return intersection;
    }

    // Reference: https://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-box-intersection
    intersectsBox(box: BoundingBox3): Vector3 | null
    {
        let tmin = (box.min.x - this.origin.x) / this.direction.x; 
        let tmax = (box.max.x - this.origin.x) / this.direction.x; 
    
        if (tmin > tmax)
        {
            const temp = tmin;
            tmin = tmax;
            tmax = temp;
        } 
    
        let tymin = (box.min.y - this.origin.y) / this.direction.y; 
        let tymax = (box.max.y - this.origin.y) / this.direction.y; 
    
        if (tymin > tymax)
        {
            const temp = tymin;
            tymin = tymax;
            tymax = temp;
        } 
    
        if ((tmin > tymax) || (tymin > tmax)) 
            return null; 
    
        if (tymin > tmin) 
            tmin = tymin; 
    
        if (tymax < tmax) 
            tmax = tymax; 
    
        let tzmin = (box.min.z - this.origin.z) / this.direction.z; 
        let tzmax = (box.max.z - this.origin.z) / this.direction.z; 
    
        if (tzmin > tzmax) 
        {
            const temp = tzmin;
            tzmin = tzmax;
            tzmax = temp;
        } 
    
        if ((tmin > tzmax) || (tzmin > tmax)) 
            return null; 
    
        if (tzmin > tmin) 
            tmin = tzmin; 
    
        if (tzmax < tmax) 
            tmax = tzmax; 

        const intersectionPoint = Vector3.multiplyScalar(this.direction, tmin);
        intersectionPoint.add(this.origin);
        return intersectionPoint;
    }

    intersectsOrientedBoundingBox(transform: Transform3): Vector3 | null
    {
        const localIntersection = this.createLocalRay(transform).intersectsBox(transform.boundingBox);
        if(localIntersection)
        {
            localIntersection.transform(transform.worldMatrix);
        }
        return localIntersection;
    }

    intersectsOrientedBoundingSphere(transform: Transform3): Vector3 | null
    {
        const localIntersection = this.createLocalRay(transform).intersectsSphere(transform.boundingSphere);
        if(localIntersection)
        {
            localIntersection.transform(transform.worldMatrix);
        }

        return localIntersection;
    }

    // Brute force intersection test
    intersectsMesh(mesh: Mesh): Vector3 | null
    { 
        const localRay = this.createLocalRay(mesh);

        // If we do not intersect the bounding box, then there is no
        // need to load the vertices from GPU memory and conduct
        // an intersection test with each triangle in the mesh.
        if(!localRay.intersectsBox(mesh.boundingBox))
            return null;

        const vertices = mesh.getVertices();
        const indices = mesh.getIndices();

        const result = localRay.intersectsTriangles(vertices, indices);

        if(result)
            result.transform(mesh.worldMatrix);

        return result;
    }

    intersectsTriangles(vertices: Vector3[] | number[], indices: number[]): Vector3 | null
    {
        let positions: Vector3[];
        if(typeof vertices[0] === 'number')
        {
            positions = [];

            const vArray = vertices as number[]
            for(let i=0; i < vertices.length; i+=3)
            {
                positions.push(new Vector3(vArray[i], vArray[i+1], vArray[i+2]));
            }
        }
        else
        {
            positions = vertices as Vector3[];
        }

        const results = [];
        for(let i=0; i < indices.length; i+=3)
        {
            const intersection = this.intersectsTriangle(positions[indices[i]], positions[indices[i+1]], positions[indices[i+2]]);
            
            if(intersection)
                results.push(intersection);
        }

        if(results.length == 0)
        {
            return null;
        }
        else if(results.length == 1)
        {
            return results[0];
        }
        else
        {
            let closestPoint = 0;
            let closestDistance = this.origin.distanceTo(results[0]);
            for(let i=1; i < results.length; i++)
            {
                const distance = this.origin.distanceTo(results[i]);
                if(distance < closestDistance)
                {
                    closestPoint = i;
                    closestDistance = distance;
                }
            }

            return results[closestPoint];
        }
    }

    // Implementation of the M??ller???Trumbore intersection algorithm
    // https://en.wikipedia.org/wiki/M%C3%B6ller%E2%80%93Trumbore_intersection_algorithm
    intersectsTriangle(vertex0: Vector3, vertex1: Vector3, vertex2: Vector3): Vector3 | null
    {
        const EPSILON = 0.0000001;

        const edge1 = Vector3.subtract(vertex1, vertex0);
        const edge2 = Vector3.subtract(vertex2, vertex0);
        const h = Vector3.cross(this.direction, edge2);
        const a = edge1.dot(h);
    
        if (a > -EPSILON && a < EPSILON) 
        {
            // This ray is parallel to this triangle.
            return null;    
        }

        const f = 1.0 / a;
        const s = Vector3.subtract(this.origin, vertex0);
        const u = f * (s.dot(h));
        if (u < 0.0 || u > 1.0)
        {
            return null;
        }

        const q = Vector3.cross(s, edge1);
        const v = f * this.direction.dot(q);
        if (v < 0.0 || u + v > 1.0) 
        {
            return null;
        }

        // At this stage we can compute t to find out where the intersection point is on the line.
        const t = f * edge2.dot(q);

        // ray intersection
        if (t > EPSILON) 
        {
            const intersection = this.direction.clone();
            intersection.multiplyScalar(t);
            intersection.add(this.origin);
            return intersection;
        }

        return null;
    }

    createLocalRay(transform: Transform3): Ray
    {
        const localRay = new Ray(this.origin.clone(), this.direction.clone());

        const [worldPosition, worldRotation, worldScale] = transform.worldMatrix.decompose();

        localRay.origin.subtract(worldPosition);

        const inverseRotation = worldRotation.inverse();
        localRay.origin.rotate(inverseRotation);
        localRay.direction.rotate(inverseRotation);

        const scale = worldScale;
        const inverseScale = new Vector3();
        inverseScale.x = 1 / scale.x;
        inverseScale.y = 1 / scale.y;
        inverseScale.z = 1 / scale.z;
        localRay.origin.multiply(inverseScale);
        localRay.direction.multiply(inverseScale);
        localRay.direction.normalize();
        
        return localRay;
    } 
}