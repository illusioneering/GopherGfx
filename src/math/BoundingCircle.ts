import { Vector2 } from "./Vector2"

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
 * Transforms the BoundingCircle instance's center and radius
 * 
 * @param translation - The Vector2 to translate the center of the circle by
 * @param scale - A Vector2 object representing the scaling to apply
 */   
    transform(translation: Vector2, scale: Vector2)
    {
        this.center.multiply(scale);
        this.center.add(translation);
        
        if(scale.x >= scale.y)
            this.radius *= scale.x;
        else
            this.radius *= scale.y;
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