import { Vector3 } from "./Vector3"

export class Sphere 
{
    public center: Vector3;
    public radius: number;

    constructor(center = new Vector3(), radius = 1)
    {
        this.center = center;
        this.radius = radius;
    }
}