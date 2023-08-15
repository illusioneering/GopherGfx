import { BoundingBox3 } from "./BoundingBox3";
import { Vector3 } from "./Vector3"
import { Matrix4 } from "./Matrix4";

export class BoundingSphere 
{
    public center: Vector3;
    public radius: number;

/**
 * Constructs a BoundingSphere
 */    
    constructor()
    {
        this.center = new Vector3();
        this.radius = 0;
    }

/**
 * Copies the given BoundingSphere into the current one
 * 
 * @param circle - The BoundingSphere object to copy
 */
    copy(circle: BoundingSphere): void
    {
        this.center.copy(circle.center);
        this.radius = circle.radius;
    }

    /**
     * Transforms the BoundingCircle using a transformation matrix
     * 
     * @param m - The transformation matrix
     */
    transform(m: Matrix4)
    {
        // Compute new local bounding circle center
        this.center.add(m.getTranslation());
        
        // Compute new local bounding circle radius
        const radiusVector = new Vector3(this.radius, 0);
        radiusVector.transformVector(m);
        this.radius = radiusVector.length();
    }

    /**
     * Checks if the given BoundingSphere intersects with the current one
     * 
     * @param circle - The BoundingSphere to check against
     * @returns True if the two BoundingSpheres intersect, false otherwise
     */
   intersects(circle: BoundingSphere): boolean
    {
        const distance = this.center.distanceTo(circle.center);

        if(distance < (this.radius + circle.radius))
            return true;
        else
            return false;
    }

    /**
     * Computes the bounds of the BoundingSphere from the given vertices
     * 
     * @param vertices - The array of Vector3 or number objects representing the vertices
     * @param boundingBox - The BoundingBox3 object to use when computing the bounds
     */
    computeBounds(vertices: Vector3[] | number[], boundingBox: BoundingBox3): void
    {
        this.center.copy(boundingBox.min);
        this.center.add(boundingBox.max);
        this.center.multiplyScalar(0.5);
        this.radius = 0;
        if(typeof vertices[0] === 'number')
        {
            const vArray = vertices as number[];
            for(let i=0; i < vArray.length; i+=3)
            {
                const distance = Math.sqrt(
                    (vArray[i] - this.center.x) * (vArray[i] - this.center.x) +
                    (vArray[i+1] - this.center.y) * (vArray[i+1] - this.center.y) +
                    (vArray[i+2] - this.center.z) * (vArray[i+2] - this.center.z)
                );
                
                if(distance > this.radius)
                    this.radius = distance;
            }
        }
        else
        {
            (vertices as Vector3[]).forEach((elem: Vector3) =>
            {
                const distance = elem.distanceTo(this.center);

                if(distance > this.radius)
                    this.radius = distance;
            });
        }
    }
}