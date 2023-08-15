import { Matrix4 } from "./Matrix4";
import { Vector3 } from "./Vector3"

export class BoundingBox3 
{
    public min: Vector3;
    public max: Vector3;

/**
 * Constructs a BoundingBox3 object.
 */
    constructor()
    {
        this.min = new Vector3();
        this.max = new Vector3();
    }

/**
 * Copies the minimum and maximum values of another BoundingBox3 object into this one.
 * 
 * @param box - The BoundingBox3 object to copy
 */
    copy(box: BoundingBox3): void
    {
        this.min.copy(box.min);
        this.max.copy(box.max);
    }

    /**
     * Transforms the BoundingBox3 using a transformation matrix
     * 
     * @param m - The transformation matrix
     */
    transform(m: Matrix4)
    {
        // Compute new axis-aligned bounding box
        const corners: Vector3[] = [];
        corners.push(new Vector3(this.min.x, this.min.y, this.min.z));
        corners.push(new Vector3(this.min.x, this.min.y, this.max.z));
        corners.push(new Vector3(this.min.x, this.max.y, this.min.z));
        corners.push(new Vector3(this.min.x, this.max.y, this.max.z));
        corners.push(new Vector3(this.max.x, this.min.y, this.min.z));
        corners.push(new Vector3(this.max.x, this.min.y, this.max.z));
        corners.push(new Vector3(this.max.x, this.max.y, this.min.z));
        corners.push(new Vector3(this.max.x, this.max.y, this.max.z));

        corners.forEach((p: Vector3)=>{
            p.transformPoint(m);
        });

        this.min.copy(corners[0]);
        this.max.copy(corners[0]);
        for(let i=1; i < corners.length; i++)
        {
            this.min.x = Math.min(this.min.x, corners[i].x);
            this.min.y = Math.min(this.min.y, corners[i].y);
            this.min.z = Math.min(this.min.z, corners[i].z);

            this.max.x = Math.max(this.max.x, corners[i].x);
            this.max.y = Math.max(this.max.y, corners[i].y);
            this.max.z = Math.max(this.max.z, corners[i].z);
        }
    }

    /**
     * Checks if this BoundingBox3 object intersects with the provided BoundingBox3 object
     * 
     * @param box - The BoundingBox3 object to check intersection against
     * @returns True if the boxes intersect, false otherwise
     */
    intersects(box: BoundingBox3): boolean
    {
        const thisCenter = Vector3.add(this.max, this.min);
        thisCenter.multiplyScalar(0.5);

        const otherCenter = Vector3.add(box.max, box.min);
        otherCenter.multiplyScalar(0.5);

        const thisHalfWidth = Vector3.subtract(this.max, this.min);
        thisHalfWidth.multiplyScalar(0.5);

        const otherHalfWidth = Vector3.subtract(box.max, box.min);
        otherHalfWidth.multiplyScalar(0.5);

        if(Math.abs(thisCenter.x - otherCenter.x) > (thisHalfWidth.x + otherHalfWidth.x))
            return false;
        else if(Math.abs(thisCenter.y - otherCenter.y) > (thisHalfWidth.y + otherHalfWidth.y))
            return false;
        else if(Math.abs(thisCenter.z - otherCenter.z) > (thisHalfWidth.z + otherHalfWidth.z))
            return false;
        else
            return true;
    }

    /**
     * Computes the minimum and maximum Vector3 objects for the BoundingBox3 from a given array of vertices
     * 
     * @param vertices - An array of Vector3 or number objects with the vertices
     */
    computeBounds(vertices: Vector3[] | number[]): void
    {
        if(typeof vertices[0] === 'number')
        {
            const vArray = vertices as number[];

            this.max.set(vArray[0], vArray[1], vArray[2]);
            this.min.set(vArray[0], vArray[1], vArray[2]);
            
            for(let i=0; i < vArray.length; i+=3)
            {
                if(vArray[i] > this.max.x)
                    this.max.x = vArray[i];
                if(vArray[i] < this.min.x)
                    this.min.x = vArray[i];

                if(vArray[i+1] > this.max.y)
                    this.max.y = vArray[i+1];
                if(vArray[i+1] < this.min.y)
                    this.min.y = vArray[i+1];

                if(vArray[i+2] > this.max.z)
                    this.max.z = vArray[i+2];
                if(vArray[i+2] < this.min.z)
                    this.min.z = vArray[i+2];    
            }
        }
        else
        {
            this.max.copy((vertices as Vector3[])[0]);
            this.min.copy((vertices as Vector3[])[0]);

            (vertices as Vector3[]).forEach((elem: Vector3) =>
            {
                if(elem.x > this.max.x)
                    this.max.x = elem.x;
                if(elem.x < this.min.x)
                    this.min.x = elem.x;

                if(elem.y > this.max.y)
                    this.max.y = elem.y;
                if(elem.y < this.min.y)
                    this.min.y =elem.y;

                if(elem.z > this.max.z)
                    this.max.z = elem.z;
                if(elem.z < this.min.z)
                    this.min.z = elem.z;
            });
        }
    }
}