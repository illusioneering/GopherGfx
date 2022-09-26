import { Quaternion } from "./Quaternion";
import { Vector3 } from "./Vector3"

export class BoundingBox3 
{
    public min: Vector3;
    public max: Vector3;

    constructor()
    {
        this.min = new Vector3();
        this.max = new Vector3();
    }

    copy(box: BoundingBox3): void
    {
        this.min.copy(box.min);
        this.max.copy(box.max);
    }

    transform(translation: Vector3, rotation: Quaternion, scale: Vector3)
    {
        this.min.multiply(scale);
        this.max.multiply(scale);

        const corners: Vector3[] = [];
        corners.push(new Vector3(this.min.x, this.min.y, this.min.z));
        corners.push(new Vector3(this.min.x, this.min.y, this.max.z));
        corners.push(new Vector3(this.min.x, this.max.y, this.min.z));
        corners.push(new Vector3(this.min.x, this.max.y, this.max.z));
        corners.push(new Vector3(this.max.x, this.min.y, this.min.z));
        corners.push(new Vector3(this.max.x, this.min.y, this.max.z));
        corners.push(new Vector3(this.max.x, this.max.y, this.min.z));
        corners.push(new Vector3(this.max.x, this.max.y, this.max.z));

        corners.forEach((v: Vector3)=>{
            v.rotate(rotation);
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
        
        this.min.add(translation);
        this.max.add(translation);
    }

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
}