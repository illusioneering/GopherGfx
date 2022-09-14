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
}