import { Vector3 } from "./Vector3"

export class Plane 
{
    public point: Vector3;
    public normal: Vector3;

    constructor(point = new Vector3(), normal = new Vector3(0, 0, -1))
    {
        this.point = point.clone();
        this.normal = Vector3.normalize(normal);
    }

    distanceTo(point: Vector3): number
    {
        return this.normal.dot(point) - this.point.dot(this.normal);
    }

    project(point: Vector3): Vector3
    {
        const target = new Vector3(this.normal.x, this.normal.y, this.normal.z);
        target.multiplyScalar(-this.distanceTo(point));
        target.add(point);

        return target;
    }
}