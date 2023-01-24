import { MathUtils } from './MathUtils';
import { Vector2 } from './Vector2'

export class LinearPath2
{
    /**
     * An array of Vector2 objects representing the control points of the path
     */
    public controlPoints: Vector2[];

    /**
     * Constructor for the LinearPath2 class
     */
    constructor()
    {
        this.controlPoints = [];
    }

    /**
     * Gets the point at a given distance along the path
     * 
     * @param segment - The segment index
     * @param t - The value (between 0 and 1) along the segment to get the point
     * @returns The point at the given distance on the path, or null if the segment index is out of bounds
     */
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