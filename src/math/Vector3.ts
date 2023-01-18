import { Matrix4 } from './Matrix4'
import { Quaternion } from './Quaternion';

export class Vector3
{
    /**
     * A Vector3 object with all zero values
     */
    public static readonly ZERO = new Vector3(0, 0, 0);

    /**
     * A Vector3 object with all one values
     */
    public static readonly ONE = new Vector3(1, 1, 1);

    /**
     * A Vector3 object that points up
     */
    public static readonly UP = new Vector3(0, 1, 0);

    /**
     * A Vector3 object that points down
     */
    public static readonly DOWN = new Vector3(0, -1, 0);

    /**
     * A Vector3 object that points left
     */
    public static readonly LEFT = new Vector3(-1, 0, 0);

    /**
     * A Vector3 object that points right
     */
    public static readonly RIGHT = new Vector3(1, 0, 0);

    /**
     * A Vector3 object that points forward
     */
    public static readonly FORWARD = new Vector3(0, 0, -1);

    /**
     * A Vector3 object that points backward
     */
    public static readonly BACK = new Vector3(0, 0, 1);

    /**
     * A Vector3 object that points along the x-axis
     */
    public static readonly X_AXIS = Vector3.RIGHT;

    /**
     * A Vector3 object that points along the y-axis
     */
    public static readonly Y_AXIS = Vector3.UP;

    /**
     * A Vector3 object that points along the z-axis
     */
    public static readonly Z_AXIS = Vector3.FORWARD;

    /**
     * Copies the values of a Vector3 object
     * 
     * @param v - The Vector3 object to copy
     * @returns A new Vector3 object with the same x, y, and z values as the original
     */
    public static copy(v: Vector3): Vector3
    {
        return new Vector3(v.x, v.y, v.z);
    }

    /**
     * Inverts the direction of a Vector3 object
     * 
     * @param v - The Vector3 object to invert
     * @returns A new Vector3 object with the opposite direction of the original
     */
    public static inverse(v: Vector3): Vector3
    {
        return new Vector3(-v.x, -v.y, -v.z);
    }

    /**
     * Adds two Vector3 objects together
     * 
     * @param v1 - The first Vector3 object
     * @param v2 - The second Vector3 object
     * @returns A new Vector3 object with the x, y, and z values equal to the sum of the corresponding values of the input vectors
     */
    public static add(v1: Vector3, v2: Vector3): Vector3
    {
        return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }

    /**
     * Subtracts two Vector3 objects
     * 
     * @param v1 - The Vector3 object to subtract from
     * @param v2 - The Vector3 object to subtract
     * @returns A new Vector3 object with the x, y, and z values equal to the difference of the corresponding values of the input vectors
     */
    public static subtract(v1: Vector3, v2: Vector3): Vector3
    {
        return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }

    /**
     * Multiply two Vector3 objects
     * 
     * @param v1 - The first Vector3 object
     * @param v2 - The second Vector3 object
     * @returns A new Vector3 object with the x, y, and z values equal to the product of the corresponding values of the input vectors
     */
    public static multiply(v1: Vector3, v2: Vector3): Vector3
    {
        return new Vector3(v1.x * v2.x, v1.y * v2.y, v1.z * v2.z);
    }

    /**
     * Divide two Vector3 objects
     * 
     * @param v1 - The Vector3 object to divide
     * @param v2 - The Vector3 object to divide by
     * @returns A new Vector3 object with the x, y, and z values equal to the quotient of the corresponding values of the input vectors
     */
    public static divide(v1: Vector3, v2: Vector3): Vector3
    {
        return new Vector3(v1.x / v2.x, v1.y / v2.y, v1.z / v2.z);
    }

    /**
     * Computes the dot product of two Vector3 objects
     * 
     * @param v1 - The first Vector3 object
     * @param v2 - The second Vector3 object
     * @returns The dot product of the two input vectors
     */
    public static dot(v1: Vector3, v2: Vector3): number
    {
        return v1.x*v2.x + v1.y*v2.y + v1.z*v2.z;
    }

    /**
     * Computes the cross product of two Vector3 objects
     * 
     * @param v1 - The first Vector3 object
     * @param v2 - The second Vector3 object
     * @returns A new Vector3 object representing the cross product of the two input vectors
     */
    public static cross(v1: Vector3, v2: Vector3): Vector3
    {
        return new Vector3(
            v1.y * v2.z - v1.z * v2.y,
            v1.z * v2.x - v1.x * v2.z,
            v1.x * v2.y - v1.y * v2.x
        );
    }

    /**
     * Multiplies a Vector3 object with a scalar value
     * 
     * @param v - The Vector3 object
     * @param n - The scalar value
     * @returns A new Vector3 object with the x, y, and z values multiplied by the scalar value
     */
    public static multiplyScalar(v: Vector3, n: number): Vector3
    {
        return new Vector3(v.x * n, v.y * n, v.z * n);
    }

    /**
     * Divides a Vector3 object by a scalar value
     * 
     * @param v - The Vector3 object
     * @param n - The scalar value
     * @returns A new Vector3 object with the x, y, and z values divided by the scalar value
     */
    public static divideScalar(v: Vector3, n: number): Vector3
    {
        return new Vector3(v.x / n, v.y / n, v.z / n);
    }

    /**
     * Normalizes a Vector3 object
     * 
     * @param v - The Vector3 object
     * @returns A new Vector3 object with a magnitude of 1, pointing in the same direction as the original vector
     *          If the original vector is a zero vector, returns a new zero vector
     */
    public static normalize(v: Vector3): Vector3
    {
        const sizeSquared = v.x*v.x + v.y*v.y + v.z*v.z;
        
        // zero vectors
        if(sizeSquared < 1e-8)
            return new Vector3();

        const scaleFactor = 1 / Math.sqrt(sizeSquared);
        return new Vector3(v.x * scaleFactor, v.y * scaleFactor, v.z * scaleFactor);
    }

    /**
     * Computes the angle in radians between two Vector3 objects
     * 
     * @param v1 - The first Vector3 object
     * @param v2 - The second Vector3 object
     * @returns The angle in radians between the two input vectors
     */
    public static angleBetween(v1: Vector3, v2: Vector3): number
    {
        return v1.angleBetween(v2);
    }

    /**
     * Computes the distance between two Vector3 objects
     * 
     * @param v1 - The first Vector3 object
     * @param v2 - The second Vector3 object
     * @returns The distance between the two input vectors
     */
    public static distanceBetween(v1: Vector3, v2: Vector3): number
    {
        return v1.distanceTo(v2);
    }

    /**
     * Rotates a Vector3 object by a Quaternion
     *
     * @param v - The Vector3 object to rotate
     * @param q - The Quaternion object to rotate the Vector3 by
     * @returns A new Vector3 object that represents the result of rotating v by q
     */
    public static rotate(v: Vector3, q: Quaternion): Vector3
    {
        // Extract the vector part of the quaternion
        const u = new Vector3(q.x, q.y, q.z);

        // vprime = 2.0f * dot(u, v) * u
        const result = Vector3.multiplyScalar(u, 2 * u.dot(v));

        // + (s*s - dot(u, u)) * v
        result.add(Vector3.multiplyScalar(v, q.w * q.w - u.dot(u)));

        const crossUV = Vector3.cross(u, v);
        crossUV.multiplyScalar(2 * q.w);
        result.add(crossUV);

        return result;
    }

    /**
     * Linearly interpolates between two Vector3 objects
     *
     * @param v1 - The first Vector3 object
     * @param v2 - The second Vector3 object
     * @param alpha - The interpolation value between 0 and 1
     * @returns A new Vector3 object that represents the result of interpolating between v1 and v2
     */
    public static lerp(v1: Vector3, v2: Vector3, alpha: number): Vector3
    {
        return new Vector3(
            v1.x * (1-alpha) + v2.x * alpha,
            v1.y * (1-alpha) + v2.y * alpha,
            v1.z * (1-alpha) + v2.z * alpha
        );
    }

    /**
     * Transforms a Vector3 object representing a point by a Matrix4
     *
     * @param v - The Vector3 object to transform
     * @param m - The Matrix4 object to transform the Vector3 by
     * @returns A new Vector3 object that represents the result of transforming point v by m
     */
    public static transform(v: Vector3, m: Matrix4): Vector3
    {
        const result = new Vector3(v.x, v.y, v.z);
        result.transform(m);
        return result;
    }

    /**
     * Transforms a Vector3 object representing a direction by a Matrix4, ignoring the translation component
     *
     * @param v - The Vector3 object to transform
     * @param m - The Matrix4 object to transform the Vector3 by
     * @returns A new Vector3 object that represents the result of transforming direction v by m
     */
    public static transformVector(v: Vector3, m: Matrix4): Vector3
    {
        const result = new Vector3(v.x, v.y, v.z);
        result.transformVector(m);
        return result;
    }

    public x: number;
    public y: number;
    public z: number;

    /**
     * Constructs a Vector3 object from x, y, and z values
     *
     * @param x - The x value for the Vector3
     * @param y - The y value for the Vector3
     * @param z - The z value for the Vector3
     */
    constructor(x = 0, y = 0, z = 0)
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Sets the x, y, and z values of a Vector3 object
     *
     * @param x - The x value to set
     * @param y - The y value to set
     * @param z - The z value to set
     */
    set(x: number, y: number, z: number): void
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Copies a Vector3 object
     *
     * @param v - The Vector3 object to copy
     */
    copy(v: Vector3): void
    {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
    }

    /**
     * Creates a new Vector3 object with the same x, y, and z values as this Vector3
     *
     * @returns The cloned Vector3 object
     */
    clone(): Vector3
    {
        return new Vector3(this.x, this.y, this.z);
    }

    /**
     * Checks if this Vector3 is equal to the given Vector3
     *
     * @param v - The Vector3 object to compare to
     * @returns A boolean value indicating if the Vector3 objects are equal
     */
    equals(v: Vector3): boolean
    {
        return this.x == v.x && this.y == v.y && this.z == v.z;
    }

    /**
     * Adds the given Vector3 to this Vector3
     *
     * @param v - The Vector3 object to add
     */
    add(v: Vector3): void
    {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
    }

    /**
     * Subtracts the given Vector3 from this Vector3
     *
     * @param v - The Vector3 object to subtract
     */
    subtract(v: Vector3): void
    {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
    }

    /**
     * Multiplies this Vector3 by the given Vector3
     *
     * @param v - The Vector3 object to multiply
     */
    multiply(v: Vector3): void
    {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
    }

    /**
     * Divides each component of the vector with that of another vector
     *
     * @param v - Vector to divide with
     */
    divide(v: Vector3): void
    {
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z;
    }

    /**
     * Compute the dot product of two Vector3 objects
     * 
     * @param v - The other Vector3 object
     * @returns The dot product of the two Vector3 objects
     */
    dot(v: Vector3): number
    {
        return this.x*v.x + this.y*v.y + this.z*v.z;
    }

    /**
     * Computes the cross product of two Vector3s and stores the result in the original Vector3.
     *
     * @param v The Vector3 to compute the cross product with.
     */
    cross(v: Vector3): void
    {
        const crossProduct =  new Vector3(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
        this.copy(crossProduct);
    }

    /**
     * Multiplies each component of the vector with a scalar value
     *
     * @param n - Scalar value to multiply with
     */
    multiplyScalar(n: number): void
    {
        this.x *= n;
        this.y *= n;
        this.z *= n;
    }

    /**
     * Divides each component of the vector with a scalar value
     *
     * @param n - Scalar value to divide with
     */
    divideScalar(n: number): void
    {
        this.x /= n;
        this.y /= n;
        this.z /= n;
    }

    /**
     * Calculates the length of a Vector3 object
     *
     * @returns The length of the Vector3 object
     */
    length(): number
    {
        return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
    }

    /**
     * Normalizes a Vector3 object
     *
     */
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

    /**
     * Inverts a Vector3 object
     *
     */
    invert(): void
    {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
    }

    /**
     * Transforms this Vector3 instance as a point with a given Matrix4
     *
     * @param m - The Matrix4 to transform this Vector3
     */
    transform(m: Matrix4): void
    {
        const v = this.clone();
        const w = 1 / (m.mat[3]*v.x + m.mat[7]*v.y + m.mat[11]*v.z + m.mat[15]);
        this.x = w * (m.mat[0]*v.x + m.mat[4]*v.y + m.mat[8]*v.z + m.mat[12]);
        this.y = w * (m.mat[1]*v.x + m.mat[5]*v.y + m.mat[9]*v.z + m.mat[13]);
        this.z = w * (m.mat[2]*v.x + m.mat[6]*v.y + m.mat[10]*v.z + m.mat[14]);
    }

    /**
     * Transforms this Vector3 instance as a direction with a given Matrix4, ignoring the translation component
     *
     * @param m - The Matrix4 to transform this Vector3
     */
    transformVector(m: Matrix4): void
    {
        const v = this.clone();
        const w = 1 / (m.mat[3]*v.x + m.mat[7]*v.y + m.mat[11]*v.z);
        this.x = w * (m.mat[0]*v.x + m.mat[4]*v.y + m.mat[8]*v.z);
        this.y = w * (m.mat[1]*v.x + m.mat[5]*v.y + m.mat[9]*v.z);
        this.z = w * (m.mat[2]*v.x + m.mat[6]*v.y + m.mat[10]*v.z);
    }

    /**
     * Rotates this Vector3 instance by a given Quaternion
     *
     * @param q - The Quaternion to rotate this Vector3
     */
    rotate(q: Quaternion): void
    {
        this.copy(Vector3.rotate(this, q));
    }

    /**
     * Computes the angle between this Vector3 and another Vector3
     *
     * @param v - The second Vector3
     * @returns The angle between the two Vectors
     */
    angleBetween(v: Vector3): number
    {
        const v1Norm = Vector3.normalize(this);
        const v2Norm = Vector3.normalize(v);

        return Math.acos(v1Norm.dot(v2Norm));
    }

    /**
     * Computes the distance between this Vector3 and another Vector3
     *
     * @param v - The second Vector3
     * @returns The distance between the two Vectors
     */
    distanceTo(v: Vector3): number
    {
        return Math.sqrt(
            (this.x - v.x) * (this.x - v.x) + 
            (this.y - v.y) * (this.y - v.y) +
            (this.z - v.z) * (this.z - v.z) 
        );
    }

    /**
     * Sets this Vector3's position to the provided Matrix4's position
     *
     * @param m - The Matrix4 to get the position from
     */
    setPositionFromMatrix(m: Matrix4): void
    {
        this.x = m.mat[12];
        this.y = m.mat[13];
        this.z = m.mat[14];
    }

    /**
     * Sets this Vector3's scale to the provided Matrix4's scale
     *
     * @param m - The Matrix4 to get the scale from
     */
    setScaleFromMatrix(m: Matrix4): void
    {
        this.x = Math.sqrt(m.mat[0]*m.mat[0] + m.mat[1]*m.mat[1] + m.mat[2]*m.mat[2]);
        this.y = Math.sqrt(m.mat[4]*m.mat[4] + m.mat[5]*m.mat[5] + m.mat[6]*m.mat[6]);
        this.z = Math.sqrt(m.mat[8]*m.mat[8] + m.mat[9]*m.mat[9] + m.mat[10]*m.mat[10]);
    }

    /**
     * Linearly interpolates between two Vector3s
     *
     * @param v1 - The starting Vector3
     * @param v2 - The ending Vector3
     * @param alpha - The interpolation amount (should be in the range [0, 1])
     */
    lerp(v1: Vector3, v2: Vector3, alpha: number): void
    {
        this.x = v1.x * (1-alpha) + v2.x * alpha;
        this.y = v1.y * (1-alpha) + v2.y * alpha;
        this.z = v1.z * (1-alpha) + v2.z * alpha;
    }
}