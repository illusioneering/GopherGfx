import { MathUtils } from './MathUtils';
import { Vector2 } from './Vector2'

// Smooth path generated using a Catmull-Rom spline
// https://qroph.github.io/2018/07/30/smooth-paths-using-catmull-rom-splines.html
// https://en.wikipedia.org/wiki/Centripetal_Catmull%E2%80%93Rom_spline

export class CurvePath2
{
    public controlPoints: Vector2[];
    public alpha: number;
    public tension: number;

    /** 
     * Constructor for the CurvePath2 class.
     * 
     * @param alpha - The alpha parameter for the curve calculation (default 0.5)
     * @param tension - The tension parameter for the curve calculation (default 0) 
     */
    constructor(alpha = 0.5, tension = 0)
    {
        this.controlPoints = [];
        this.alpha = alpha;
        this.tension = tension;
    }

    /**
     * Computes a point on the curve at a given segment and t value.
     * 
     * @param segment - The index of the control point of the segment
     * @param t - The parameter t in the range [0,1]
     * @returns The point on the curve at the specified segment and t value
     */
    getPoint(segment: number, t: number): Vector2 | null
    {
        if(segment == 0)
        {
            const v = Vector2.subtract(this.controlPoints[segment+1], this.controlPoints[segment]);
            const firstPoint = Vector2.subtract(this.controlPoints[segment], v);
            
            return this.computePoint(
                firstPoint,
                this.controlPoints[segment],
                this.controlPoints[segment+1],
                this.controlPoints[segment+2],
                MathUtils.clamp(t, 0, 1)
            );
        }
        if(segment < this.controlPoints.length - 2)
        {
            return this.computePoint(
                this.controlPoints[segment-1],
                this.controlPoints[segment],
                this.controlPoints[segment+1],
                this.controlPoints[segment+2],
                MathUtils.clamp(t, 0, 1)
            );
        }
        else if(segment == this.controlPoints.length - 2)
        {
            const v = Vector2.subtract(this.controlPoints[segment+1], this.controlPoints[segment]);
            const lastPoint = Vector2.add(this.controlPoints[segment+1], v);

            return this.computePoint(
                this.controlPoints[segment-1],
                this.controlPoints[segment],
                this.controlPoints[segment+1],
                lastPoint,
                MathUtils.clamp(t, 0, 1)
            );
        }
        else if(segment == this.controlPoints.length - 1)
        {
            const v = Vector2.subtract(this.controlPoints[segment], this.controlPoints[segment-1]);
            const secondToLastPoint = Vector2.add(this.controlPoints[segment], v);
            const lastPoint = Vector2.add(secondToLastPoint, v);

            return this.computePoint(
                this.controlPoints[segment-1],
                this.controlPoints[segment],
                secondToLastPoint,
                lastPoint,
                MathUtils.clamp(t, 0, 1)
            );
        }
        else
        {
            return null;
        }
    }


    /**
     * Computes a point on a CurvePath2 based on the given parameters
     * 
     * @param p0 - The first Vector2 object
     * @param p1 - The second Vector2 object
     * @param p2 - The third Vector2 object
     * @param p3 - The fourth Vector2 object
     * @param t - The t value used to calculate the point
     * @returns The Vector2 that represents the point on the CurvePath2
     */
    private computePoint(p0: Vector2, p1: Vector2, p2: Vector2, p3: Vector2, t: number): Vector2
    {
        const t01 = Math.pow(p0.distanceTo(p1), this.alpha);
        const t12 = Math.pow(p1.distanceTo(p2), this.alpha);
        const t23 = Math.pow(p2.distanceTo(p3), this.alpha);

        const p1p0 = Vector2.subtract(p1, p0);
        const p1p2 = Vector2.subtract(p1, p2);
        const p2p0 = Vector2.subtract(p2, p0);
        const p2p1 = Vector2.subtract(p2, p1);
        const p3p1 = Vector2.subtract(p3, p1);
        const p3p2 = Vector2.subtract(p3, p2);

        const m1 = Vector2.multiplyScalar(p1p0, 1 / t01);
        m1.subtract(Vector2.multiplyScalar(p2p0, 1 / (t01 + t12)));
        m1.multiplyScalar(t12);
        m1.add(p2p1);
        m1.multiplyScalar(1 - this.tension);

        const m2 = Vector2.multiplyScalar(p3p2, 1 / t23);
        m2.subtract(Vector2.multiplyScalar(p3p1, 1 / (t12 +  t23)));
        m2.multiplyScalar(t12);
        m2.add(p2p1);
        m2.multiplyScalar(1 - this.tension);

        const a = Vector2.multiplyScalar(p1p2, 2);
        a.add(m1);
        a.add(m2);

        const b = Vector2.multiplyScalar(p1p2, -3);
        b.subtract(m1);
        b.subtract(m1);
        b.subtract(m2);

        const c = m1;
        const d = p1;

        const result = Vector2.multiplyScalar(a, t * t * t);
        result.add(Vector2.multiplyScalar(b, t * t));
        result.add(Vector2.multiplyScalar(c, t));
        result.add(d);

        return result;
    }
}