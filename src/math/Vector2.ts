import { Matrix3 } from './Matrix3'

export class Vector2
{
    public static readonly ZERO = new Vector2(0, 0);
    public static readonly ONE = new Vector2(1, 1);
    public static readonly UP = new Vector2(0, 1);
    public static readonly DOWN = new Vector2(0, -1);
    public static readonly LEFT = new Vector2(-1, 0);
    public static readonly RIGHT = new Vector2(1, 0);
    public static readonly X_AXIS = Vector2.RIGHT;
    public static readonly Y_AXIS = Vector2.UP;

    public static copy(v: Vector2): Vector2
    {
        return new Vector2(v.x, v.y);
    }

    public static inverse(v: Vector2): Vector2
    {
        return new Vector2(-v.x, -v.y);
    }

    public static add(v1: Vector2, v2: Vector2): Vector2
    {
        return new Vector2(v1.x + v2.x, v1.y + v2.y);
    }

    public static subtract(v1: Vector2, v2: Vector2): Vector2
    {
        return new Vector2(v1.x - v2.x, v1.y - v2.y);
    }

    public static multiply(v1: Vector2, v2: Vector2): Vector2
    {
        return new Vector2(v1.x * v2.x, v1.y * v2.y);
    }

    public static divide(v1: Vector2, v2: Vector2): Vector2
    {
        return new Vector2(v1.x / v2.x, v1.y / v2.y);
    }

    public static multiplyScalar(v: Vector2, n: number): Vector2
    {
        return new Vector2(v.x * n, v.y * n);
    }

    public static divideScalar(v: Vector2, n: number): Vector2
    {
        return new Vector2(v.x / n, v.y / n);
    }

    public static distanceBetween(v1: Vector2, v2: Vector2): number
    {
        return v1.distanceTo(v2);
    }

    public static angleBetween(v1: Vector2, v2: Vector2): number
    {
        return v1.angleBetween(v2);
    }

    public static angleBetweenSigned(v1: Vector2, v2: Vector2): number
    {
        return v1.angleBetweenSigned(v2);
    }

    public static dot(v1: Vector2, v2: Vector2): number
    {
        return v1.x*v2.x + v1.y*v2.y;
    }

    public static normalize(v: Vector2): Vector2
    {
        const sizeSquared = v.x*v.x + v.y*v.y;
        
        // zero vectors
        if(sizeSquared < 1e-8)
            return new Vector2();

        const scaleFactor = 1 / Math.sqrt(sizeSquared);
        return new Vector2(v.x * scaleFactor, v.y * scaleFactor);
    }

    public static rotate(v: Vector2, angle: number): Vector2
    {
        return new Vector2(Math.cos(angle)*v.x - Math.sin(angle)*v.y, Math.sin(angle)*v.x + Math.cos(angle)*v.y); 
    }

    public x: number;
    public y: number;
    
    constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }

    set(x: number, y: number): void
    {
        this.x = x;
        this.y = y;
    }

    copy(v: Vector2): void
    {
        this.x = v.x;
        this.y = v.y;
    }

    clone(): Vector2
    {
        return new Vector2(this.x, this.y);
    }

    equals(v: Vector2): boolean
    {
        return this.x == v.x && this.y == v.y;
    }

    add(v: Vector2): void
    {
        this.x += v.x;
        this.y += v.y;
    }

    subtract(v: Vector2): void
    {
        this.x -= v.x;
        this.y -= v.y;
    }

    multiply(v: Vector2): void
    {
        this.x *= v.x;
        this.y *= v.y;
    }

    divide(v: Vector2): void
    {
        this.x /= v.x;
        this.y /= v.y;
    }

    multiplyScalar(n: number): void
    {
        this.x *= n;
        this.y *= n;
    }

    divideScalar(n: number): void
    {
        this.x /= n;
        this.y /= n;
    }

    distanceTo(v: Vector2): number
    {
        return Math.sqrt(
            (this.x - v.x) * (this.x - v.x) + 
            (this.y - v.y) * (this.y - v.y) 
        );
    }

    setPositionFromMatrix(m: Matrix3): void
    {
        this.x = m.mat[6];
        this.y = m.mat[7];
    }

    setScaleFromMatrix(m: Matrix3): void
    {
        this.x = Math.sqrt(m.mat[0]*m.mat[0] + m.mat[1]*m.mat[1]);
        this.y = Math.sqrt(m.mat[3]*m.mat[3] + m.mat[4]*m.mat[4]);
    }

    applyMatrix(m: Matrix3): void
    {
        const v = this.clone();
        const w = 1 / (m.mat[2]*v.x + m.mat[5]*v.y + m.mat[8]);
        this.x = w * (m.mat[0]*v.x + m.mat[3]*v.y + m.mat[6]);
        this.y = w * (m.mat[1]*v.x + m.mat[4]*v.y + m.mat[7]);
    }

    dot(v: Vector2): number
    {
        return this.x*v.x + this.y*v.y;
    }

    length(): number
    {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }

    normalize(): void
    {
        const sizeSquared = this.x*this.x + this.y*this.y;
        
        // zero vectors
        if(sizeSquared < 1e-8)
            return;

        const scaleFactor = 1 / Math.sqrt(sizeSquared);
        this.x *= scaleFactor;
        this.y *= scaleFactor;
    }

    invert(): void
    {
        this.x = -this.x;
        this.y = -this.y;
    }

    angleBetween(v: Vector2): number
    {
        const v1Norm = Vector2.normalize(this);
        const v2Norm = Vector2.normalize(v);

        return Math.acos(v1Norm.dot(v2Norm));
    }

    angleBetweenSigned(v: Vector2): number
    {
        const v1Norm = Vector2.normalize(this);
        const v2Norm = Vector2.normalize(v);

        return Math.atan2(v2Norm.y,v2Norm.x) - Math.atan2(v1Norm.y, v1Norm.x)
    }

    rotate(angle: number): void
    {
        const x = this.x;
        const y = this.y;
        this.x = Math.cos(angle)*x - Math.sin(angle)*y;
        this.y = Math.sin(angle)*x + Math.cos(angle)*y; 
    }
}