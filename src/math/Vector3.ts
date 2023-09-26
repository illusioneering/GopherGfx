import { MathUtils } from './MathUtils';
import { Matrix4 } from './Matrix4'
import { Quaternion } from './Quaternion';

/**
 * This class holds the x,y,z components of a 3D point or vector.  It includes linear algebra routines for
 * working with vectors (e.g., dot product, cross product).
 * 
 * Most of the functions in the class are defined both as member functions that can be called on a specific
 * instance of Vector3 *and* as static functions.  The static functions return a *new* result, leaving the
 * original inputs unchanged, whereas, in general, member functions save the result in this vector itself
 * and return void:
 * ```
 * const v = new Vector3(1, 2, 3);
 * const w = new Vector3(4, 5, 6);
 * 
 * // saves the result in n, v and w are unchanged.
 * const n = Vector3.cross(v, w);
 * 
 * // saves the result in v and returns null.  v now becomes v crossed-with w.
 * v.cross(w);
 * ```
 */
export class Vector3
{
    /**
     * A static property to provide quick access to a Vector3 with all of its x,y,z components equal to zero.
     * (Note: Be careful not to change the value of this field!  It is marked readonly, but typescipt do not completely
     * enforce this!)
     * ```
     * // Good use of ZERO:
     * const p = new Vector3();
     * if (p.equals(Vector3.ZERO)) {
     *   console.log("p is (0,0,0)")
     * }
     * 
     * // Dangerous use of ZERO!!!!
     * const p = Vector3.ZERO;  // makes p a reference to Vector3.ZERO
     * p.add(new Vector3(1, 0, 0)); // changes Vector3.ZERO!
     * 
     * // Do this instead:
     * const p = Vector3.copy(Vector3.ZERO); // or "new Vector3();" or another function that returns a NEW Vector3 object
     * p.add(new Vector3(1, 0, 0));
     */
    public static readonly ZERO = new Vector3(0, 0, 0);

    /**
     * A Vector3 object with all one values.  (See note in the Vector3.ZERO docs for important usage info.)
     */
    public static readonly ONE = new Vector3(1, 1, 1);

    /**
     * A Vector3 object that points up.  (See note in the Vector3.ZERO docs for important usage info.)
     */
    public static readonly UP = new Vector3(0, 1, 0);

    /**
     * A Vector3 object that points down.  (See note in the Vector3.ZERO docs for important usage info.)
     */
    public static readonly DOWN = new Vector3(0, -1, 0);

    /**
     * A Vector3 object that points left.  (See note in the Vector3.ZERO docs for important usage info.)
     */
    public static readonly LEFT = new Vector3(-1, 0, 0);

    /**
     * A Vector3 object that points right.  (See note in the Vector3.ZERO docs for important usage info.)
     */
    public static readonly RIGHT = new Vector3(1, 0, 0);

    /**
     * A Vector3 object that points forward.  (See note in the Vector3.ZERO docs for important usage info.)
     */
    public static readonly FORWARD = new Vector3(0, 0, -1);

    /**
     * A Vector3 object that points backward.  (See note in the Vector3.ZERO docs for important usage info.)
     */
    public static readonly BACK = new Vector3(0, 0, 1);

    /**
     * A Vector3 object that points along the x-axis.  (See note in the Vector3.ZERO docs for important usage info.)
     */
    public static readonly X_AXIS = Vector3.RIGHT;

    /**
     * A Vector3 object that points along the y-axis.  (See note in the Vector3.ZERO docs for important usage info.)
     */
    public static readonly Y_AXIS = Vector3.UP;

    /**
     * A Vector3 object that points along the z-axis.  (See note in the Vector3.ZERO docs for important usage info.)
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
    public static transformPoint(v: Vector3, m: Matrix4): Vector3
    {
        const result = new Vector3();
        const w = 1 / (m.mat[3]*v.x + m.mat[7]*v.y + m.mat[11]*v.z + m.mat[15]);
        result.x = w * (m.mat[0]*v.x + m.mat[4]*v.y + m.mat[8]*v.z + m.mat[12]);
        result.y = w * (m.mat[1]*v.x + m.mat[5]*v.y + m.mat[9]*v.z + m.mat[13]);
        result.z = w * (m.mat[2]*v.x + m.mat[6]*v.y + m.mat[10]*v.z + m.mat[14]);
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
        const result = new Vector3();
        const w = 1 / (m.mat[3]*v.x + m.mat[7]*v.y + m.mat[11]*v.z + m.mat[15]);
        result.x = w * (m.mat[0]*v.x + m.mat[4]*v.y + m.mat[8]*v.z);
        result.y = w * (m.mat[1]*v.x + m.mat[5]*v.y + m.mat[9]*v.z);
        result.z = w * (m.mat[2]*v.x + m.mat[6]*v.y + m.mat[10]*v.z);
        return result;
    }

    /**
     * Reflects a vector about a normal
     *
     * @param v - The vector to reflect
     * @param n - The normal to reflect about
     * @returns A new Vector3 object that represents the result of reflecting v about n
     */
    public static reflect(v: Vector3, n: Vector3): Vector3
    {
        const result = n.clone();
        result.multiplyScalar(v.dot(n) * -2);
        result.add(v);
        return result;
    }

    /**
     * Checks if the x,y,z components of two Vector3 objects are exactly equal.
     *
     * @param v1 - The first Vector3 object
     * @param v2 - The second Vector3 object
     * @returns A boolean value indicating if the Vector3 objects are equal
     */
    public static equals(v1: Vector3, v2: Vector3): boolean
    {
        return v1.x == v2.x && v1.y == v2.y && v1.z == v2.z;
    }

    /**
     * Checks if the x,y,z components of two Vector3 objects are equal within a small value of epsilon.
     *
     * @param v1 - The first Vector3 object
     * @param v2 - The second Vector3 object
     * @param epsilon - A small value of acceptable variance to account for numerical instability
     * @returns A boolean value indicating if the Vector3 objects are equal
     */
    public static fuzzyEquals(v1: Vector3, v2: Vector3, epsilon: number = MathUtils.EPSILON): boolean
    {
        return Math.abs(v1.x - v2.x) < epsilon && Math.abs(v1.y - v2.y) < epsilon && Math.abs(v1.z - v2.z) < epsilon;
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
     * Checks if the x,y,z components of this Vector3 are exactly equal to those of the given Vector3
     *
     * @param v - The Vector3 object to compare to
     * @returns A boolean value indicating if the Vector3 objects are equal
     */
    equals(v: Vector3): boolean
    {
        return this.x == v.x && this.y == v.y && this.z == v.z;
    }

    /**
     * Checks if the x,y,z components of this Vector3 are equal (within a small value of epsilon) 
     * to those of the given Vector3.
     *
     * @param v - The Vector3 object to compare to
     * @param epsilon - A small value of acceptable variance to account for numerical instability
     * @returns A boolean value indicating if the Vector3 objects are equal
     */
    fuzzyEquals(v: Vector3, epsilon: number = MathUtils.EPSILON): boolean
    {
        return Math.abs(this.x - v.x) < epsilon && Math.abs(this.y - v.y) < epsilon && Math.abs(this.z - v.z) < epsilon;
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
     * Inverts a Vector3 object and returns the result as a new Vector3 object
     *
     */
    inverse(): Vector3
    {
        return new Vector3(-this.x, -this.y, -this.z);
    }


    /**
     * Transforms this Vector3 instance as a point with a given Matrix4
     *
     * @param m - The Matrix4 to transform this Vector3
     */
    transformPoint(m: Matrix4): void
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
        const w = 1 / (m.mat[3]*v.x + m.mat[7]*v.y + m.mat[11]*v.z + m.mat[15]);
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
        // Extract the vector part of the quaternion
        const u = new Vector3(q.x, q.y, q.z);

        // vprime = 2.0f * dot(u, v) * u
        const result = Vector3.multiplyScalar(u, 2 * u.dot(this));

        // + (s*s - dot(u, u)) * v
        result.add(Vector3.multiplyScalar(this, q.w * q.w - u.dot(u)));

        const crossUV = Vector3.cross(u, this);
        crossUV.multiplyScalar(2 * q.w);
        result.add(crossUV);

        this.copy(result);
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

    /**
     * Reflects this vector about a normal
     *
     * @param n - The normal to reflect about
     */
    reflect(normal: Vector3): void
    {
        const reflection = normal.clone();
        reflection.multiplyScalar(this.dot(normal) * -2);
        reflection.add(this);
        this.copy(reflection);
    }
}