import { MathUtils } from './MathUtils';
import { Vector3 } from './Vector3'

export class LinearPath3
{
    public controlPoints: Vector3[];

/**
 * Constructs a new LinearPath3 object
 */
    constructor()
    {
        this.controlPoints = [];
    }

/**
 * Calculates a point along the linear path
 * 
 * @param segment - The segment index of the linear path
 * @param t - A float value in the range [0, 1]
 * @returns The calculated point, or null if the segment index is out of bounds
 */
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