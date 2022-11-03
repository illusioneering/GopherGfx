import { MathUtils } from './MathUtils';
import { Vector3 } from './Vector3'

export class LinearPath3
{
    public controlPoints: Vector3[];

    constructor()
    {
        this.controlPoints = [];
    }

    getPoint(segment: number, t: number): Vector3 | null
    {
        if(segment < this.controlPoints.length - 1)
        {
            return Vector3.lerp(this.controlPoints[segment], this.controlPoints[segment+1], MathUtils.clamp(t, 0, 1));
        }
        else
        {
            return null;
        }
    }
}