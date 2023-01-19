import { Vector3 } from "./Vector3";
import { Matrix4 } from "./Matrix4";

export class Quaternion
{
    /**
     * A static property representing the identity quaternion (0, 0, 0, 1)
     */
    public static readonly IDENTITY: Quaternion = new Quaternion();

    /**
     * Copies a Quaternion object
     * 
     * @param q - The Quaternion object to copy
     * @returns A new Quaternion object with the same values as q
     */
    public static copy(q: Quaternion): Quaternion
    {
        return new Quaternion(q.x, q.y, q.z, q.w);
    }

    /**
     * Multiplies two Quaternion objects together
     * This operation is not commutative, so order matters
     * 
     * @param q1 - The first Quaternion object
     * @param q2 - The second Quaternion object
     * @returns A new Quaternion object representing the product of q1 and q2
     */
    public static multiply(q1: Quaternion, q2: Quaternion): Quaternion
    {
        const dest = new Quaternion();

        dest.w = q1.w*q2.w - q1.x*q2.x - q1.y*q2.y - q1.z*q2.z;
        dest.x = q1.w*q2.x + q1.x*q2.w + q1.y*q2.z - q1.z*q2.y;
        dest.y = q1.w*q2.y + q1.y*q2.w + q1.z*q2.x - q1.x*q2.z;
        dest.z = q1.w*q2.z + q1.z*q2.w + q1.x*q2.y - q1.y*q2.x;

        return dest;
    }

    /**
     * Premultiplies two Quaternion objects
     * This operation is not commutative, so order matters
     * 
     * @param q1 - The first Quaternion object
     * @param q2 - The second Quaternion object
     * @returns A new Quaternion object which is the result of the premultiplication of the two input Quaternion objects
     */
    public static premultiply(q1: Quaternion, q2: Quaternion): Quaternion
    {
        const dest = new Quaternion();

        dest.w = q2.w*q1.w - q2.x*q1.x - q2.y*q1.y - q2.z*q1.z;
        dest.x = q2.w*q1.x + q2.x*q1.w + q2.y*q1.z - q2.z*q1.y;
        dest.y = q2.w*q1.y + q2.y*q1.w + q2.z*q1.x - q2.x*q1.z;
        dest.z = q2.w*q1.z + q2.z*q1.w + q2.x*q1.y - q2.y*q1.x;

        return dest;
    }

    /**
     * Normalizes a Quaternion object
     * 
     * @param q - The Quaternion object to normalize
     * @returns A new Quaternion object with normalized values
     */
    public static normalize(q: Quaternion): Quaternion
    {
        const dest = q.clone();
        dest.normalize();
        return dest;
    }

    /**
     * Inverts a Quaternion object
     * 
     * @param q - The Quaternion object to invert
     * @returns A new Quaternion object representing the inverse of q
     */
    public static inverse(q: Quaternion): Quaternion
    {
        const dest = q.clone();
        dest.invert();
        return dest;
    }

    /**
     * Creates a new identity Quaternion object
     * 
     * @returns A new Quaternion object representing the identity Quaternion (0, 0, 0, 1)
     */
    makeIdentity(): Quaternion
    {
        return new Quaternion(0, 0, 0, 1);
    }

    /**
     * Creates a new Quaternion object representing a rotation around the x-axis
     * 
     * @param angle - The angle to rotate by around the x-axis (in radians)
     * @returns A new Quaternion object representing a rotation around the x-axis
     */
    public static makeRotationX(angle: number): Quaternion
    {
        const dest = new Quaternion();
        dest.setRotationX(angle);
        return dest;
    }

    /**
     * Creates a new Quaternion object representing a rotation around the y-axis
     * 
     * @param angle - The angle to rotate by around the y-axis (in radians)
     * @returns A new Quaternion object representing a rotation around the y-axis
     */
    public static makeRotationY(angle: number): Quaternion
    {
        const dest = new Quaternion();
        dest.setRotationY(angle);
        return dest;
    }

    /**
     * Creates a new Quaternion object representing a rotation around the z-axis
     * 
     * @param angle - The angle to rotate by around the z-axis (in radians)
     * @returns A new Quaternion object representing a rotation around the z-axis
     */
    public static makeRotationZ(angle: number): Quaternion
    {
        const dest = new Quaternion();
        dest.setRotationZ(angle);
        return dest;
    }

    /**
     * Create a quaternion from a given axis and angle
     * 
     * @param axis - The axis to rotate around
     * @param angle - The angle of rotation
     * @returns A new Quaternion
     */
    public static makeAxisAngle(axis: Vector3, angle: number): Quaternion
    {
        const dest = new Quaternion();
        dest.setAxisAngle(axis, angle);
        return dest;
    }

    /**
     * Create a quaternion from given Euler angles
     * 
     * @param x - The x-axis rotation angle
     * @param y - The y-axis rotation angle
     * @param z - The z-axis rotation angle
     * @param order - The order of the rotations (defaults to 'YZX')
     * @returns A new Quaternion
     */
    public static makeEulerAngles(x: number, y: number, z: number, order = 'YZX'): Quaternion
    {
        const dest = new Quaternion();
        dest.setEulerAngles(x, y, z, order);
        return dest;
    }

    /**
     * Create a quaternion from a given Matrix4 object
     * 
     * @param matrix - The Matrix4 object to use for creating the quaternion
     * @returns A new Quaternion
     */
    public static makeMatrix(matrix: Matrix4): Quaternion
    {
        const dest = new Quaternion();
        dest.setMatrix(matrix);
        return dest;
    }

    /**
     * Computes a Quaternion from two input Quaternions using spherical linear interpolation
     * 
     * @param q1 - The first Quaternion
     * @param q2 - The second Quaternion
     * @param alpha - The interpolation factor
     * @returns A new Quaternion representing the slerp between q1 and q2
     */
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

    /**
     * Creates a new Quaternion object
     * 
     * @param x - The x component of the Quaternion
     * @param y - The y component of the Quaternion
     * @param z - The z component of the Quaternion
     * @param w - The w component of the Quaternion
     */
    constructor(x = 0, y = 0, z = 0, w = 1)
    {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    /**
     * Sets the quaternion to the given x, y, z, and w values
     * 
     * @param x - The x value
     * @param y - The y value
     * @param z - The z value
     * @param w - The w value
     */
    set(x: number, y: number, z: number, w: number): void
    {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    
    /**
     * Sets the quaternion to the identity quaternion
     */
    setIdentity(): void
    {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w  = 1;
    }

    /**
     * Sets the quaternion to a rotation around the x axis
     * 
     * @param angle - The angle of rotation in radians
     */
    setRotationX(angle: number): void
    {
        this.w = Math.cos(angle / 2);
        this.x = Math.sin(angle / 2);
        this.y = 0;
        this.z = 0;
    }

    /**
     * Sets the quaternion to a rotation around the y axis
     * 
     * @param angle - The angle of rotation in radians
     */
    setRotationY(angle: number): void
    {
        this.w = Math.cos(angle / 2);
        this.x = 0;
        this.y = Math.sin(angle / 2);
        this.z = 0;
    }

    
    /**
     * Sets the quaternion to a rotation around the z axis
     * 
     * @param angle - The angle of rotation in radians
     */
    setRotationZ(angle: number): void
    {
        this.w = Math.cos(angle / 2);
        this.x = 0;
        this.y = 0;
        this.z = Math.sin(angle / 2);
    }

    /**
     * Sets the quaternion values using a (normalized) axis and an angle in radians
     * @param axis - The axis of rotation
     * @param angle - The angle of rotation in radians
     */
    setAxisAngle(axis: Vector3, angle: number): void
    {
        // Based on the approached described here
        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

        const sinAngle = Math.sin(angle / 2);

        this.w = Math.cos(angle / 2);
        this.x = sinAngle * axis.x;
        this.y = sinAngle * axis.y;
        this.z = sinAngle * axis.z;
    }

    /**
     * Sets the quaternion values using Euler angles
     * 
     * @param x - The x-axis rotation angle in radians
     * @param y - The y-axis rotation angle in radians
     * @param z - The z-axis rotation angle in radians
     * @param order - The order in which the rotation angles are applied (defaults to 'YZX')
     */
    setEulerAngles(x: number, y: number, z: number, order = 'YZX'): void
    {
        // Based on the implementation in three.js

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

    /**
     * Sets the quaternion from a rotation matrix
     * 
     * @param matrix - The rotation matrix in homogeneous coordinates
     */
    setMatrix(matrix: Matrix4): void
    {
        // Based on implementation described here:
        // https://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/

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

    /**
     * Copies the values of another quaternion into this one
     * 
     * @param q - The quaternion to copy
     */
    copy(q: Quaternion): void
    {
        this.x = q.x;
        this.y = q.y;
        this.z = q.z;
        this.w = q.w;
    }

    /**
     * Clones this quaternion
     * 
     * @returns A new quaternion with the same values as this one
     */
    clone(): Quaternion
    {
        return new Quaternion(this.x, this.y, this.z, this.w);
    }

    /**
     * Multiply this quaternion with the input quaternion
     * This operation is not commutative, so order matters
     * 
     * @param q - The quaternion to multiply with
     */
    multiply(q: Quaternion): void
    {
        this.copy(Quaternion.multiply(this, q));
    }

    /**
     * Premultiply this quaternion with the input quaternion
     * This operation is not commutative, so order matters
     * 
     * @param q - The quaternion to premultiply with
     */
    premultiply(q: Quaternion): void
    {
        this.copy(Quaternion.multiply(q, this));
    }

    /**
     * Normalize this quaternion
     */
    normalize(): void
    {
        const normalizeFactor = 1 / Math.sqrt(this.x * this.x + this.y * this.y +
            this.z * this.z + this.w * this.w);

        this.x *= normalizeFactor;
        this.y *= normalizeFactor;
        this.z *= normalizeFactor;
        this.w *= normalizeFactor;
    }

    /**
     * Inverts the Quaternion in place
     */
    invert(): void
    {
        const normalizeFactor = 1 / Math.sqrt(this.x * this.x + this.y * this.y +
            this.z * this.z + this.w * this.w);

        this.x *= -normalizeFactor;
        this.y *= -normalizeFactor;
        this.z *= -normalizeFactor;
        this.w *= normalizeFactor;
    }

    /**
     * Returns the inverse of this Quaternion
     * 
     * @returns The inverse of this Quaternion
     */
    inverse(): Quaternion
    {
        return Quaternion.inverse(this);
    }

    /**
     * Returns a 4x4 rotation matrix representation of this Quaternion
     * 
     * @returns A 4x4 rotation matrix representation of this Quaternion
     */
    getMatrix(): Matrix4
    {
        // Based on implementation described at
        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToMatrix/index.htm
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

    /**
     * Creates a quaternion that rotates the vector `eye` to point towards `target`
     * 
     * @param eye - The vector representing the starting point
     * @param target - The vector representing the target point
     * @param up - The vector representing the up direction (defaults to Vector3.UP)
     */
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

    /**
     * Interpolates between two quaternions, q1 and q2, based on the given `alpha` value
     * 
     * @param q1 - The starting quaternion
     * @param q2 - The ending quaternion
     * @param alpha - The interpolation value (0-1)
     */
    slerp(q1: Quaternion, q2: Quaternion, alpha: number): void
    {
        // based on VRPN implementation
        // https://github.com/vrpn/vrpn/blob/master/quat/quat.c
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