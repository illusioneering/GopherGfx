import { Vector3 } from "./Vector3"

export class BoundingSphere 
{
    public center: Vector3;
    public radius: number;

    constructor()
    {
        this.center = new Vector3();
        this.radius = 0;
    }

    copy(circle: BoundingSphere): void
    {
        this.center.copy(circle.center);
        this.radius = circle.radius;
    }

    transform(translation: Vector3, scale: Vector3)
    {
        this.center.multiply(scale);
        this.center.add(translation);
        
        if(scale.x >= scale.y)
            this.radius *= scale.x;
        else
            this.radius *= scale.y;
    }

    intersects(circle: BoundingSphere): boolean
    {
        const distance = this.center.distanceTo(circle.center);

        if(distance < (this.radius + circle.radius))
            return true;
        else
            return false;
    }
}