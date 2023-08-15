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

    /**
     * Copies the values of v into a new Vector2 object
     * 
     * @param v - The Vector2 object to copy
     * @returns A new Vector2 object with the same values as v
     */
    public static copy(v: Vector2): Vector2
    {
        return new Vector2(v.x, v.y);
    }

    /**
     * Inverts the values of the Vector2 object 
     * 
     * @param v - The Vector2 object to invert
     * @returns A new Vector2 object with the inverted values of v
     */
    public static inverse(v: Vector2): Vector2
    {
        return new Vector2(-v.x, -v.y);
    }

    /**
     * Adds two Vector2 objects and returns the result in a new Vector2
     * 
     * @param v1 - The first Vector2 object
     * @param v2 - The second Vector2 object
     * @returns A new Vector2 object with the result of the addition
     */
    public static add(v1: Vector2, v2: Vector2): Vector2
    {
        return new Vector2(v1.x + v2.x, v1.y + v2.y);
    }

    /**
     * Subtracts two Vector2 objects and returns the result in a new Vector2
     * 
     * @param v1 - The first Vector2 object
     * @param v2 - The second Vector2 object
     * @returns A new Vector2 object with the result of the subtraction
     */
    public static subtract(v1: Vector2, v2: Vector2): Vector2
    {
        return new Vector2(v1.x - v2.x, v1.y - v2.y);
    }

    /**
     * Multiplies two Vector2 objects and returns the result in a new Vector2
     * 
     * @param v1 - The first Vector2 object
     * @param v2 - The second Vector2 object
     * @returns A new Vector2 object with the result of the multiplication
     */
    public static multiply(v1: Vector2, v2: Vector2): Vector2
    {
        return new Vector2(v1.x * v2.x, v1.y * v2.y);
    }

    /**
     * Divides two Vector2 objects and returns the result in a new Vector2
     * 
     * @param v1 - The first Vector2 object
     * @param v2 - The second Vector2 object
     * @returns A new Vector2 object with the result of the division
     */
    public static divide(v1: Vector2, v2: Vector2): Vector2
    {
        return new Vector2(v1.x / v2.x, v1.y / v2.y);
    }

    /**
     * Multiplies a Vector2 object by a scalar and returns the result in a new Vector2
     * 
     * @param v - The Vector2 object
     * @param n - The scalar
     * @returns A new Vector2 object with the result of the multiplication
     */
    public static multiplyScalar(v: Vector2, n: number): Vector2
    {
        return new Vector2(v.x * n, v.y * n);
    }

    /**
     * Divides a Vector2 object by a scalar and returns the result in a new Vector2
     * 
     * @param v - The Vector2 object
     * @param n - The scalar
     * @returns A new Vector2 object with the result of the division
     */
    public static divideScalar(v: Vector2, n: number): Vector2
    {
        return new Vector2(v.x / n, v.y / n);
    }

    /**
     * Computes the distance between two Vector2 objects
     * 
     * @param v1 - The first Vector2 object
     * @param v2 - The second Vector2 object
     * @returns The distance between the two input vectors
     */
    public static distanceBetween(v1: Vector2, v2: Vector2): number
    {
        return v1.distanceTo(v2);
    }

    /**
     * Computes the angle between two Vector2 objects
     * 
     * @param v1 - The first Vector2 object
     * @param v2 - The second Vector2 object
     * @returns The angle between the two input vectors
     */
    public static angleBetween(v1: Vector2, v2: Vector2): number
    {
        return v1.angleBetween(v2);
    }

    /**
     * Computes the angle between two Vector2 objects with sign 
     * 
     * @param v1 - The first Vector2 object
     * @param v2 - The second Vector2 object
     * @returns The signed angle between the two input vectors
     */
    public static angleBetweenSigned(v1: Vector2, v2: Vector2): number
    {
        return v1.angleBetweenSigned(v2);
    }

    /**
     * Computes the dot product of two Vector2 objects
     * 
     * @param v1 - The first Vector2 object
     * @param v2 - The second Vector2 object
     * @returns The dot product of the two input vectors
     */
    public static dot(v1: Vector2, v2: Vector2): number
    {
        return v1.x*v2.x + v1.y*v2.y;
    }

    /**
     * Returns the normalized Vector2 of an input Vector2
     * 
     * @param v - The Vector2 object to be normalized
     * @returns The normalized Vector2
     */
    public static normalize(v: Vector2): Vector2
    {
        const sizeSquared = v.x*v.x + v.y*v.y;
        
        // zero vectors
        if(sizeSquared < 1e-8)
            return new Vector2();

        const scaleFactor = 1 / Math.sqrt(sizeSquared);
        return new Vector2(v.x * scaleFactor, v.y * scaleFactor);
    }

    /**
     * Rotates an input Vector2 by a given angle
     * 
     * @param v - The Vector2 object to be rotated
     * @param angle - The angle to rotate the Vector2 by
     * @returns The rotated Vector2 
     */
    public static rotate(v: Vector2, angle: number): Vector2
    {
        return new Vector2(Math.cos(angle)*v.x - Math.sin(angle)*v.y, Math.sin(angle)*v.x + Math.cos(angle)*v.y); 
    }

    /**
     * Transforms an input Vector2 as a point by a given Matrix3
     * 
     * @param v - The Vector2 object to be transformed
     * @param m - The Matrix3 to transform the Vector2 by
     * @returns The transformed Vector2
     */
    public static transformPoint(v: Vector2, m: Matrix3): Vector2
    {
        const result = new Vector2();
        const w = 1 / (m.mat[2]*v.x + m.mat[5]*v.y + m.mat[8]);
        result.x = w * (m.mat[0]*v.x + m.mat[3]*v.y + m.mat[6]);
        result.y = w * (m.mat[1]*v.x + m.mat[4]*v.y + m.mat[7]);
        return result;
    }

    /**
     * Transforms an input Vector2 as a direction by a given Matrix3, ignoring the translation component
     * 
     * @param v - The Vector2 object to be transformed
     * @param m - The Matrix3 to transform the Vector2 by
     * @returns The transformed Vector2
     */
    public static transformVector(v: Vector2, m: Matrix3): Vector2
    {
        const result = new Vector2();
        const w = 1 / (m.mat[2]*v.x + m.mat[5]*v.y + m.mat[8]);
        result.x = w * (m.mat[0]*v.x + m.mat[3]*v.y);
        result.y = w * (m.mat[1]*v.x + m.mat[4]*v.y);
        return result;
    }

    /**
     * Linearly interpolates between two Vector2 objects
     * 
     * @param v1 - The first Vector2 object
     * @param v2 - The second Vector2 object
     * @param alpha - The interpolation value between 0 and 1
     * @returns The interpolated Vector2
     */
    public static lerp(v1: Vector2, v2: Vector2, alpha: number): Vector2
    {
        return new Vector2(
            v1.x * (1-alpha) + v2.x * alpha,
            v1.y * (1-alpha) + v2.y * alpha
        );
    }

    public x: number;
    public y: number;
    
    /**
     * Constructor for Vector2 class
     * 
     * @param x - The initial x coordinate of the Vector2
     * @param y - The initial y coordinate of the Vector2
     */
    constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }

    /**
     * Sets the coordinates of the Vector2
     * 
     * @param x - The new x coordinate of the Vector2
     * @param y - The new y coordinate of the Vector2
     */
    set(x: number, y: number): void
    {
        this.x = x;
        this.y = y;
    }

    /**
     * Copies the coordinates of a Vector2 object
     * 
     * @param v - The Vector2 object to copy
     */
    copy(v: Vector2): void
    {
        this.x = v.x;
        this.y = v.y;
    }

    /**
     * Clones the Vector2 object
     * 
     * @returns A new Vector2 object with the same coordinates as the original
     */
    clone(): Vector2
    {
        return new Vector2(this.x, this.y);
    }

    /**
     * Checks if two Vector2 objects have the same coordinates
     * 
     * @param v - The Vector2 object to compare
     * @returns true if the coordinates of both Vector2 objects are the same, false otherwise
     */
    equals(v: Vector2): boolean
    {
        return this.x == v.x && this.y == v.y;
    }

    /**
     * Adds the components of a given Vector2 to this Vector2
     * 
     * @param v - The Vector2 to add to this Vector2
     */
    add(v: Vector2): void
    {
        this.x += v.x;
        this.y += v.y;
    }

    /**
     * Subtracts the components of a given Vector2 from this Vector2
     * 
     * @param v - The Vector2 to subtract from this Vector2
     */
    subtract(v: Vector2): void
    {
        this.x -= v.x;
        this.y -= v.y;
    }

    /**
     * Multiplies the components of a given Vector2 by this Vector2
     * 
     * @param v - The Vector2 to multiply this Vector2 by
     */
    multiply(v: Vector2): void
    {
        this.x *= v.x;
        this.y *= v.y;
    }

    /**
     * Divides the components of this Vector2 by a given Vector2
     * 
     * @param v - The Vector2 to divide this Vector2 by
     */
    divide(v: Vector2): void
    {
        this.x /= v.x;
        this.y /= v.y;
    }

    /**
     * Multiplies the Vector2 by a scalar value
     * 
     * @param n - The scalar value to multiply by
     */
    multiplyScalar(n: number): void
    {
        this.x *= n;
        this.y *= n;
    }

    /**
     * Divides the Vector2 by a scalar value
     * 
     * @param n - The scalar value to divide by
     */
    divideScalar(n: number): void
    {
        this.x /= n;
        this.y /= n;
    }

    /**
     * Calculates the distance between this Vector2 and another Vector2
     * 
     * @param v - The Vector2 to calculate the distance to
     * @returns The distance between the two Vector2 objects
     */
    distanceTo(v: Vector2): number
    {
        return Math.sqrt(
            (this.x - v.x) * (this.x - v.x) + 
            (this.y - v.y) * (this.y - v.y) 
        );
    }

    /**
     * Sets the position of this Vector2 from a Matrix3
     * 
     * @param m - The Matrix3 to get the position from
     */
    setPositionFromMatrix(m: Matrix3): void
    {
        this.x = m.mat[6];
        this.y = m.mat[7];
    }

    /**
     * Sets the scale of this Vector2 from a Matrix3
     * 
     * @param m - The Matrix3 to get the scale from
     */
    setScaleFromMatrix(m: Matrix3): void
    {
        this.x = Math.sqrt(m.mat[0]*m.mat[0] + m.mat[1]*m.mat[1]);
        this.y = Math.sqrt(m.mat[3]*m.mat[3] + m.mat[4]*m.mat[4]);
    }

    /**
     * Transforms this Vector2 object with a Matrix3
     * 
     * @param m - The Matrix3 to transform this Vector2 with
     */
    transformPoint(m: Matrix3): void
    {
        const v = this.clone();
        const w = 1 / (m.mat[2]*v.x + m.mat[5]*v.y + m.mat[8]);
        this.x = w * (m.mat[0]*v.x + m.mat[3]*v.y + m.mat[6]);
        this.y = w * (m.mat[1]*v.x + m.mat[4]*v.y + m.mat[7]);
    }

    /**
     * Transforms this Vector2 object with a Matrix3, ignoring the translation component
     * 
     * @param m - The Matrix3 to transform this Vector2 with
     */
    transformVector(m: Matrix3): void
    {
        const v = this.clone();
        const w = 1 / (m.mat[2]*v.x + m.mat[5]*v.y + m.mat[8]);
        this.x = w * (m.mat[0]*v.x + m.mat[3]*v.y);
        this.y = w * (m.mat[1]*v.x + m.mat[4]*v.y);
    }

    /**
     * Calculates the dot product of this Vector2 and another Vector2
     * 
     * @param v - The Vector2 to calculate the dot product with
     * @returns The dot product of the two Vector2 objects
     */
    dot(v: Vector2): number
    {
        return this.x*v.x + this.y*v.y;
    }
    
    /**
     * Calculates the length of this Vector2
     * 
     * @returns The length of this Vector2
     */
    length(): number
    {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }
    
    /**
     * Normalizes this Vector2
     */
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

    /**
     * Inverts this Vector2
     */
    invert(): void
    {
        this.x = -this.x;
        this.y = -this.y;
    }

    /**
     * Calculates the angle between this Vector2 and another Vector2
     * 
     * @param v - The Vector2 to calculate the angle between
     * @returns The angle between the two Vector2 objects
     */
    angleBetween(v: Vector2): number
    {
        const v1Norm = Vector2.normalize(this);
        const v2Norm = Vector2.normalize(v);

        return Math.acos(v1Norm.dot(v2Norm));
    }
    
    /**
     * Calculates the signed angle between this Vector2 and another Vector2
     * 
     * @param v - The Vector2 to calculate the angle between
     * @returns The signed angle between the two Vector2 objects
     */
    angleBetweenSigned(v: Vector2): number
    {
        const v1Norm = Vector2.normalize(this);
        const v2Norm = Vector2.normalize(v);

        return Math.atan2(v2Norm.y,v2Norm.x) - Math.atan2(v1Norm.y, v1Norm.x)
    }

    /**
     * Rotates this Vector2 by a given angle
     * 
     * @param angle - The angle to rotate by in radians
     */
    rotate(angle: number): void
    {
        const x = this.x;
        const y = this.y;
        this.x = Math.cos(angle)*x - Math.sin(angle)*y;
        this.y = Math.sin(angle)*x + Math.cos(angle)*y; 
    }

    /**
     * Calculates the linear interpolation between two Vector2 objects
     * 
     * @param v1 - The first Vector2 object
     * @param v2 - The second Vector2 object
     * @param alpha - The interpolation value between 0 and 1
     */
    lerp(v1: Vector2, v2: Vector2, alpha: number): void
    {
        this.x = v1.x * (1-alpha) + v2.x * alpha;
        this.y = v1.y * (1-alpha) + v2.y * alpha;
    }
}