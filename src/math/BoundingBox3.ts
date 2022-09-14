import { Vector3 } from "./Vector3"

export class BoundingBox3 
{
    public min: Vector3;
    public max: Vector3;

    constructor()
    {
        this.min = new Vector3();
        this.max = new Vector3();
    }

    copy(box: BoundingBox3): void
    {
        this.min.copy(box.min);
        this.max.copy(box.max);
    }
}