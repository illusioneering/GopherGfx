import { Vector3 } from "./Vector3"

export class Plane 
{
    public point: Vector3;
    public normal: Vector3;

    constructor(point = new Vector3(), normal = new Vector3(0, 0, -1))
    {
        this.point = point;
        this.normal = normal;
    }
}