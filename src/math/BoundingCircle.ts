import { Vector2 } from "./Vector2"
import { Matrix3 } from "./Matrix3"

export class BoundingCircle 
{
    public center: Vector2;
    public radius: number;

/**
 * Constructor for the BoundingCircle class
 * 
 * @returns A new instance of the BoundingCircle class
 */
    constructor()
    {
        this.center = new Vector2();
        this.radius = 0;
    }

    /**
     * Copies the properties of a given circle to this instance
     * 
     * @param circle - The circle whose properties will be copied
     */
    copy(circle: BoundingCircle): void
    {
        this.center.copy(circle.center);
        this.radius = circle.radius;
    }

    /**
     * Transforms the BoundingCircle using a transformation matrix
     * 
     * @param m - The transformation matrix
     */
    transform(m: Matrix3)
    {
        // Compute new local bounding circle center
        this.center.add(m.getTranslation());
        
        // Compute new local bounding circle radius
        const radiusVector = new Vector2(this.radius, 0);
        radiusVector.transformVector(m);
        this.radius = radiusVector.length();
    }

    /**
     * Returns whether this BoundingCircle intersects with the input BoundingCircle
     * 
     * @param circle - The BoundingCircle object to check for intersection
     * @returns True if the two BoundingCircle objects intersect, false otherwise
     */
    intersects(circle: BoundingCircle): boolean
    {
        const distance = this.center.distanceTo(circle.center);

        if(distance < (this.radius + circle.radius))
            return true;
        else
            return false;
    }
}