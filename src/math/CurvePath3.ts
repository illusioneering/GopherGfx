import { MathUtils } from './MathUtils';
import { Vector3 } from './Vector3'

// Smooth path generated using a Catmull-Rom spline
// https://qroph.github.io/2018/07/30/smooth-paths-using-catmull-rom-splines.html
// https://en.wikipedia.org/wiki/Centripetal_Catmull%E2%80%93Rom_spline

export class CurvePath3
{
    public controlPoints: Vector3[];
    public alpha: number;
    public tension: number;

/**
 * Constructs a CurvePath3 object with the given alpha and tension values
 * 
 * @param alpha - The alpha value for the curve
 * @param tension - The tension value for the curve
 */
    constructor(alpha = 0.5, tension = 0)
    {
        this.controlPoints = [];
        this.alpha = alpha;
        this.tension = tension;
    }

/**
 * Computes a point on the curve from the given segment and parameter values
 * 
 * @param segment - The segment to calculate the point from
 * @param t - The parameter value from 0-1 to calculate the point from
 * @returns The point on the curve at the given segment and parameter value, or null if the segment is out of range
 */    
    getPoint(segment: number, t: number): Vector3 | null
    {
        if(segment == 0)
        {
            const v = Vector3.subtract(this.controlPoints[segment+1], this.controlPoints[segment]);
            const firstPoint = Vector3.subtract(this.controlPoints[segment], v);
            
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
            const v = Vector3.subtract(this.controlPoints[segment+1], this.controlPoints[segment]);
            const lastPoint = Vector3.add(this.controlPoints[segment+1], v);

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
            const v = Vector3.subtract(this.controlPoints[segment], this.controlPoints[segment-1]);
            const secondToLastPoint = Vector3.add(this.controlPoints[segment], v);
            const lastPoint = Vector3.add(secondToLastPoint, v);

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
 * Computes a point on the curve from the given control points and parameter values
 * 
 * @param p0 - The first control point
 * @param p1 - The second control point
 * @param p2 - The third control point
 * @param p3 - The fourth control point
 * @param t - The parameter value from 0-1 to calculate the point from
 * @returns The point on the curve at the given control points and parameter value
 */
    private computePoint(p0: Vector3, p1: Vector3, p2: Vector3, p3: Vector3, t: number): Vector3
    {
        const t01 = Math.pow(p0.distanceTo(p1), this.alpha);
        const t12 = Math.pow(p1.distanceTo(p2), this.alpha);
        const t23 = Math.pow(p2.distanceTo(p3), this.alpha);

        const p1p0 = Vector3.subtract(p1, p0);
        const p1p2 = Vector3.subtract(p1, p2);
        const p2p0 = Vector3.subtract(p2, p0);
        const p2p1 = Vector3.subtract(p2, p1);
        const p3p1 = Vector3.subtract(p3, p1);
        const p3p2 = Vector3.subtract(p3, p2);

        const m1 = Vector3.multiplyScalar(p1p0, 1 / t01);
        m1.subtract(Vector3.multiplyScalar(p2p0, 1 / (t01 + t12)));
        m1.multiplyScalar(t12);
        m1.add(p2p1);
        m1.multiplyScalar(1 - this.tension);

        const m2 = Vector3.multiplyScalar(p3p2, 1 / t23);
        m2.subtract(Vector3.multiplyScalar(p3p1, 1 / (t12 +  t23)));
        m2.multiplyScalar(t12);
        m2.add(p2p1);
        m2.multiplyScalar(1 - this.tension);

        const a = Vector3.multiplyScalar(p1p2, 2);
        a.add(m1);
        a.add(m2);

        const b = Vector3.multiplyScalar(p1p2, -3);
        b.subtract(m1);
        b.subtract(m1);
        b.subtract(m2);

        const c = m1;
        const d = p1;

        const result = Vector3.multiplyScalar(a, t * t * t);
        result.add(Vector3.multiplyScalar(b, t * t));
        result.add(Vector3.multiplyScalar(c, t));
        result.add(d);

        return result;
    }
}