import { Vector2 } from "./Vector2"

export class BoundingCircle 
{
    public center: Vector2;
    public radius: number;

    constructor()
    {
        this.center = new Vector2();
        this.radius = 0;
    }

    copy(circle: BoundingCircle): void
    {
        this.center.copy(circle.center);
        this.radius = circle.radius;
    }

    transform(translation: Vector2, scale: Vector2)
    {
        this.center.multiply(scale);
        this.center.add(translation);
        
        if(scale.x >= scale.y)
            this.radius *= scale.x;
        else
            this.radius *= scale.y;
    }

    intersects(circle: BoundingCircle): boolean
    {
        const distance = this.center.distanceTo(circle.center);

        if(distance < (this.radius + circle.radius))
            return true;
        else
            return false;
    }
}