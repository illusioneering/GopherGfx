import { Matrix3 } from "./Matrix3";
import { Vector2 } from "./Vector2"

export class BoundingBox2 
{
    public min: Vector2;
    public max: Vector2;

    /**
    * Constructs a new BoundingBox2
    */
    constructor()
    {
        this.min = new Vector2();
        this.max = new Vector2();
    }

    /**
     * Copies an existing BoundingBox2 to this one
     * 
     * @param box - The BoundingBox2 to copy
     */
    copy(box: BoundingBox2): void
    {
        this.min.copy(box.min);
        this.max.copy(box.max);
    }

    /**
     * Transforms the BoundingBox2 with a translation, rotation, and scale
     * 
     * @param translation - The translation vector
     * @param rotation - The rotation (in radians)
     * @param scale - The scaling vector
     */
    transform(translation: Vector2, rotation: number, scale: Vector2)
    {
        this.min.multiply(scale);
        this.max.multiply(scale);
        
        const topLeft = new Vector2(this.min.x, this.max.y);
        const topRight = new Vector2(this.max.x, this.max.y);
        const bottomLeft = new Vector2(this.min.x, this.min.y);
        const bottomRight = new Vector2(this.max.x, this.min.y);
        topLeft.rotate(rotation);
        topRight.rotate(rotation);
        bottomLeft.rotate(rotation);
        bottomRight.rotate(rotation);

        this.min.x = Math.min(topLeft.x, Math.min(topRight.x, Math.min(bottomLeft.x, bottomRight.x)));
        this.min.y = Math.min(topLeft.y, Math.min(topRight.y, Math.min(bottomLeft.y, bottomRight.y)));
        this.max.x = Math.max(topLeft.x, Math.max(topRight.x, Math.max(bottomLeft.x, bottomRight.x)));
        this.max.y = Math.max(topLeft.y, Math.max(topRight.y, Math.max(bottomLeft.y, bottomRight.y)));

        this.min.add(translation);
        this.max.add(translation);
    }

    /**
     * Checks if this BoundingBox2 intersects with another BoundingBox2
     * 
     * @param box - The other BoundingBox2 to check against
     * @returns True if the two BoundingBox2s intersect, false otherwise
     */
    intersects(box: BoundingBox2): boolean
    {
        const thisCenter = Vector2.add(this.max, this.min);
        thisCenter.multiplyScalar(0.5);

        const otherCenter = Vector2.add(box.max, box.min);
        otherCenter.multiplyScalar(0.5);

        const thisHalfWidth = Vector2.subtract(this.max, this.min);
        thisHalfWidth.multiplyScalar(0.5);

        const otherHalfWidth = Vector2.subtract(box.max, box.min);
        otherHalfWidth.multiplyScalar(0.5);

        if(Math.abs(thisCenter.x - otherCenter.x) > (thisHalfWidth.x + otherHalfWidth.x))
            return false;
        else if(Math.abs(thisCenter.y - otherCenter.y) > (thisHalfWidth.y + otherHalfWidth.y))
            return false;
        else
            return true;
    }
}