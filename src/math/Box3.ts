import { Vector3 } from "./Vector3"

export class Box3 
{
    public min: Vector3;
    public max: Vector3;

    constructor(min = new Vector3(-0.5, -0.5, -0.5), max = new Vector3(0.5, 0.5, 0.5))
    {
        this.min = min;
        this.max = max;
    }
}