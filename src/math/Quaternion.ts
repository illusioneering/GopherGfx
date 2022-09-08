import { Vector3 } from "./Vector3";
import { Matrix4 } from "./Matrix4";
import { transcode } from "buffer";

export class Quaternion
{
    public static readonly IDENTITY: Quaternion = new Quaternion();

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

    public static makeEulerAngles(yaw: number, pitch: number, roll: number): Quaternion
    {
        const dest = new Quaternion();
        dest.setEulerAngles(yaw, pitch, roll);
        return dest;
    }

    public static makeMatrix(matrix: Matrix4): Quaternion
    {
        const dest = new Quaternion();
        dest.setMatrix(matrix);
        return dest;
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

    // assumes axis is normalized
    setAxisAngle(axis: Vector3, angle: number): void
    {
        const sinAngle = Math.sin(angle / 2);

        this.w = Math.cos(angle / 2);
        this.x = sinAngle * axis.x;
        this.y = sinAngle * axis.y;
        this.z = sinAngle * axis.z;
    }

    setEulerAngles(yaw: number, pitch: number, roll: number): void
    {
        const cosPitch = Math.cos(pitch/2);
        const sinPitch = Math.sin(pitch/2);

        const cosYaw = Math.cos(yaw/2);
        const sinYaw = Math.sin(yaw/2);
        
        const cosRoll = Math.cos(-roll/2);
        const sinRoll = Math.sin(-roll/2);

        this.x = sinPitch * cosYaw * cosRoll + cosPitch * sinYaw * sinRoll;
        this.y = cosPitch * sinYaw * cosRoll - sinPitch * cosYaw * sinRoll;
        this.z = cosPitch * cosYaw * sinRoll + sinPitch * sinYaw * cosRoll;    
        this.w = cosPitch * cosYaw * cosRoll - sinPitch * sinYaw * sinRoll;
    }

    // https://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/
    setMatrix(matrix: Matrix4): void
    {
        this.w = Math.sqrt(1 + matrix.mat[0] + matrix.mat[5] + matrix.mat[10]) / 2;
        this.x = (matrix.mat[6] - matrix.mat[9]) / (4 * this.w);
        this.y = (matrix.mat[8] - matrix.mat[2]) / (4 * this.w);
        this.z = (matrix.mat[1] - matrix.mat[4]) / (4 * this.w);
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

    // Multiply by q on the LHS
    // Quaternion multiplication is not commutative
    multiply(q: Quaternion): void
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
    
    rotate(v: Vector3): Vector3
    {
        // Extract the vector part of the quaternion
        const u = new Vector3(this.x, this.y, this.z);

        // vprime = 2.0f * dot(u, v) * u
        const result = Vector3.multiplyScalar(u, 2 * u.dot(v));

        // + (s*s - dot(u, u)) * v
        result.add(Vector3.multiplyScalar(v, this.w * this.w - u.dot(u)));

        const crossUV = u.cross(v);
        crossUV.multiplyScalar(2 * this.w);
        result.add(crossUV);

        return result;
    }

    invert(): void
    {
        const norm = 1 / (this.x*this.x + this.y*this.y + this.z*this.z + this.w*this.w);
        this.x *= -norm;
        this.y *= -norm;
        this.z *= -norm;
        this.w *= norm;
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
}