import { Matrix4 } from './Matrix4'
import { Quaternion } from './Quaternion';

export class Vector3
{
    public static readonly ZERO = new Vector3(0, 0, 0);
    public static readonly ONE = new Vector3(1, 1, 1);
    public static readonly UP = new Vector3(0, 1, 0);
    public static readonly DOWN = new Vector3(0, -1, 0);
    public static readonly LEFT = new Vector3(-1, 0, 0);
    public static readonly RIGHT = new Vector3(1, 0, 0);
    public static readonly FORWARD = new Vector3(0, 0, -1);
    public static readonly BACK = new Vector3(0, 0, 1);
    public static readonly X_AXIS = Vector3.RIGHT;
    public static readonly Y_AXIS = Vector3.UP;
    public static readonly Z_AXIS = Vector3.FORWARD;

    public static copy(v: Vector3): Vector3
    {
        return new Vector3(v.x, v.y, v.z);
    }

    public static inverse(v: Vector3): Vector3
    {
        return new Vector3(-v.x, -v.y, -v.z);
    }

    public static add(v1: Vector3, v2: Vector3): Vector3
    {
        return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }

    public static subtract(v1: Vector3, v2: Vector3): Vector3
    {
        return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }

    public static multiply(v1: Vector3, v2: Vector3): Vector3
    {
        return new Vector3(v1.x * v2.x, v1.y * v2.y, v1.z * v2.z);
    }

    public static divide(v1: Vector3, v2: Vector3): Vector3
    {
        return new Vector3(v1.x / v2.x, v1.y / v2.y, v1.z / v2.z);
    }


    public static dot(v1: Vector3, v2: Vector3): number
    {
        return v1.x*v2.x + v1.y*v2.y + v1.z*v2.z;
    }

    public static cross(v1: Vector3, v2: Vector3): Vector3
    {
        return new Vector3(
            v1.y * v2.z - v1.z * v2.y,
            v1.z * v2.x - v1.x * v2.z,
            v1.x * v2.y - v1.y * v2.x
        );
    }

    public static multiplyScalar(v: Vector3, n: number): Vector3
    {
        return new Vector3(v.x * n, v.y * n, v.z * n);
    }

    public static divideScalar(v: Vector3, n: number): Vector3
    {
        return new Vector3(v.x / n, v.y / n, v.z / n);
    }

    public static normalize(v: Vector3): Vector3
    {
        const sizeSquared = v.x*v.x + v.y*v.y + v.z*v.z;
        
        // zero vectors
        if(sizeSquared < 1e-8)
            return new Vector3();

        const scaleFactor = 1 / Math.sqrt(sizeSquared);
        return new Vector3(v.x * scaleFactor, v.y * scaleFactor, v.z * scaleFactor);
    }

    public static angleBetween(v1: Vector3, v2: Vector3): number
    {
        return v1.angleBetween(v2);
    }

    public static distanceBetween(v1: Vector3, v2: Vector3): number
    {
        return v1.distanceTo(v2);
    }

    public x: number;
    public y: number;
    public z: number;

    constructor(x = 0, y = 0, z = 0)
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    set(x: number, y: number, z: number): void
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    copy(v: Vector3): void
    {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
    }

    clone(): Vector3
    {
        return new Vector3(this.x, this.y, this.z);
    }

    equals(v: Vector3): boolean
    {
        return this.x == v.x && this.y == v.y && this.z == v.z;
    }

    add(v: Vector3): void
    {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
    }

    subtract(v: Vector3): void
    {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
    }

    multiply(v: Vector3): void
    {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
    }

    divide(v: Vector3): void
    {
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z;
    }

    dot(v: Vector3): number
    {
        return this.x*v.x + this.y*v.y + this.z*v.z;
    }

    cross(v: Vector3): Vector3
    {
        return new Vector3(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }

    multiplyScalar(n: number): void
    {
        this.x *= n;
        this.y *= n;
        this.z *= n;
    }

    divideScalar(n: number): void
    {
        this.x /= n;
        this.y /= n;
        this.z /= n;
    }

    length(): number
    {
        return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
    }

    normalize(): void
    {
        const sizeSquared = this.x*this.x + this.y*this.y + this.z*this.z;
        
        // zero vectors
        if(sizeSquared < 1e-8)
            return;

        const scaleFactor = 1 / Math.sqrt(sizeSquared);
        this.x *= scaleFactor;
        this.y *= scaleFactor;
        this.z *= scaleFactor;
    }

    invert(): void
    {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
    }

    applyMatrix(m: Matrix4): void
    {
        const v = this.clone();
        const w = 1 / (m.mat[3]*v.x + m.mat[7]*v.y + m.mat[11]*v.z + m.mat[15]);
        this.x = w * (m.mat[0]*v.x + m.mat[4]*v.y + m.mat[8]*v.z + m.mat[12]);
        this.y = w * (m.mat[1]*v.x + m.mat[5]*v.y + m.mat[9]*v.z + m.mat[13]);
        this.z = w * (m.mat[2]*v.x + m.mat[6]*v.y + m.mat[10]*v.z + m.mat[14]);
    }

    applyMatrixAsNormal(m: Matrix4): void
    {
        const v = this.clone();
        const w = 1 / (m.mat[3]*v.x + m.mat[7]*v.y + m.mat[11]*v.z);
        this.x = w * (m.mat[0]*v.x + m.mat[4]*v.y + m.mat[8]*v.z);
        this.y = w * (m.mat[1]*v.x + m.mat[5]*v.y + m.mat[9]*v.z);
        this.z = w * (m.mat[2]*v.x + m.mat[6]*v.y + m.mat[10]*v.z);
    }

    rotate(q: Quaternion): void
    {
        this.copy(q.rotate(this));
    }

    angleBetween(v: Vector3): number
    {
        const v1Norm = Vector3.normalize(this);
        const v2Norm = Vector3.normalize(v);

        return Math.acos(v1Norm.dot(v2Norm));
    }

    distanceTo(v: Vector3): number
    {
        return Math.sqrt(
            (this.x - v.x) * (this.x - v.x) + 
            (this.y - v.y) * (this.y - v.y) +
            (this.z - v.z) * (this.z - v.z) 
        );
    }

    setPositionFromMatrix(m: Matrix4): void
    {
        this.x = m.mat[12];
        this.y = m.mat[13];
        this.z = m.mat[14];
    }

    setScaleFromMatrix(m: Matrix4): void
    {
        this.x = Math.sqrt(m.mat[0]*m.mat[0] + m.mat[1]*m.mat[1] + m.mat[2]*m.mat[2]);
        this.y = Math.sqrt(m.mat[4]*m.mat[4] + m.mat[5]*m.mat[5] + m.mat[6]*m.mat[6]);
        this.z = Math.sqrt(m.mat[8]*m.mat[8] + m.mat[9]*m.mat[9] + m.mat[10]*m.mat[10]);
    }
}