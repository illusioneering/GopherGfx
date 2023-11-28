import { Vector3 } from './Vector3'
import { Plane3 } from './Plane3'
import { BoundingBox3 } from './BoundingBox3'
import { BoundingSphere } from './BoundingSphere'
import { Vector2 } from './Vector2';
import { Camera } from '../core/Camera'
import { Mesh3 } from '../geometry/3d/Mesh3'
import { Node3 } from '../core/Node3'

export class Ray3
{
    public origin: Vector3;
    public direction: Vector3;

    /**
     * Constructor of the Ray3 class
     * 
     * @param origin - The origin of the ray
     * @param direction - The direction of the ray
     */
    constructor(origin = new Vector3(), direction = new Vector3(0, 0, -1))
    {
        this.origin = origin;
        this.direction = direction;
    }

    /**
     * Create a copy of the ray
     * @returns Ray3 object containing a copy of the original ray
     */
    clone(): Ray3
    {
        const ray = new Ray3();
        ray.origin.copy(this.origin);
        ray.direction.copy(this.direction);
        return ray;
    }
        
    
    /**
     * Sets the origin and direction of the Ray
     * 
     * @param origin - The origin of the Ray
     * @param direction - The direction of the Ray
     */
    set(origin: Vector3, direction: Vector3): void
    {
        this.origin = origin;
        this.direction = direction;
    }

    /**
     * Sets the Ray based on the device coordinates and camera
     * 
     * @param deviceCoords - A Vector2 containing the device coordinates
     * @param camera - The Camera used to set the Ray
     */
    setPickRay(deviceCoords: Vector2, camera: Camera): void
    {
        const worldMatrix = camera.localToWorldMatrix;
        this.origin.copy(worldMatrix.getTranslation());
        this.direction.set(deviceCoords.x, deviceCoords.y, -1);
        this.direction.transformPoint(camera.projectionMatrix.inverse());
        this.direction.transformVector(worldMatrix);
        this.direction.normalize();
    }

    /**
     * Checks if the Ray intersects a Plane
     * Reference: https://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-plane-and-ray-disk-intersection
     * 
     * @param plane - The Plane to check for intersection
     * @returns A Vector3 containing the intersection point or null if there is no intersection
     */
    intersectsPlane(plane: Plane3): Vector3 | null
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
    
    /**
     * Checks if the Ray intersects a Sphere
     * Reference: https://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-sphere-intersection
     * 
     * @param sphere - The Sphere to check for intersection
     * @returns A Vector3 containing the intersection point or null if there is no intersection
     */
    intersectsSphere(sphere: BoundingSphere): Vector3 | null
    {
        const EPSILON = 0.0000001;

        const l = Vector3.subtract(sphere.center, this.origin);
        const tca = l.dot(this.direction);
        const radiusSquared = sphere.radius * sphere.radius;

        const d2 = l.dot(l) - tca * tca;
        if(d2 > radiusSquared)
            return null;

        const thc = Math.sqrt(radiusSquared - d2);
        const t0 = tca - thc;
        const t1 = tca + thc;

        if(t0 <= EPSILON && t1 <= EPSILON)
            return null;
        
        const intersection = this.direction.clone();

        if (t0 > EPSILON && t1 > EPSILON) {
            if (t0 < t1)
                intersection.multiplyScalar(t0);
            else
                intersection.multiplyScalar(t1);
        }
        else if (t0 > EPSILON) {
            intersection.multiplyScalar(t0);
        }
        else {
            intersection.multiplyScalar(t1);
        }
        
        intersection.add(this.origin);

        return intersection;
    }

    /**
     * Checks if the Ray intersects a Box
     * Reference: https://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-box-intersection
     * 
     * @param box - The Box to check for intersection
     * @returns A Vector3 containing the intersection point or null if there is no intersection
     */
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

    /**
     * Checks if the Ray intersects an Axis-Aligned Bounding Box
     * 
     * @param transform - The Transform of the Axis-Aligned Bounding Box
     * @returns A Vector3 containing the intersection point or null if there is no intersection
     */
    intersectsAxisAlignedBoundingBox(transform: Node3): Vector3 | null
    {
        return this.intersectsBox(transform.worldBoundingBox);
    }

    /**
     * Checks if the Ray intersects an Oriented Bounding Box
     * 
     * @param transform - The Transform of the Oriented Bounding Box
     * @returns A Vector3 containing the intersection point or null if there is no intersection
     */
    intersectsOrientedBoundingBox(transform: Node3): Vector3 | null
    {
        const localIntersection = this.createLocalRay(transform).intersectsBox(transform.boundingBox);
        if(localIntersection)
        {
            localIntersection.transformPoint(transform.localToWorldMatrix);
        }
        return localIntersection;
    }

    /**
     * Computes the intersection between a ray and an oriented bounding sphere
     * 
     * @param transform - The transformation of the bounding sphere 
     * @returns The intersection point if the ray intersects the bounding sphere, otherwise null
     */
    intersectsOrientedBoundingSphere(transform: Node3): Vector3 | null
    {
        return this.intersectsSphere(transform.worldBoundingSphere);
    }

    /**
     * Computes a brute force intersection test between a ray and a mesh 
     * 
     * @param mesh - The mesh to test the intersection against
     * @returns The intersection point if the ray intersects the mesh, otherwise null
     */
    intersectsMesh3(mesh: Mesh3): Vector3 | null
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
            result.transformPoint(mesh.localToWorldMatrix);

        return result;
    }

    
    /**
     * Computes the intersection between a ray and a series of triangles 
     * 
     * @param vertices - Array of either Vector3 objects or numbers representing the vertex positions
     * @param indices - Array of indices representing the triangle faces
     * @returns The intersection point if the ray intersects the triangles, otherwise null
     */
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

    /**
     * Implementation of the Möller–Trumbore triangle intersection algorithm
     * https://en.wikipedia.org/wiki/M%C3%B6ller%E2%80%93Trumbore_intersection_algorithm
     * 
     * @param vertex0 - Vector3 object representing the first vertex of the triangle
     * @param vertex1 - Vector3 object representing the second vertex of the triangle
     * @param vertex2 - Vector3 object representing the third vertex of the triangle
     * @returns The intersection point if the ray intersects the triangle, otherwise null
     */
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

    /**
     * Creates a new Ray object in the local space of a given Transform
     * 
     * @param transform - The Transform object to create the local ray from
     * @returns The ray in the local space of the Transform
     */
    createLocalRay(transform: Node3): Ray3
    {
        const localRay = this.clone();
        const inverseWorldMatrix = transform.localToWorldMatrix.inverse();
        localRay.origin.transformPoint(inverseWorldMatrix);
        localRay.direction.transformVector(inverseWorldMatrix);
        localRay.direction.normalize();
        return localRay;
    } 
}