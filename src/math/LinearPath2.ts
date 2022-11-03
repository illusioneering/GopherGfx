import { MathUtils } from './MathUtils';
import { Vector2 } from './Vector2'

export class LinearPath2
{
    public controlPoints: Vector2[];

    constructor()
    {
        this.controlPoints = [];
    }

    getPoint(segment: number, t: number): Vector2 | null
    {
        if(segment < this.controlPoints.length - 1)
        {
            return Vector2.lerp(this.controlPoints[segment], this.controlPoints[segment+1], MathUtils.clamp(t, 0, 1));
        }
        else
        {
            return null;
        }
    }
}