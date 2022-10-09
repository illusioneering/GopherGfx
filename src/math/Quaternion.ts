import { Vector3 } from "./Vector3";
import { Matrix4 } from "./Matrix4";

export class Quaternion
{
    public static readonly IDENTITY: Quaternion = new Quaternion();

    public static copy(q: Quaternion): Quaternion
    {
        return new Quaternion(q.x, q.y, q.z, q.w);
    }

    public static multiply(q1: Quaternion, q2: Quaternion): Quaternion
    {
        const dest = new Quaternion();

        dest.w = q1.w*q2.w - q1.x*q2.x - q1.y*q2.y - q1.z*q2.z;
        dest.x = q1.w*q2.x + q1.x*q2.w + q1.y*q2.z - q1.z*q2.y;
        dest.y = q1.w*q2.y + q1.y*q2.w + q1.z*q2.x - q1.x*q2.z;
        dest.z = q1.w*q2.z + q1.z*q2.w + q1.x*q2.y - q1.y*q2.x;

        return dest;
    }

    public static normalize(q: Quaternion): Quaternion
    {
        const dest = q.clone();
        dest.normalize();
        return dest;
    }

    public static inverse(q: Quaternion): Quaternion
    {
        const dest = q.clone();
        dest.invert();
        return dest;
    }

    makeIdentity(): Quaternion
    {
        return new Quaternion(0, 0, 0, 1);
    }

    public static makeRotationX(angle: number): Quaternion
    {
        const dest = new Quaternion();
        dest.setRotationX(angle);
        return dest;
    }

    public static makeRotationY(angle: number): Quaternion
    {
        const dest = new Quaternion();
        dest.setRotationY(angle);
        return dest;
    }

    public static makeRotationZ(angle: number): Quaternion
    {
        const dest = new Quaternion();
        dest.setRotationZ(angle);
        return dest;
    }

    public static makeAxisAngle(axis: Vector3, angle: number): Quaternion
    {
        const dest = new Quaternion();
        dest.setAxisAngle(axis, angle);
        return dest;
    }

    public static makeEulerAngles(x: number, y: number, z: number, order = 'YZX'): Quaternion
    {
        const dest = new Quaternion();
        dest.setEulerAngles(x, y, z, order);
        return dest;
    }

    public static makeMatrix(matrix: Matrix4): Quaternion
    {
        const dest = new Quaternion();
        dest.setMatrix(matrix);
        return dest;
    }

    public static slerp(q1: Quaternion, q2: Quaternion, alpha: number): Quaternion
    {
        const q = new Quaternion();
        q.slerp(q1, q2, alpha);
        return q;
    }
    
    public x: number;
    public y: number;
    public z: number;
    public w: number;

    constructor(x = 0, y = 0, z = 0, w = 1)
    {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    set(x: number, y: number, z: number, w: number): void
    {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    setIdentity(): void
    {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w  = 1;
    }

    setRotationX(angle: number): void
    {
        this.w = Math.cos(angle / 2);
        this.x = Math.sin(angle / 2);
        this.y = 0;
        this.z = 0;
    }

    setRotationY(angle: number): void
    {
        this.w = Math.cos(angle / 2);
        this.x = 0;
        this.y = Math.sin(angle / 2);
        this.z = 0;
    }

    setRotationZ(angle: number): void
    {
        this.w = Math.cos(angle / 2);
        this.x = 0;
        this.y = 0;
        this.z = Math.sin(angle / 2);
    }

    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
    // assumes axis is normalized
    setAxisAngle(axis: Vector3, angle: number): void
    {
        const sinAngle = Math.sin(angle / 2);

        this.w = Math.cos(angle / 2);
        this.x = sinAngle * axis.x;
        this.y = sinAngle * axis.y;
        this.z = sinAngle * axis.z;
    }

    // based on the implementation in three.js
    setEulerAngles(x: number, y: number, z: number, order = 'YZX'): void
    {
		const cos = Math.cos;
		const sin = Math.sin;

		const c1 = cos( x / 2 );
		const c2 = cos( y / 2 );
		const c3 = cos( z / 2 );

		const s1 = sin( x / 2 );
		const s2 = sin( y / 2 );
		const s3 = sin( z / 2 );

		switch ( order ) 
        {
			case 'XYZ':
				this.x = s1 * c2 * c3 + c1 * s2 * s3;
				this.y = c1 * s2 * c3 - s1 * c2 * s3;
				this.z = c1 * c2 * s3 + s1 * s2 * c3;
				this.w = c1 * c2 * c3 - s1 * s2 * s3;
				break;

			case 'YXZ':
				this.x = s1 * c2 * c3 + c1 * s2 * s3;
				this.y = c1 * s2 * c3 - s1 * c2 * s3;
				this.z = c1 * c2 * s3 - s1 * s2 * c3;
				this.w = c1 * c2 * c3 + s1 * s2 * s3;
				break;

			case 'ZXY':
				this.x = s1 * c2 * c3 - c1 * s2 * s3;
				this.y = c1 * s2 * c3 + s1 * c2 * s3;
				this.z = c1 * c2 * s3 + s1 * s2 * c3;
				this.w = c1 * c2 * c3 - s1 * s2 * s3;
				break;

			case 'ZYX':
				this.x = s1 * c2 * c3 - c1 * s2 * s3;
				this.y = c1 * s2 * c3 + s1 * c2 * s3;
				this.z = c1 * c2 * s3 - s1 * s2 * c3;
				this.w = c1 * c2 * c3 + s1 * s2 * s3;
				break;

			case 'YZX':
				this.x = s1 * c2 * c3 + c1 * s2 * s3;
				this.y = c1 * s2 * c3 + s1 * c2 * s3;
				this.z = c1 * c2 * s3 - s1 * s2 * c3;
				this.w = c1 * c2 * c3 - s1 * s2 * s3;
				break;

			case 'XZY':
				this.x = s1 * c2 * c3 - c1 * s2 * s3;
				this.y = c1 * s2 * c3 - s1 * c2 * s3;
				this.z = c1 * c2 * s3 + s1 * s2 * c3;
				this.w = c1 * c2 * c3 + s1 * s2 * s3;
				break;
		}
    }

    // https://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/
    setMatrix(matrix: Matrix4): void
    {
        const trace = matrix.mat[0] + matrix.mat[5] + matrix.mat[10]

        if (trace > 0) 
        { 
            const s = Math.sqrt(trace + 1.0) * 2;  
            this.w = 0.25 * s;
            this.x = (matrix.mat[6] - matrix.mat[9]) / s;
            this.y = (matrix.mat[8] - matrix.mat[2]) / s; 
            this.z = (matrix.mat[1] - matrix.mat[4]) / s; 
        } 
        else if ((matrix.mat[0] > matrix.mat[5]) && (matrix.mat[0] > matrix.mat[10]))
        { 
            const s = Math.sqrt(1.0 + matrix.mat[0] - matrix.mat[5] - matrix.mat[10]) * 2; 
            this.w = (matrix.mat[6] - matrix.mat[9]) / s;
            this.x = 0.25 * s;
            this.y = (matrix.mat[4] + matrix.mat[1]) / s; 
            this.z = (matrix.mat[8] + matrix.mat[2]) / s; 
        } 
        else if (matrix.mat[5] > matrix.mat[10]) 
        { 
            const s = Math.sqrt(1.0 + matrix.mat[5] - matrix.mat[0] - matrix.mat[10]) * 2; 
            this.w = (matrix.mat[8] - matrix.mat[2]) / s;
            this.x = (matrix.mat[4] + matrix.mat[1]) / s; 
            this.y = 0.25 * s;
            this.z = (matrix.mat[9] + matrix.mat[6]) / s; 
        } 
        else 
        { 
            const s = Math.sqrt(1.0 + matrix.mat[10] - matrix.mat[0] - matrix.mat[5]) * 2; 
            this.w = (matrix.mat[1] - matrix.mat[4]) / s;
            this.x = (matrix.mat[8] + matrix.mat[2]) / s;
            this.y = (matrix.mat[9] + matrix.mat[6]) / s;
            this.z = 0.25 * s;
        }
    }

    copy(q: Quaternion): void
    {
        this.x = q.x;
        this.y = q.y;
        this.z = q.z;
        this.w = q.w;
    }

    clone(): Quaternion
    {
        return new Quaternion(this.x, this.y, this.z, this.w);
    }

    // Quaternion multiplication is not commutative
    multiply(q: Quaternion): void
    {
        this.copy(Quaternion.multiply(this, q));
    }

    // Quaternion multiplication is not commutative
    premultiply(q: Quaternion): void
    {
        this.copy(Quaternion.multiply(q, this));
    }

    normalize(): void
    {
        const normalizeFactor = 1 / Math.sqrt(this.x * this.x + this.y * this.y +
            this.z * this.z + this.w * this.w);

        this.x *= normalizeFactor;
        this.y *= normalizeFactor;
        this.z *= normalizeFactor;
        this.w *= normalizeFactor;
    }

    invert(): void
    {
        const normalizeFactor = 1 / Math.sqrt(this.x * this.x + this.y * this.y +
            this.z * this.z + this.w * this.w);

        this.x *= -normalizeFactor;
        this.y *= -normalizeFactor;
        this.z *= -normalizeFactor;
        this.w *= normalizeFactor;
    }

    inverse(): Quaternion
    {
        return Quaternion.inverse(this);
    }

    // based on http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToMatrix/index.htm
    getMatrix(): Matrix4
    {
        const sqw = this.w*this.w;
        const sqx = this.x*this.x;
        const sqy = this.y*this.y;
        const sqz = this.z*this.z;

        // invs (inverse square length) is only required if quaternion is not already normalised
        const invs = 1 / (sqx + sqy + sqz + sqw);

        const tmp1 = this.x*this.y;
        const tmp2 = this.z*this.w;
        const tmp3 = this.x*this.z;
        const tmp4 = this.y*this.w;
        const tmp5 = this.y*this.z;
        const tmp6 = this.x*this.w;
        
        return Matrix4.fromRowMajor(
            ( sqx - sqy - sqz + sqw)*invs, 2 * (tmp1 - tmp2)*invs, 2 * (tmp3 + tmp4)*invs, 0,
            2 * (tmp1 + tmp2)*invs, (-sqx + sqy - sqz + sqw)*invs, 2 * (tmp5 - tmp6)*invs, 0,
            2 * (tmp3 - tmp4)*invs, 2 * (tmp5 + tmp6)*invs, (-sqx - sqy + sqz + sqw), 0,
            0, 0, 0, 1
        );
    }

    lookAt(eye: Vector3, target: Vector3, up = Vector3.UP): void
    {
        const z = Vector3.subtract(eye, target);
        z.normalize();

        const x = Vector3.cross(up, z);
        x.normalize();

        const y = Vector3.cross(z, x);
        y.normalize();

        const m = new Matrix4();
        m.setRowMajor(
            x.x, y.x, z.x, 0,
            x.y, y.y, z.y, 0,
            x.z, y.z, z.z, 0,
            0, 0, 0, 1
        );
        this.setMatrix(m);
    }

    // based on VRPN implementation
    // https://github.com/vrpn/vrpn/blob/master/quat/quat.c
    slerp(q1: Quaternion, q2: Quaternion, alpha: number): void
    {
        const temp = q1.clone();

        let cosOmega = q1.x*q2.x + q1.y*q2.y + q1.z*q2.z + q1.w*q2.w;
        let omega, sinOmega, startScale, endScale;

        // If the above dot product is negative, it would be better to
        // go between the negative of the initial and the final, so that
        // we take the shorter path.  
        if(cosOmega < 0)
        {
            cosOmega *= -1;
            temp.x *= -1;
            temp.y *= -1;
            temp.z *= -1;
            temp.w *= -1;
        }

        if((1 + cosOmega) > 0.00001)
        {
            // usual case
            if((1 - cosOmega) > 0.00001)
            {
                omega = Math.acos(cosOmega);
                sinOmega = Math.sin(omega);
                startScale = Math.sin((1 - alpha) * omega) / sinOmega;
                endScale = Math.sin(alpha * omega) / sinOmega;
            }
            // ends very close
            else
            {
                startScale = 1 - alpha;
                endScale = alpha;
            }

            this.x = startScale * temp.x + endScale * q2.x;
            this.y = startScale * temp.y + endScale * q2.y;
            this.z = startScale * temp.z + endScale * q2.z;
            this.w = startScale * temp.w + endScale * q2.w;
        }
        // ends nearly opposite
        else
        {
            this.x = -temp.y;
            this.y = temp.x;
            this.z = -temp.w;
            this.w = temp.z;

            startScale = Math.sin((0.5 - alpha) * Math.PI);
            endScale = Math.sin(alpha * Math.PI);

            this.x = startScale * temp.x + endScale * this.x;
            this.y = startScale * temp.y + endScale * this.y;
            this.z = startScale * temp.y + endScale * this.z;
        }
    }
}