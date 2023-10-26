import { Vector3 } from "./Vector3";
import { Quaternion } from "./Quaternion";
import { MathUtils } from "./MathUtils";

/**
 * This class holds a 4x4 transformation matrix.  It includes routines for using the matrix to 
 * transform points and vectors.  It includes routines for constructing many common types of matrices
 * (see make*), for inverting the matrix, and for accessing the underlying 16-elements by row, column.
 * 
 * Most of the functions in the class are defined both as member functions that can be called on a specific
 * instance of Vector3 *and* as static functions.  The static functions return a *new* result, leaving the
 * original inputs unchanged, whereas, in general, member functions save the result in the matrix itself
 * and return void:
 * ```
 * const T = Matrix4.makeTranslation(new Vector3(1, 2, 3));
 * const R = Matrix4.makeRotationX(Math.PI);
 * const S = Matrix4.makeScale(new Vector3(2, 2, 2));
 * 
 * // saves the result in M, leaving T, R, and S unchanged.
 * const M = Matrix4.multiplyAll(T, R, S);
 * 
 * // each call to multiply overwrites the previous contents of M2 with the result of the multiplication
 * const M2 = Matrix4.makeIdentity();
 * M2.multiply(T);
 * M2.multiply(R);
 * M2.multiply(S); 
 * ```
 */
export class Matrix4
{
    /**
     * Static field to provide quick access to the identity matrix.
     * (Note: Be careful not to change the value of this field!  It is marked readonly, but typescipt do not completely
     * enforce this!)
     * ```
     * // Good use of IDENTITY:
     * const M = gfx.Matrix4();
     * if (M.equals(gfx.Matrix4.IDENTITY)) {
     *   console.log("We have an identity matrix.")
     * }
     * 
     * // Dangerous use of IDENTITY!!!!
     * const M = gfx.Matrix4.IDENTITY;  // makes M a reference to gfx.Matrix4.IDENTITY
     * M.set(3.0, 3, 3); // changes the underlying matrix in gfx.Matrix4.IDENTITY!
     * 
     * // Do this instead:
     * const M = gfx.Matrix4.makeIdentity(); // create a new identity matrix M
     * M.set(3.0, 3, 3);
     */
    public static readonly IDENTITY = new Matrix4();

    /**
     * Array of 16 numbers representing the elements in the Matrix4
     */
    public mat: Array<number>;

    /**
     * Multiplies two Matrix4 objects and returns the result in a new matrix.
     * 
     * @param lhs - The first Matrix4 object
     * @param rhs - The second Matrix4 object
     * @returns A new matrix = lhs * rhs
     */
    static multiply(lhs: Matrix4, rhs: Matrix4): Matrix4
    {
         // This implementation is several orders of magnitude faster than using nested loops
         const m = new Matrix4();
        
        // Column 0
        m.mat[0] = rhs.mat[0] * lhs.mat[0] + rhs.mat[1] * lhs.mat[4] + rhs.mat[2] * lhs.mat[8] + rhs.mat[3] * lhs.mat[12];
        m.mat[1] = rhs.mat[0] * lhs.mat[1] + rhs.mat[1] * lhs.mat[5] + rhs.mat[2] * lhs.mat[9] + rhs.mat[3] * lhs.mat[13];
        m.mat[2] = rhs.mat[0] * lhs.mat[2] + rhs.mat[1] * lhs.mat[6] + rhs.mat[2] * lhs.mat[10] + rhs.mat[3] * lhs.mat[14];
        m.mat[3] = rhs.mat[0] * lhs.mat[3] + rhs.mat[1] * lhs.mat[7] + rhs.mat[2] * lhs.mat[11] + rhs.mat[3] * lhs.mat[15];

        // Column 1
        m.mat[4] = rhs.mat[4] * lhs.mat[0] + rhs.mat[5] * lhs.mat[4] + rhs.mat[6] * lhs.mat[8] + rhs.mat[7] * lhs.mat[12];
        m.mat[5] = rhs.mat[4] * lhs.mat[1] + rhs.mat[5] * lhs.mat[5] + rhs.mat[6] * lhs.mat[9] + rhs.mat[7] * lhs.mat[13];
        m.mat[6] = rhs.mat[4] * lhs.mat[2] + rhs.mat[5] * lhs.mat[6] + rhs.mat[6] * lhs.mat[10] + rhs.mat[7] * lhs.mat[14];
        m.mat[7] = rhs.mat[4] * lhs.mat[3] + rhs.mat[5] * lhs.mat[7] + rhs.mat[6] * lhs.mat[11] + rhs.mat[7] * lhs.mat[15];

        // Column 2
        m.mat[8] = rhs.mat[8] * lhs.mat[0] + rhs.mat[9] * lhs.mat[4] + rhs.mat[10] * lhs.mat[8] + rhs.mat[11] * lhs.mat[12];
        m.mat[9] = rhs.mat[8] * lhs.mat[1] + rhs.mat[9] * lhs.mat[5] + rhs.mat[10] * lhs.mat[9] + rhs.mat[11] * lhs.mat[13];
        m.mat[10] = rhs.mat[8] * lhs.mat[2] + rhs.mat[9] * lhs.mat[6] + rhs.mat[10] * lhs.mat[10] + rhs.mat[11] * lhs.mat[14];
        m.mat[11] = rhs.mat[8] * lhs.mat[3] + rhs.mat[9] * lhs.mat[7] + rhs.mat[10] * lhs.mat[11] + rhs.mat[11] * lhs.mat[15];

        // Column 3
        m.mat[12] = rhs.mat[12] * lhs.mat[0] + rhs.mat[13] * lhs.mat[4] + rhs.mat[14] * lhs.mat[8] + rhs.mat[15] * lhs.mat[12];
        m.mat[13] = rhs.mat[12] * lhs.mat[1] + rhs.mat[13] * lhs.mat[5] + rhs.mat[14] * lhs.mat[9] + rhs.mat[15] * lhs.mat[13];
        m.mat[14] = rhs.mat[12] * lhs.mat[2] + rhs.mat[13] * lhs.mat[6] + rhs.mat[14] * lhs.mat[10] + rhs.mat[15] * lhs.mat[14];
        m.mat[15] = rhs.mat[12] * lhs.mat[3] + rhs.mat[13] * lhs.mat[7] + rhs.mat[14] * lhs.mat[11] + rhs.mat[15] * lhs.mat[15];
 
        return m;
    }

    /**
     * Mn = M1 * M2 * M3 * ... * M(n-1):  Composes (i.e., multiplies) two or more 4x4 matrices together
     * and returns the result in a new matrix.
     * 
     * (Remember, matrix multiplication is not commutitive; so, the order of the matrices is important!
     * The order that transformations are applied to points and vectors is right-to-left.  To transform
     * point p into p', as in the equation below, think of M(n-1) as being the first transformation to
     * be applied to p and M1 as being the last transformation to be applied in order to produce p'.)
     *  ```
     *    p' = M1 * M2 * M3 * ... * M(n-1) * p
     * ``` 
     * @param m1 - The first (leftmost) Matrix4 object
     * @param m2 - The next Matrix4 object
     * @param mAdditional - Zero or more additional Matrix4 objects
     * @returns A new Matrix4 object = m1 * m2 * ...
     */
    static multiplyAll(m1: Matrix4, m2: Matrix4, ...mAdditional: Matrix4[]): Matrix4
    {
        const result = m1.clone();
        result.multiply(m2);
        for (let i=0; i<mAdditional.length; i++) {
            result.multiply(mAdditional[i])
        }
        return result;
    }

    /**
     * Creates a new Matrix4 object with the same values as the input matrix
     * 
     * @param m - The input Matrix4 object
     * @returns A new Matrix4 object with the same values as the input matrix
     */
    static copy(m: Matrix4): Matrix4
    {
        const mat = new Matrix4();
        mat.copy(m);
        return mat;
    }

    /**
     * Creates a new Matrix4 object from the given values in row-major order
     * 
     * @param n1 - Element [0,0] in the matrix
     * @param n2 - Element [0,1] in the matrix
     * @param n3 - Element [0,2] in the matrix
     * @param n4 - Element [0,3] in the matrix
     * @param n5 - Element [1,0] in the matrix
     * @param n6 - Element [1,1] in the matrix
     * @param n7 - Element [1,2] in the matrix
     * @param n8 - Element [1,3] in the matrix
     * @param n9 - Element [2,0] in the matrix
     * @param n10 - Element [2,1] in the matrix
     * @param n11 - Element [2,2] in the matrix
     * @param n12 - Element [2,3] in the matrix
     * @param n13 - Element [3,0] in the matrix
     * @param n14 - Element [3,1] in the matrix
     * @param n15 - Element [3,2] in the matrix
     * @param n16 - Element [3,3] in the matrix
     * @returns A new Matrix4 object created from the given values
     */
    public static fromRowMajor(n1: number, n2: number, n3: number, n4: number, 
        n5: number, n6: number, n7: number, n8: number, 
        n9: number, n10: number, n11: number, n12: number, 
        n13: number, n14: number, n15: number, n16: number): Matrix4
    {
        const matrix = new Matrix4();
        matrix.setRowMajor(n1, n2, n3, n4, n5, n6, n7, n8, n9, n10, n11, n12, n13, n14, n15, n16);
        return matrix;
    }

    /**
     * Creates a new Matrix4 object from the given values in column-major order
     * 
     * @param n1 - Element [0,0] in the matrix
     * @param n2 - Element [1,0] in the matrix
     * @param n3 - Element [2,0] in the matrix
     * @param n4 - Element [3,0] in the matrix
     * @param n5 - Element [0,1] in the matrix
     * @param n6 - Element [1,1] in the matrix
     * @param n7 - Element [2,1] in the matrix
     * @param n8 - Element [3,1] in the matrix
     * @param n9 - Element [0,2] in the matrix
     * @param n10 - Element [1,2] in the matrix
     * @param n11 - Element [2,2] in the matrix
     * @param n12 - Element [3,2] in the matrix
     * @param n13 - Element [0,3] in the matrix
     * @param n14 - Element [1,3] in the matrix
     * @param n15 - Element [2,3] in the matrix
     * @param n16 - Element [3,3] in the matrix
     * @returns A new Matrix4 object created from the given values
     */
    public static fromColumnMajor(n1: number, n2: number, n3: number, n4: number, 
        n5: number, n6: number, n7: number, n8: number, 
        n9: number, n10: number, n11: number, n12: number, 
        n13: number, n14: number, n15: number, n16: number): Matrix4
    {
        const matrix = new Matrix4();
        matrix.setColumnMajor(n1, n2, n3, n4, n5, n6, n7, n8, n9, n10, n11, n12, n13, n14, n15, n16);
        return matrix;
    }

    /**
     * Creates a new Matrix4 object with the identity matrix
     * 
     * @returns A new Matrix4 object with the identity matrix
     */    
    public static makeIdentity(): Matrix4
    {
        return Matrix4.fromRowMajor(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
    }

    /**
     * Creates a new Matrix4 object for translation
     * 
     * @param v - The Vector3 object representing the translation vector
     * @returns A new Matrix4 object for translation
     */    
    public static makeTranslation(v: Vector3): Matrix4
    {
        return Matrix4.fromRowMajor(
            1, 0, 0, v.x,
            0, 1, 0, v.y,
            0, 0, 1, v.z,
            0, 0, 0, 1
        );
    }

    /**
     * Creates a new Matrix4 object for rotation
     * 
     * @param rotation - The Quaternion object representing the rotation vector
     * @returns A new Matrix4 object for rotation
     */    
    public static makeRotation(rotation: Quaternion): Matrix4
    {
        const matrix = new Matrix4();
        matrix.setRotation(rotation);
        return matrix;
    }

    /**
     * Creates a new Matrix4 object for rotation around the X axis
     * 
     * @param angle - The angle of rotation around the X axis
     * @returns A new Matrix4 object for rotation around the X axis
     */    
    public static makeRotationX(angle: number): Matrix4
    {
        const matrix = new Matrix4();
        matrix.setRotationX(angle);
        return matrix;
    }

    /**
     * Creates a new Matrix4 object for rotation around the Y axis
     * 
     * @param angle - The angle of rotation around the Y axis
     * @returns A new Matrix4 object for rotation around the Y axis
     */
    public static makeRotationY(angle: number): Matrix4
    {
        const matrix = new Matrix4();
        matrix.setRotationY(angle);
        return matrix;
    }

    /**
     * Creates a new Matrix4 object for rotation around the Z axis
     * 
     * @param angle - The angle of rotation around the Z axis
     * @returns A new Matrix4 object for rotation around the Z axis
     */
    public static makeRotationZ(angle: number): Matrix4
    {
        const matrix = new Matrix4();
        matrix.setRotationZ(angle);
        return matrix;
    }


    /**
     * Creates a new Matrix4 object for rotation around an arbitrary axis
     * 
     * @param axis - The Vector3 object representing the axis of rotation
     * @param angle - The angle of rotation around the axis
     * @returns A new Matrix4 object for rotation around an arbitrary axis
     */
    public static makeAxisAngle(axis: Vector3, angle: number): Matrix4
    {
        const matrix = new Matrix4();
        matrix.setAxisAngle(axis, angle);
        return matrix;
    }


    /**
     * Creates a new Matrix4 object for rotation using Euler angles
     * 
     * @param x - The angle of rotation around the x axis
     * @param y - The angle of rotation around the y axis
     * @param z - The angle of rotation around the z axis
     * @param order - The order of the rotations (default is 'YZX')
     * @returns A new Matrix4 object for rotation using Euler angles
     */
    public static makeEulerAngles(x: number, y: number, z: number, order = 'YZX'): Matrix4
    {
        const dest = new Matrix4();
        dest.setEulerAngles(x, y, z, order);
        return dest;
    }

    /**
     * Creates a new Matrix4 object for scaling
     * 
     * @param scale - The Vector3 object representing the scale vector
     * @returns A new Matrix4 object for scaling
     */
    public static makeScale(scale: Vector3): Matrix4
    {
        const matrix = new Matrix4();
        matrix.setScale(scale);
        return matrix;
    }

    /**
     * Creates a new Matrix4 object representing the combined transform of position, rotation and scale
     * 
     * @param position - The Vector3 object representing the position
     * @param rotation - The Quaternion object representing the rotation
     * @param scale - The Vector3 object representing the scale
     * @returns A new Matrix4 object representing the combined transform of position, rotation and scale
     */
    public static compose(position = Vector3.ZERO, rotation = Quaternion.IDENTITY, scale = Vector3.UP): Matrix4
    {
        const m = Matrix4.makeScale(scale);
        m.premultiply(Matrix4.makeRotation(rotation));
        m.mat[12] = position.x;
        m.mat[13] = position.y;
        m.mat[14] = position.z;
        return m;
    }

    /**
     * Creates a new Matrix4 object for the view matrix of a camera.  The matrix will position the camera
     * at eyePoint and orient it to look directly toward the targetPoint so that the camera's look vector
     * will be (targetPoint - eyePoint).  The camera's rotation around the look vector is controlled by 
     * the upVector, which only needs to point roughly in the Up direction, i.e., it does not need to
     * be completely perpendicular to the look vector.
     * 
     * @param eyePoint - The position of the camera
     * @param targetPoint - A point that the camera should look directly toward
     * @param upVector - The "up" direction for the camera
     * @returns A new Matrix4 object for the view matrix of a camera
     */
    public static lookAt(eyePoint: Vector3, targetPoint: Vector3, upVector: Vector3): Matrix4
    {
        const z = Vector3.subtract(eyePoint, targetPoint);
        z.normalize();

        const x = Vector3.cross(upVector, z);
        x.normalize();

        const y = Vector3.cross(z, x);
        y.normalize();

        const rotation = Matrix4.fromColumnMajor(
            x.x, x.y, x.z, 0.0,
            y.x, y.y, y.z, 0.0,
            z.x, z.y, z.z, 0.0,
            0.0, 0.0, 0.0, 1.0,
        );

        const translation = Matrix4.fromColumnMajor(
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            eyePoint.x, eyePoint.y, eyePoint.z, 1.0 
        );

        return Matrix4.multiply(translation, rotation);
    }


    /**
     * Creates a matrix that represents a right-handed X,Y,Z coordinate frame (an orthonormal basis) 
     * where: 1. the vector provided by the reference direction is aligned with the X axis, and 
     * optionally 2. the vector provided by a second reference direction is aligned as closely
     * as possible (subject to the requirements of a right-handed, orthonormal basis) with the Y
     * axis.  This means the first column of the matrix will contain the normalized x, y, z values
     * of the reference direction and the second and third columns can be interpreted as the directions
     * of the Y and Z axes of the basis.
     *  
     * @param referenceDir A vector to use as the X-axis.
     * @param referenceDir2 A vector to try to use as the Y-axis.
     * @returns A 4x4 transformation matrix.
     */
    public static makeBasis(referenceDir: Vector3, referenceDir2 = new Vector3(0,1,0)) : Matrix4 {
        const x = Vector3.normalize(referenceDir);
        let y = Vector3.normalize(referenceDir2);
        let z = Vector3.normalize(Vector3.cross(x, y));
        if (z.fuzzyEquals(new Vector3(0,0,0))) {
            y = new Vector3(0, 0, 1);
            z = Vector3.normalize(Vector3.cross(x, y));
        }
        y = Vector3.normalize(Vector3.cross(z, x));
        return Matrix4.fromRowMajor(
            x.x, y.x, z.x, 0,
            x.y, y.y, z.y, 0,
            x.z, y.z, z.z, 0, 
            0, 0, 0, 1
        );
    }

    /**
     * Creates a rotation matrix that will align a reference direction to some new direction.  This is
     * similar to a lookAt function but more flexible in that the reference direction does not need to
     * be -Z.  The routine can optionally include a second reference direction and new direction.
     * This is interpreted similarly to the Up parameter in a typical lookAt function.  (The rotation
     * matrix will always align referenceDir with newDir and it will try to get referenceDir2 to align
     * as closely as possible with newDir2.)
     * 
     * @param referenceDir A reference direction
     * @param newDir The direction that referenceDir should rotate into
     * @param referenceDir2 Optionally, a second reference direction
     * @param newDir2 The direction that the second reference direction should rotate into
     * @returns 
     */
    public static makeAlign(referenceDir: Vector3, newDir: Vector3,
        referenceDir2 = new Vector3(0,1,0), newDir2 = new Vector3(0,1,0)) : Matrix4 {
        const refBasis = this.makeBasis(referenceDir, referenceDir2);
        const newBasis = this.makeBasis(newDir, newDir2);
        return Matrix4.multiplyAll(newBasis, refBasis.inverse());
    }

    /**
     * Create an orthographic projection Matrix4 
     * 
     * @param left - Left coordinate of the viewing volume
     * @param right - Right coordinate of the viewing volume
     * @param bottom - Bottom coordinate of the viewing volume
     * @param top - Top coordinate of the viewing volume
     * @param near - Near clipping plane of the viewing volume
     * @param far - Far clipping plane of the viewing volume
     * @returns A Matrix4 representing an orthographic projection
     */
    public static makeOrthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4
    {
        const matrix = new Matrix4();
        matrix.setOrthographic(left, right, bottom, top, near, far);
        return matrix;
    }

    /**
     * Create a perspective projection Matrix4 
     * 
     * @param fov - Field of view of the projection in radians
     * @param aspectRatio - Aspect ratio of the viewport (width / height)
     * @param near - Near clipping plane of the viewing volume
     * @param far - Far clipping plane of the viewing volume
     * @returns A Matrix4 representing a perspective projection
     */
    public static makePerspective(fov: number, aspectRatio: number, near: number, far: number): Matrix4
    {
        const matrix = new Matrix4();
        matrix.setPerspective(fov, aspectRatio, near, far);
        return matrix;
    }

    /**
     * Create a frustum projection Matrix4 
     * 
     * @param left - Left coordinate of the viewing volume
     * @param right - Right coordinate of the viewing volume
     * @param bottom - Bottom coordinate of the viewing volume
     * @param top - Top coordinate of the viewing volume
     * @param near - Near clipping plane of the viewing volume
     * @param far - Far clipping plane of the viewing volume
     * @returns A Matrix4 representing a frustum projection
     */
    public static makeFrustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4
    {
        const matrix = new Matrix4();
        matrix.setFrustum(left, right, bottom, top, near, far);
        return matrix;
    }

    /**
     * Multiplies point p by a 4x4 transformation matrix and returns the result as a new point.  This has the effect of
     * transforming p from m's local coordinate system to m's parent coordinate system.  The multiplication is done
     * using homogeneous coordinates (p is treated as having a w=1 coordinate).
     * 
     * @param m A 4x4 transformation matrix
     * @param p The original point
     * @returns A new point transformed by m
     */
    public static transformPoint(m: Matrix4, p: Vector3): Vector3
    {
        const result = new Vector3();
        const w = 1 / (m.mat[3]*p.x + m.mat[7]*p.y + m.mat[11]*p.z + m.mat[15]);
        result.x = w * (m.mat[0]*p.x + m.mat[4]*p.y + m.mat[8]*p.z + m.mat[12]);
        result.y = w * (m.mat[1]*p.x + m.mat[5]*p.y + m.mat[9]*p.z + m.mat[13]);
        result.z = w * (m.mat[2]*p.x + m.mat[6]*p.y + m.mat[10]*p.z + m.mat[14]);
        return result;
    }

    /**
     * Multiplies vector v by a 4x4 transformation matrix and returns the result as a new vector.  This has the effect of
     * transforming v from m's local coordinate system to m's parent coordinate system.  The multiplication is done
     * using homogeneous coordinates (p is treated as having a w=0 coordinate).
     * 
     * @param m A 4x4 transformation matrix
     * @param v The original vector
     * @returns A new vector transformed by m
     */
    public static transformVector(m: Matrix4, v: Vector3): Vector3
    {
        const result = new Vector3();
        const w = 1 / (m.mat[3]*v.x + m.mat[7]*v.y + m.mat[11]*v.z + m.mat[15]);
        result.x = w * (m.mat[0]*v.x + m.mat[4]*v.y + m.mat[8]*v.z);
        result.y = w * (m.mat[1]*v.x + m.mat[5]*v.y + m.mat[9]*v.z);
        result.z = w * (m.mat[2]*v.x + m.mat[6]*v.y + m.mat[10]*v.z);
        return result;
    }


    /**
     * Checks if all elements of two Matrix4 objects are exactly equal.
     *
     * @param m1 - The first matrix.
     * @param m2 - The second matrix.
     * @returns A boolean value indicating if the two matrices are equal
     */
    public static equals(m1: Matrix4, m2: Matrix4): boolean
    {
        for (let i=0; i<16; i++) {
            if (m1.mat[i] != m2.mat[i]) 
                return false;
        }
        return true;
    }

    /**
     * Checks if all elements of two Matrix4 objects are equal within a small value of epsilon.
     *
     * @param m1 - The first matrix.
     * @param m2 - The second matrix.
     * @param epsilon - A small value of acceptable variance to account for numerical instability
     * @returns A boolean value indicating if the two matrices are equal
     */
    public static fuzzyEquals(m1: Matrix4, m2: Matrix4, epsilon: number = MathUtils.EPSILON): boolean
    {
        for (let i=0; i<16; i++) {
            if (Math.abs(m1.mat[i] - m2.mat[i]) < epsilon) 
                return false;
        }
        return true;
    }


    /**
     * Constructs a Matrix4 object with a 4x4 identity matrix
     */    
    constructor()
    {
        this.mat = [ 
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    }

    /**
     * Set the values of the Matrix4 in column-major order
     * 
     * @param n1 - Column 1, Row 1 value
     * @param n2 - Column 1, Row 2 value
     * @param n3 - Column 1, Row 3 value
     * @param n4 - Column 1, Row 4 value
     * @param n5 - Column 2, Row 1 value
     * @param n6 - Column 2, Row 2 value
     * @param n7 - Column 2, Row 3 value
     * @param n8 - Column 2, Row 4 value
     * @param n9 - Column 3, Row 1 value
     * @param n10 - Column 3, Row 2 value
     * @param n11 - Column 3, Row 3 value
     * @param n12 - Column 3, Row 4 value
     * @param n13 - Column 4, Row 1 value
     * @param n14 - Column 4, Row 2 value
     * @param n15 - Column 4, Row 3 value
     * @param n16 - Column 4, Row 4 value
     */
    setColumnMajor(n1: number, n2: number, n3: number, n4: number, 
        n5: number, n6: number, n7: number, n8: number, 
        n9: number, n10: number, n11: number, n12: number, 
        n13: number, n14: number, n15: number, n16: number): void
    {
        this.mat[0] = n1;
        this.mat[1] = n2;
        this.mat[2] = n3;
        this.mat[3] = n4;
        this.mat[4] = n5;
        this.mat[5] = n6;
        this.mat[6] = n7;
        this.mat[7] = n8;
        this.mat[8] = n9;
        this.mat[9] = n10;
        this.mat[10] = n11;
        this.mat[11] = n12;
        this.mat[12] = n13;
        this.mat[13] = n14;
        this.mat[14] = n15;
        this.mat[15] = n16;
    }

    /**
     * Set the values of the Matrix4 in row-major order
     * 
     * @param n1 - Column 1, Row 1 value
     * @param n2 - Column 1, Row 2 value
     * @param n3 - Column 1, Row 3 value
     * @param n4 - Column 1, Row 4 value
     * @param n5 - Column 2, Row 1 value
     * @param n6 - Column 2, Row 2 value
     * @param n7 - Column 2, Row 3 value
     * @param n8 - Column 2, Row 4 value
     * @param n9 - Column 3, Row 1 value
     * @param n10 - Column 3, Row 2 value
     * @param n11 - Column 3, Row 3 value
     * @param n12 - Column 3, Row 4 value
     * @param n13 - Column 4, Row 1 value
     * @param n14 - Column 4, Row 2 value
     * @param n15 - Column 4, Row 3 value
     * @param n16 - Column 4, Row 4 value
     */
    setRowMajor(n1: number, n2: number, n3: number, n4: number, 
        n5: number, n6: number, n7: number, n8: number, 
        n9: number, n10: number, n11: number, n12: number, 
        n13: number, n14: number, n15: number, n16: number): void
    {
        this.mat[0] = n1;
        this.mat[1] = n5;
        this.mat[2] = n9;
        this.mat[3] = n13;
        this.mat[4] = n2;
        this.mat[5] = n6;
        this.mat[6] = n10;
        this.mat[7] = n14;
        this.mat[8] = n3;
        this.mat[9] = n7;
        this.mat[10] = n11;
        this.mat[11] = n15;
        this.mat[12] = n4;
        this.mat[13] = n8;
        this.mat[14] = n12;
        this.mat[15] = n16;
    }


    /**
     * Copy the values of another Matrix4 into this one
     * 
     * @param m - The Matrix4 object to copy from
     */
    copy(m: Matrix4): void
    {
        for(let i=0; i < 16; i++)
            this.mat[i] = m.mat[i];
    }


    /**
     * Creates a new Matrix4 object with the same values as this Matrix4.
     * 
     * @returns A new Matrix4 object with the same values as this Matrix4.
     */
    clone(): Matrix4
    {
        const matrix = new Matrix4();
        
        for(let i=0; i < 16; i++)
            matrix.mat[i] = this.mat[i];

        return matrix;
    }

    /** 
     * Returns the element at the given row and column in this Matrix4.
     * 
     * @param row - The row of the element to return.
     * @param col - The column of the element to return.
     * @returns The element at the given row and column.
     */   
    element(row: number, col: number): number
    {
        return this.mat[col*4 + row];
    }

    /**
     * Sets the element at the given row and column in this Matrix4.
     * 
     * @param value - The value to set at the given row and column.
     * @param row - The row of the element to set.
     * @param col - The column of the element to set.
     */    
    set(value: number, row: number, col: number): void
    {
       this.mat[col*4 + row] = value;
    }

    /**
     * Multiplies this Matrix4 with another Matrix4 on the right hand side (i.e., this = this * rhs) and sets this
     * Matrix4 to the result.
     * 
     * @param rhs - The Matrix4 to multiply with.
     */
    multiply(rhs: Matrix4): void
    {
        const lhs = this.clone();

        // Column 0
        this.mat[0] = rhs.mat[0] * lhs.mat[0] + rhs.mat[1] * lhs.mat[4] + rhs.mat[2] * lhs.mat[8] + rhs.mat[3] * lhs.mat[12];
        this.mat[1] = rhs.mat[0] * lhs.mat[1] + rhs.mat[1] * lhs.mat[5] + rhs.mat[2] * lhs.mat[9] + rhs.mat[3] * lhs.mat[13];
        this.mat[2] = rhs.mat[0] * lhs.mat[2] + rhs.mat[1] * lhs.mat[6] + rhs.mat[2] * lhs.mat[10] + rhs.mat[3] * lhs.mat[14];
        this.mat[3] = rhs.mat[0] * lhs.mat[3] + rhs.mat[1] * lhs.mat[7] + rhs.mat[2] * lhs.mat[11] + rhs.mat[3] * lhs.mat[15];
        
        // Column 1
        this.mat[4] = rhs.mat[4] * lhs.mat[0] + rhs.mat[5] * lhs.mat[4] + rhs.mat[6] * lhs.mat[8] + rhs.mat[7] * lhs.mat[12];
        this.mat[5] = rhs.mat[4] * lhs.mat[1] + rhs.mat[5] * lhs.mat[5] + rhs.mat[6] * lhs.mat[9] + rhs.mat[7] * lhs.mat[13];
        this.mat[6] = rhs.mat[4] * lhs.mat[2] + rhs.mat[5] * lhs.mat[6] + rhs.mat[6] * lhs.mat[10] + rhs.mat[7] * lhs.mat[14];
        this.mat[7] = rhs.mat[4] * lhs.mat[3] + rhs.mat[5] * lhs.mat[7] + rhs.mat[6] * lhs.mat[11] + rhs.mat[7] * lhs.mat[15];

        // Column 2
        this.mat[8] = rhs.mat[8] * lhs.mat[0] + rhs.mat[9] * lhs.mat[4] + rhs.mat[10] * lhs.mat[8] + rhs.mat[11] * lhs.mat[12];
        this.mat[9] = rhs.mat[8] * lhs.mat[1] + rhs.mat[9] * lhs.mat[5] + rhs.mat[10] * lhs.mat[9] + rhs.mat[11] * lhs.mat[13];
        this.mat[10] = rhs.mat[8] * lhs.mat[2] + rhs.mat[9] * lhs.mat[6] + rhs.mat[10] * lhs.mat[10] + rhs.mat[11] * lhs.mat[14];
        this.mat[11] = rhs.mat[8] * lhs.mat[3] + rhs.mat[9] * lhs.mat[7] + rhs.mat[10] * lhs.mat[11] + rhs.mat[11] * lhs.mat[15];

        // Column 3
        this.mat[12] = rhs.mat[12] * lhs.mat[0] + rhs.mat[13] * lhs.mat[4] + rhs.mat[14] * lhs.mat[8] + rhs.mat[15] * lhs.mat[12];
        this.mat[13] = rhs.mat[12] * lhs.mat[1] + rhs.mat[13] * lhs.mat[5] + rhs.mat[14] * lhs.mat[9] + rhs.mat[15] * lhs.mat[13];
        this.mat[14] = rhs.mat[12] * lhs.mat[2] + rhs.mat[13] * lhs.mat[6] + rhs.mat[14] * lhs.mat[10] + rhs.mat[15] * lhs.mat[14];
        this.mat[15] = rhs.mat[12] * lhs.mat[3] + rhs.mat[13] * lhs.mat[7] + rhs.mat[14] * lhs.mat[11] + rhs.mat[15] * lhs.mat[15];
    }

    /**
     * this.mat = this.mat * M1 * M2 * ... * M(n-1):  Multiplies this matrix with one or more additional \
     * 4x4 matrices.
     * 
     * (Remember, matrix multiplication is not commutitive; so, the order of the matrices is important!
     * The order that transformations are applied to points and vectors is right-to-left.  To transform
     * point p into p', as in the equation below, think of M(n-1) as being the first transformation to
     * be applied to p and the current value of this.mat as being the last transformation to be applied
     * in order to produce p'.)
     *  ```
     *    p' = this.mat * M1 * M2 * ... * M(n-1) * p
     * ``` 
     */
    multiplyAll(m1: Matrix4, ...mAdditional: Matrix4[]): void
    {
        this.multiply(m1);
        for (let i=0; i<mAdditional.length; i++) {
            this.multiply(mAdditional[i])
        }
    }

    /**
     * Multiplies the given Matrix4 with another Matrix4 on the left hand side (i.e., this = lhs * this) and sets this Matrix4
     *  to the result.
     * 
     * @param lhs - The Matrix4 to multiply with.
     */    
    premultiply(lhs: Matrix4): void
    {
        const rhs = this.clone();

        // Column 0
        this.mat[0] = rhs.mat[0] * lhs.mat[0] + rhs.mat[1] * lhs.mat[4] + rhs.mat[2] * lhs.mat[8] + rhs.mat[3] * lhs.mat[12];
        this.mat[1] = rhs.mat[0] * lhs.mat[1] + rhs.mat[1] * lhs.mat[5] + rhs.mat[2] * lhs.mat[9] + rhs.mat[3] * lhs.mat[13];
        this.mat[2] = rhs.mat[0] * lhs.mat[2] + rhs.mat[1] * lhs.mat[6] + rhs.mat[2] * lhs.mat[10] + rhs.mat[3] * lhs.mat[14];
        this.mat[3] = rhs.mat[0] * lhs.mat[3] + rhs.mat[1] * lhs.mat[7] + rhs.mat[2] * lhs.mat[11] + rhs.mat[3] * lhs.mat[15];
        
        // Column 1
        this.mat[4] = rhs.mat[4] * lhs.mat[0] + rhs.mat[5] * lhs.mat[4] + rhs.mat[6] * lhs.mat[8] + rhs.mat[7] * lhs.mat[12];
        this.mat[5] = rhs.mat[4] * lhs.mat[1] + rhs.mat[5] * lhs.mat[5] + rhs.mat[6] * lhs.mat[9] + rhs.mat[7] * lhs.mat[13];
        this.mat[6] = rhs.mat[4] * lhs.mat[2] + rhs.mat[5] * lhs.mat[6] + rhs.mat[6] * lhs.mat[10] + rhs.mat[7] * lhs.mat[14];
        this.mat[7] = rhs.mat[4] * lhs.mat[3] + rhs.mat[5] * lhs.mat[7] + rhs.mat[6] * lhs.mat[11] + rhs.mat[7] * lhs.mat[15];

        // Column 2
        this.mat[8] = rhs.mat[8] * lhs.mat[0] + rhs.mat[9] * lhs.mat[4] + rhs.mat[10] * lhs.mat[8] + rhs.mat[11] * lhs.mat[12];
        this.mat[9] = rhs.mat[8] * lhs.mat[1] + rhs.mat[9] * lhs.mat[5] + rhs.mat[10] * lhs.mat[9] + rhs.mat[11] * lhs.mat[13];
        this.mat[10] = rhs.mat[8] * lhs.mat[2] + rhs.mat[9] * lhs.mat[6] + rhs.mat[10] * lhs.mat[10] + rhs.mat[11] * lhs.mat[14];
        this.mat[11] = rhs.mat[8] * lhs.mat[3] + rhs.mat[9] * lhs.mat[7] + rhs.mat[10] * lhs.mat[11] + rhs.mat[11] * lhs.mat[15];

        // Column 3
        this.mat[12] = rhs.mat[12] * lhs.mat[0] + rhs.mat[13] * lhs.mat[4] + rhs.mat[14] * lhs.mat[8] + rhs.mat[15] * lhs.mat[12];
        this.mat[13] = rhs.mat[12] * lhs.mat[1] + rhs.mat[13] * lhs.mat[5] + rhs.mat[14] * lhs.mat[9] + rhs.mat[15] * lhs.mat[13];
        this.mat[14] = rhs.mat[12] * lhs.mat[2] + rhs.mat[13] * lhs.mat[6] + rhs.mat[14] * lhs.mat[10] + rhs.mat[15] * lhs.mat[14];
        this.mat[15] = rhs.mat[12] * lhs.mat[3] + rhs.mat[13] * lhs.mat[7] + rhs.mat[14] * lhs.mat[11] + rhs.mat[15] * lhs.mat[15];
    }

    /**
     * Sets this Matrix4 to the identity matrix.
     */    
    setIdentity(): void
    {
        this.setRowMajor(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
    }

    /**
     * Sets this Matrix4 to a translation matrix given a translation Vector3.
     * 
     * @param v - The translation Vector3.
     */    
    setTranslation(v: Vector3): void
    {
        this.setRowMajor(
            1, 0, 0, v.x,
            0, 1, 0, v.y,
            0, 0, 1, v.z,
            0, 0, 0, 1
        );
    }

    /**
     * Sets this Matrix4 to a rotation matrix given a Quaternion.
     * 
     * @param rotation - The Quaternion to construct the rotation matrix with.
     */
    // based on http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToMatrix/index.htm
    setRotation(rotation: Quaternion): void
    {
        const sqw = rotation.w*rotation.w;
        const sqx = rotation.x*rotation.x;
        const sqy = rotation.y*rotation.y;
        const sqz = rotation.z*rotation.z;

        // invs (inverse square length) is only required if quaternion is not already normalised
        const invs = 1 / (sqx + sqy + sqz + sqw);

        const tmp1 = rotation.x*rotation.y;
        const tmp2 = rotation.z*rotation.w;
        const tmp3 = rotation.x*rotation.z;
        const tmp4 = rotation.y*rotation.w;
        const tmp5 = rotation.y*rotation.z;
        const tmp6 = rotation.x*rotation.w;
        
        this.setRowMajor(
            ( sqx - sqy - sqz + sqw)*invs, 2 * (tmp1 - tmp2)*invs, 2 * (tmp3 + tmp4)*invs, 0,
            2 * (tmp1 + tmp2)*invs, (-sqx + sqy - sqz + sqw)*invs, 2 * (tmp5 - tmp6)*invs, 0,
            2 * (tmp3 - tmp4)*invs, 2 * (tmp5 + tmp6)*invs, (-sqx - sqy + sqz + sqw), 0,
            0, 0, 0, 1
        );
    }

    /**
     * Sets this Matrix4 to a rotation matrix around the X axis with the given angle in radians.
     * 
     * @param angle - The angle in radians.
     */
    setRotationX(angle: number): void
    {
        const cosTheta = Math.cos(angle);
        const sinTheta = Math.sin(angle);
        
        this.setRowMajor(
            1, 0, 0, 0,
            0, cosTheta, -sinTheta, 0,
            0, sinTheta, cosTheta, 0,
            0, 0, 0, 1
        );
    }

    /**
     * Sets this Matrix4 to a rotation matrix around the Y axis with the given angle in radians.
     * 
     * @param angle - The angle in radians.
     */
    setRotationY(angle: number): void
    {
        const cosTheta = Math.cos(angle);
        const sinTheta = Math.sin(angle);
   
        this.setRowMajor(
            cosTheta, 0, sinTheta, 0,
            0, 1, 0, 0,
            -sinTheta, 0, cosTheta, 0,
            0, 0, 0, 1
        );
    }

    /**
     * Sets this Matrix4 to a rotation matrix around the Z axis with the given angle in radians.
     * 
     * @param angle - The angle in radians.
     */    
    setRotationZ(angle: number): void
    {
        const cosTheta = Math.cos(angle);
        const sinTheta = Math.sin(angle);
        this.setRowMajor(
            cosTheta, -sinTheta, 0, 0,
            sinTheta, cosTheta, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
    }

    /**
     * Set the axis angle for this Matrix4 object
     * 
     * @param axis - The Vector3 representing the axis
     * @param angle - The angle to set the axis to
     */    
    setAxisAngle(axis: Vector3, angle: number): void
    {
        const c = Math.cos(angle);
		const s = Math.sin(angle);
		const t = 1 - c;
		const x = axis.x, y = axis.y, z = axis.z;
		const tx = t * x, ty = t * y;
		this.setRowMajor(
			tx * x + c, tx * y - s * z, tx * z + s * y, 0,
			tx * y + s * z, ty * y + c, ty * z - s * x, 0,
			tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
			0, 0, 0, 1
		);
    }

    /**
     * Set the scale of this Matrix4 object
     * 
     * @param scale - The Vector3 representing the scale to set
     */
    setScale(scale: Vector3): void
    {
        this.setRowMajor(
            scale.x, 0, 0, 0,
            0, scale.y, 0, 0,
            0, 0, scale.z, 0,
            0, 0, 0, 1    
        );
    }

    /**
     * Gets the translation vector of this Matrix4 object
     * 
     * @returns The Vector3 representing the translation vector
     */
    getTranslation(): Vector3
    {
        return new Vector3(this.mat[12], this.mat[13], this.mat[14]);
    }

    /**
     * Gets the rotation quaternion of this Matrix4 object
     * 
     * @returns The Quaternion representing the rotation
     */
    getRotation(): Quaternion
    {
        return Quaternion.makeMatrix(this);
    }

    /**
     * Gets the scale vector of this Matrix4 object
     * 
     * @returns The Vector3 representing the scale vector
     */
    getScale(): Vector3
    {
        return new Vector3(
            Math.sqrt(this.mat[0]*this.mat[0] + this.mat[1]*this.mat[1] + this.mat[2]*this.mat[2]),
            Math.sqrt(this.mat[4]*this.mat[4] + this.mat[5]*this.mat[5] + this.mat[6]*this.mat[6]),
            Math.sqrt(this.mat[8]*this.mat[8] + this.mat[9]*this.mat[9] + this.mat[10]*this.mat[10])
        );
    }

    /**
     * Sets an orthographic projection matrix on this Matrix4 object
     * 
     * @param left - The leftmost coordinate
     * @param right - The rightmost coordinate
     * @param bottom - The bottom coordinate
     * @param top - The top coordinate
     * @param near - The near coordinate
     * @param far - The far coordinate
     */
    setOrthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): void
    {
        this.setRowMajor(
            2/(right-left), 0, 0, -(right+left)/(right-left),
            0, 2/(top-bottom), 0, -(top+bottom)/(top-bottom),
            0, 0, -2/(far-near), -(far+near)/(far-near),
            0, 0, 0, 1
        );
    }


    /**
     * Sets a perspective projection matrix on this Matrix4 object
     * 
     * @param fov - The field of view angle
     * @param aspectRatio - The aspect ratio of the view
     * @param near - The near coordinate
     * @param far - The far coordinate
     */
    setPerspective(fov: number, aspectRatio: number, near: number, far: number): void
    {
        const yMax = near * Math.tan(fov * Math.PI / 360);
        const xMax = yMax * aspectRatio;
        this.setFrustum(-xMax, xMax, -yMax, yMax, near, far); 
    }

    /**
     * Sets a frustum projection matrix on this Matrix4 object
     * 
     * @param left - The leftmost coordinate
     * @param right - The rightmost coordinate
     * @param bottom - The bottom coordinate
     * @param top - The top coordinate
     * @param near - The near coordinate
     * @param far - The far coordinate
     */
    setFrustum(left: number, right: number, bottom: number, top: number, near: number, far: number): void
    {
        this.setRowMajor(
            2*near/(right-left), 0, (right+left)/(right-left), 0,
            0, 2*near/(top-bottom), (top+bottom)/(top-bottom), 0,
            0, 0, -(far+near)/(far-near), -2*far*near/(far-near),
            0, 0, -1, 0
        );
    }

    /**
     * Sets the Matrix to a view matrix of a camera.  The matrix will position the camera
     * at eyePoint and orient it to look directly toward the targetPoint so that the camera's look vector
     * will be (targetPoint - eyePoint).  The camera's rotation around the look vector is controlled by 
     * the upVector, which only needs to point roughly in the Up direction, i.e., it does not need to
     * be completely perpendicular to the look vector.
     * 
     * @param eyePoint - The position of the camera
     * @param targetPoint - A point that the camera should look directly toward
     * @param upVector - The "up" direction for the camera
     * @returns A new Matrix4 object for the view matrix of a camera
     */
    lookAt(eye: Vector3, target: Vector3, up = Vector3.UP): void
    {
        const z = Vector3.subtract(eye, target);
        z.normalize();

        const x = Vector3.cross(up, z);
        x.normalize();

        const y = Vector3.cross(z, x);
        y.normalize();

        this.setColumnMajor(
            x.x, x.y, x.z, 0.0,
            y.x, y.y, y.z, 0.0,
            z.x, z.y, z.z, 0.0,
            0.0, 0.0, 0.0, 1.0,
        );

        const translation = Matrix4.fromColumnMajor(
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            eye.x, eye.y, eye.z, 1.0 
        );

        this.premultiply(translation);
    }

    /**
     * Multiplies all elements of this Matrix4 object by a scalar
     * 
     * @param x - The scalar to multiply by
     */
    multiplyScalar(x: number): void
    {
        for(let i=0; i < 16; i++)
            this.mat[i] *= x;
    }

    /**
     * Computes the determinant of the Matrix4 object 
     * 
     * @returns The determinant of the Matrix4 object
     */    
    // Code from http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
    determinant(): number
    {
        const determinant = 
            this.mat[3] * this.mat[6] * this.mat[9] * this.mat[12]-
            this.mat[2] * this.mat[7] * this.mat[9] * this.mat[12]-
            this.mat[3] * this.mat[5] * this.mat[10] * this.mat[12]+
            this.mat[1] * this.mat[7] * this.mat[10] * this.mat[12]+
            this.mat[2] * this.mat[5] * this.mat[11] * this.mat[12]-
            this.mat[1] * this.mat[6] * this.mat[11] * this.mat[12]-
            this.mat[3] * this.mat[6] * this.mat[8] * this.mat[13]+
            this.mat[2] * this.mat[7] * this.mat[8] * this.mat[13]+
            this.mat[3] * this.mat[4] * this.mat[10] * this.mat[13]-
            this.mat[0] * this.mat[7] * this.mat[10] * this.mat[13]-
            this.mat[2] * this.mat[4] * this.mat[11] * this.mat[13]+
            this.mat[0] * this.mat[6] * this.mat[11] * this.mat[13]+
            this.mat[3] * this.mat[5] * this.mat[8] * this.mat[14]-
            this.mat[1] * this.mat[7] * this.mat[8] * this.mat[14]-
            this.mat[3] * this.mat[4] * this.mat[9] * this.mat[14]+
            this.mat[0] * this.mat[7] * this.mat[9] * this.mat[14]+
            this.mat[1] * this.mat[4] * this.mat[11] * this.mat[14]-
            this.mat[0] * this.mat[5] * this.mat[11] * this.mat[14]-
            this.mat[2] * this.mat[5] * this.mat[8] * this.mat[15]+
            this.mat[1] * this.mat[6] * this.mat[8] * this.mat[15]+
            this.mat[2] * this.mat[4] * this.mat[9] * this.mat[15]-
            this.mat[0] * this.mat[6] * this.mat[9] * this.mat[15]-
            this.mat[1] * this.mat[4] * this.mat[10] * this.mat[15]+
            this.mat[0] * this.mat[5] * this.mat[10] * this.mat[15];

        return determinant;
    }

    /**
     * Calculates the inverse of a Matrix4 object
     * 
     * @returns A Matrix4 object that is the inverse of the current Matrix4 object
     */
    // Code from http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
    inverse(): Matrix4
    {
        // Check for singular matrix
        const determinant = this.determinant();
        if (Math.abs(determinant) < 1e-8)
            return new Matrix4();

        const inverse = new Matrix4();

        inverse.mat[0] = (this.mat[6]*this.mat[11]*this.mat[13] -
            this.mat[7]*this.mat[10]*this.mat[13] +
            this.mat[7]*this.mat[9]*this.mat[14] -
            this.mat[5]*this.mat[11]*this.mat[14] -
            this.mat[6]*this.mat[9]*this.mat[15] +
            this.mat[5]*this.mat[10]*this.mat[15])/determinant;

        inverse.mat[1] = (this.mat[3]*this.mat[10]*this.mat[13] -
            this.mat[2]*this.mat[11]*this.mat[13] -
            this.mat[3]*this.mat[9]*this.mat[14] +
            this.mat[1]*this.mat[11]*this.mat[14] +
            this.mat[2]*this.mat[9]*this.mat[15] -
            this.mat[1]*this.mat[10]*this.mat[15])/determinant;
        
        inverse.mat[2] = (this.mat[2]*this.mat[7]*this.mat[13] -
            this.mat[3]*this.mat[6]*this.mat[13] +
            this.mat[3]*this.mat[5]*this.mat[14] -
            this.mat[1]*this.mat[7]*this.mat[14] -
            this.mat[2]*this.mat[5]*this.mat[15] +
            this.mat[1]*this.mat[6]*this.mat[15])/determinant;
        
        inverse.mat[3] = (this.mat[3]*this.mat[6]*this.mat[9] -
            this.mat[2]*this.mat[7]*this.mat[9] -
            this.mat[3]*this.mat[5]*this.mat[10] +
            this.mat[1]*this.mat[7]*this.mat[10] +
            this.mat[2]*this.mat[5]*this.mat[11] -
            this.mat[1]*this.mat[6]*this.mat[11])/determinant;

        inverse.mat[4] = (this.mat[7]*this.mat[10]*this.mat[12] -
            this.mat[6]*this.mat[11]*this.mat[12] -
            this.mat[7]*this.mat[8]*this.mat[14] +
            this.mat[4]*this.mat[11]*this.mat[14] +
            this.mat[6]*this.mat[8]*this.mat[15] -
            this.mat[4]*this.mat[10]*this.mat[15])/determinant;
            
        inverse.mat[5] = (this.mat[2]*this.mat[11]*this.mat[12] -
            this.mat[3]*this.mat[10]*this.mat[12] +
            this.mat[3]*this.mat[8]*this.mat[14] -
            this.mat[0]*this.mat[11]*this.mat[14] -
            this.mat[2]*this.mat[8]*this.mat[15] +
            this.mat[0]*this.mat[10]*this.mat[15])/determinant;
            
        inverse.mat[6] = (this.mat[3]*this.mat[6]*this.mat[12] -
            this.mat[2]*this.mat[7]*this.mat[12] -
            this.mat[3]*this.mat[4]*this.mat[14] +
            this.mat[0]*this.mat[7]*this.mat[14] +
            this.mat[2]*this.mat[4]*this.mat[15] -
            this.mat[0]*this.mat[6]*this.mat[15])/determinant;
            
        inverse.mat[7] = (this.mat[2]*this.mat[7]*this.mat[8] -
            this.mat[3]*this.mat[6]*this.mat[8] +
            this.mat[3]*this.mat[4]*this.mat[10] -
            this.mat[0]*this.mat[7]*this.mat[10] -
            this.mat[2]*this.mat[4]*this.mat[11] +
            this.mat[0]*this.mat[6]*this.mat[11])/determinant;
            
        inverse.mat[8] = (this.mat[5]*this.mat[11]*this.mat[12] -
            this.mat[7]*this.mat[9]*this.mat[12] +
            this.mat[7]*this.mat[8]*this.mat[13] -
            this.mat[4]*this.mat[11]*this.mat[13] -
            this.mat[5]*this.mat[8]*this.mat[15] +
            this.mat[4]*this.mat[9]*this.mat[15])/determinant;
            
        inverse.mat[9] = (this.mat[3]*this.mat[9]*this.mat[12] -
            this.mat[1]*this.mat[11]*this.mat[12] -
            this.mat[3]*this.mat[8]*this.mat[13] +
            this.mat[0]*this.mat[11]*this.mat[13] +
            this.mat[1]*this.mat[8]*this.mat[15] -
            this.mat[0]*this.mat[9]*this.mat[15])/determinant;
            
        inverse.mat[10] = (this.mat[1]*this.mat[7]*this.mat[12] -
            this.mat[3]*this.mat[5]*this.mat[12] +
            this.mat[3]*this.mat[4]*this.mat[13] -
            this.mat[0]*this.mat[7]*this.mat[13] -
            this.mat[1]*this.mat[4]*this.mat[15] +
            this.mat[0]*this.mat[5]*this.mat[15])/determinant;
            
        inverse.mat[11] = (this.mat[3]*this.mat[5]*this.mat[8] -
            this.mat[1]*this.mat[7]*this.mat[8] -
            this.mat[3]*this.mat[4]*this.mat[9] +
            this.mat[0]*this.mat[7]*this.mat[9] +
            this.mat[1]*this.mat[4]*this.mat[11] -
            this.mat[0]*this.mat[5]*this.mat[11])/determinant;
            
        inverse.mat[12] = (this.mat[6]*this.mat[9]*this.mat[12] -
            this.mat[5]*this.mat[10]*this.mat[12] -
            this.mat[6]*this.mat[8]*this.mat[13] +
            this.mat[4]*this.mat[10]*this.mat[13] +
            this.mat[5]*this.mat[8]*this.mat[14] -
            this.mat[4]*this.mat[9]*this.mat[14])/determinant;
            
        inverse.mat[13] = (this.mat[1]*this.mat[10]*this.mat[12] -
            this.mat[2]*this.mat[9]*this.mat[12] +
            this.mat[2]*this.mat[8]*this.mat[13] -
            this.mat[0]*this.mat[10]*this.mat[13] -
            this.mat[1]*this.mat[8]*this.mat[14] +
            this.mat[0]*this.mat[9]*this.mat[14])/determinant;
        
        inverse.mat[14] = (this.mat[2]*this.mat[5]*this.mat[12] -
            this.mat[1]*this.mat[6]*this.mat[12] -
            this.mat[2]*this.mat[4]*this.mat[13] +
            this.mat[0]*this.mat[6]*this.mat[13] +
            this.mat[1]*this.mat[4]*this.mat[14] -
            this.mat[0]*this.mat[5]*this.mat[14])/determinant;
        
        inverse.mat[15] = (this.mat[1]*this.mat[6]*this.mat[8] -
            this.mat[2]*this.mat[5]*this.mat[8] +
            this.mat[2]*this.mat[4]*this.mat[9] -
            this.mat[0]*this.mat[6]*this.mat[9] -
            this.mat[1]*this.mat[4]*this.mat[10] +
            this.mat[0]*this.mat[5]*this.mat[10])/determinant;

        return inverse;
    }

    /**
     * Inverts the matix and writes the result back into this matrix.
     */
    invert(): void
    {
        const inverseMatrix = this.inverse();
        this.copy(inverseMatrix);
    }

    /**
     * Transposes the Matrix4 object and returns a new Matrix4 object
     * 
     * @returns A new Matrix4 object which is the transposed version of the current object
     */
    transpose(): Matrix4
    {
        return Matrix4.fromRowMajor(
            this.mat[0], this.mat[1], this.mat[2], this.mat[3],
            this.mat[4], this.mat[5], this.mat[6], this.mat[7],
            this.mat[8], this.mat[9], this.mat[10], this.mat[11],
            this.mat[12], this.mat[13], this.mat[14], this.mat[15]
        );
    }

    /**
     * Sets the matrix to a rotation matrix defined by Euler angles.
     * 
     * @param x - The x-axis euler angle
     * @param y - The y-axis euler angle
     * @param z - The z-axis euler angle
     * @param order - The order in which the euler angles should be applied
     */
    // based on the implementation in three.js
    setEulerAngles(x: number, y: number, z: number, order = 'YZX'): void
    {
		const a = Math.cos(x)
        const b = Math.sin(x);
		const c = Math.cos(y);
        const d = Math.sin(y);
		const e = Math.cos(z);
        const f = Math.sin(z);

		if (order == 'XYZ')
        {
			const ae = a * e, af = a * f, be = b * e, bf = b * f;

			this.mat[ 0 ] = c * e;
			this.mat[ 4 ] = - c * f;
			this.mat[ 8 ] = d;

			this.mat[ 1 ] = af + be * d;
			this.mat[ 5 ] = ae - bf * d;
			this.mat[ 9 ] = - b * c;

			this.mat[ 2 ] = bf - ae * d;
			this.mat[ 6 ] = be + af * d;
			this.mat[ 10 ] = a * c;
		} 
        else if(order == 'YXZ')
        {
			const ce = c * e, cf = c * f, de = d * e, df = d * f;

			this.mat[ 0 ] = ce + df * b;
			this.mat[ 4 ] = de * b - cf;
			this.mat[ 8 ] = a * d;

			this.mat[ 1 ] = a * f;
			this.mat[ 5 ] = a * e;
			this.mat[ 9 ] = - b;

			this.mat[ 2 ] = cf * b - de;
			this.mat[ 6 ] = df + ce * b;
			this.mat[ 10 ] = a * c;
        }
        else if(order == 'ZXY')
        {
            const ce = c * e, cf = c * f, de = d * e, df = d * f;

            this.mat[ 0 ] = ce - df * b;
            this.mat[ 4 ] = - a * f;
            this.mat[ 8 ] = de + cf * b;

            this.mat[ 1 ] = cf + de * b;
            this.mat[ 5 ] = a * e;
            this.mat[ 9 ] = df - ce * b;

            this.mat[ 2 ] = - a * d;
            this.mat[ 6 ] = b;
            this.mat[ 10 ] = a * c;
		} 
        else if(order === 'ZYX')
        {
			const ae = a * e, af = a * f, be = b * e, bf = b * f;

			this.mat[ 0 ] = c * e;
			this.mat[ 4 ] = be * d - af;
			this.mat[ 8 ] = ae * d + bf;

			this.mat[ 1 ] = c * f;
			this.mat[ 5 ] = bf * d + ae;
			this.mat[ 9 ] = af * d - be;

			this.mat[ 2 ] = - d;
			this.mat[ 6 ] = b * c;
			this.mat[ 10 ] = a * c;
		}
        else if(order === 'YZX')
        {
			const ac = a * c, ad = a * d, bc = b * c, bd = b * d;

			this.mat[ 0 ] = c * e;
			this.mat[ 4 ] = bd - ac * f;
			this.mat[ 8 ] = bc * f + ad;

			this.mat[ 1 ] = f;
			this.mat[ 5 ] = a * e;
			this.mat[ 9 ] = - b * e;

			this.mat[ 2 ] = - d * e;
			this.mat[ 6 ] = ad * f + bc;
			this.mat[ 10 ] = ac - bd * f;
		} 
        else if(order === 'XZY') 
        {
			const ac = a * c, ad = a * d, bc = b * c, bd = b * d;

			this.mat[ 0 ] = c * e;
			this.mat[ 4 ] = - f;
			this.mat[ 8 ] = d * e;

			this.mat[ 1 ] = ac * f + bd;
			this.mat[ 5 ] = a * e;
			this.mat[ 9 ] = ad * f - bc;

			this.mat[ 2 ] = bc * f - ad;
			this.mat[ 6 ] = b * e;
			this.mat[ 10 ] = bd * f + ac;
		}

		// bottom row
		this.mat[ 3 ] = 0;
		this.mat[ 7 ] = 0;
		this.mat[ 11 ] = 0;

		// last column
		this.mat[ 12 ] = 0;
		this.mat[ 13 ] = 0;
		this.mat[ 14 ] = 0;
		this.mat[ 15 ] = 1;
    }

    
    /**
     * Sets the matrix to a composition of three basic transformations (this = T * R * S), where 
     * scale is applied first, then rotation, then translation.
     * 
     * @param position - The position of the Matrix4 object (default Vector3.ZERO)
     * @param rotation - The rotation of the Matrix4 object (default Quaternion.IDENTITY)
     * @param scale - The scale of the Matrix4 object (default Vector3.ONE)
     */
    compose(position: Vector3, rotation: Quaternion, scale: Vector3): void
    {
        this.setScale(scale);
        this.premultiply(Matrix4.makeRotation(rotation));

        this.mat[12] = position.x;
        this.mat[13] = position.y;
        this.mat[14] = position.z;
    }

    /**
     * Multiplies point p by this 4x4 transformation matrix and returns the result as a new point.  This has the effect of
     * transforming p from the matrix's local coordinate system to its parent coordinate system.  The multiplication is done
     * using homogeneous coordinates (p is treated as having a w=1 coordinate).
     * 
     * @param p The original point
     * @returns A new point transformed by m
     */
    transformPoint(p: Vector3): Vector3
    {
        const result = new Vector3();
        const w = 1 / (this.mat[3]*p.x + this.mat[7]*p.y + this.mat[11]*p.z + this.mat[15]);
        result.x = w * (this.mat[0]*p.x + this.mat[4]*p.y + this.mat[8]*p.z + this.mat[12]);
        result.y = w * (this.mat[1]*p.x + this.mat[5]*p.y + this.mat[9]*p.z + this.mat[13]);
        result.z = w * (this.mat[2]*p.x + this.mat[6]*p.y + this.mat[10]*p.z + this.mat[14]);
        return result;
    }

    /**
     * Multiplies vector v by this 4x4 transformation matrix and returns the result as a new vector.  This has the effect of
     * transforming v from the matrix's local coordinate system to its parent coordinate system.  The multiplication is done
     * using homogeneous coordinates (v is treated as having a w=0 coordinate).
     * 
     * @param v The original vector
     * @returns A new vector transformed by m
     */
    transformVector(v: Vector3): Vector3
    {
        const result = new Vector3();
        const w = 1 / (this.mat[3]*v.x + this.mat[7]*v.y + this.mat[11]*v.z + this.mat[15]);
        result.x = w * (this.mat[0]*v.x + this.mat[4]*v.y + this.mat[8]*v.z);
        result.y = w * (this.mat[1]*v.x + this.mat[5]*v.y + this.mat[9]*v.z);
        result.z = w * (this.mat[2]*v.x + this.mat[6]*v.y + this.mat[10]*v.z);
        return result;
    }

    /**
     * Returns the first three elements of column i as a new Vector3.
     * @param i The zero-based index of the column (0..3)
     * @returns A new Vector3
     */
    getColumn(i: number): Vector3
    {
        return new Vector3(this.mat[i], this.mat[i+4], this.mat[i+8]);
    }

    /**
     * Returns the first three elements of row i as a new Vector3.
     * @param i The zero-based index of the row (0..3)
     * @returns A new Vector3.
     */
    getRow(i: number): Vector3
    {
        return new Vector3(this.mat[i*4], this.mat[i*4+1], this.mat[i*4+2]);
    }

    /**
     * Sets the first three elements of column i using the x, y, z components of the supplied vector.
     * @param col The zero-based index of the column (0..3)
     * @param v A vector containing the new values for the column
     */
    setColumn(col: number, v: Vector3): void
    {
        this.mat[col] = v.x;
        this.mat[col+4] = v.y;
        this.mat[col+8] = v.z;
    }

    /**
     * Sets the first three elements of row i using the x, y, z components of the supplied vector.
     * @param row The zero-based index of the row (0..3)
     * @param v A vector containing the new values for the row
     */
    setRow(row: number, v: Vector3): void
    {
        this.mat[row*4] = v.x;
        this.mat[row*4+1] = v.y;
        this.mat[row*4+2] = v.z;
    }

    /**
     * Decomposes the 4x4 transformation matrix into separate translation, rotation, and scale components such
     * that the original matrix can be represented as a combination of transformations in the form T * R * S.
     * The decomposition is straightforward (relatively efficient) if the matrix does not include a negative
     * scale.  If the matrix includes a negative scale factor, a slower polar decomposition must be used,
     * and the caller must explicitly set the containsNegScale to true.
     * 
     * @param containsNegScale Set to true if the matrix includes a negative scale factor.
     * @returns An array of three elements [translation: Vector3, rotation: Quaternion, scale: Vector3]
     */
    decompose(containsNegScale: boolean): [Vector3, Quaternion, Vector3]
    {
        const position = new Vector3();
        const rotation = new Quaternion();
        const scale = new Vector3();

        const matrixCopy = this.clone();

        // Extract translation component of the matrix
        position.set(matrixCopy.mat[12], matrixCopy.mat[13], matrixCopy.mat[14]);
        matrixCopy.mat[12] = 0;
        matrixCopy.mat[13] = 0;
        matrixCopy.mat[14] = 0;

        // Zero out any projection components of the matrix
        matrixCopy.mat[3] = 0;
        matrixCopy.mat[7] = 0;
        matrixCopy.mat[11] = 0;
        matrixCopy.mat[15] = 1;

        if(containsNegScale)
        {
            // If the matrix includes negative scales, then the rotation and scale
            // can be extracted using the polar decomposition method described here
            // http://callumhay.blogspot.com/2010/10/decomposing-affine-transforms.html

            // Extract the rotation component - this is done using polar decompostion, where
            // we successively average the matrix with its inverse transpose until there is
            // no/a very small difference between successive averages
            let rotationMatrix = new Matrix4();
            let count = 0;
            let norm;
            do 
            {
                const currentInverseTranspose = rotationMatrix.transpose();
                currentInverseTranspose.invert();

                // Go through every component in the matrices and find the next matrix
                const nextRotationMatrix = new Matrix4();
                for(let i=0; i<16; i++)
                {
                    nextRotationMatrix.mat[i] = 0.5 * (rotationMatrix.mat[i] + currentInverseTranspose.mat[i]);
                }

                norm = 0;

                for (let i = 0; i < 3; i++) 
                {
                    const n = Math.abs(rotationMatrix.mat[i] - nextRotationMatrix.mat[i]) +
                              Math.abs(rotationMatrix.mat[i+4] - nextRotationMatrix.mat[i+4]) +
                              Math.abs(rotationMatrix.mat[i+8] - nextRotationMatrix.mat[i+8]);
                    norm = Math.max(norm, n);
                }

                rotationMatrix = nextRotationMatrix;
                count ++;
            }
            while(count < 100 && norm > Number.EPSILON);

            // Set the quaternion based on the extracted rotation matrix
            rotation.setMatrix(rotationMatrix);

            // The scale is simply the removal of the rotation from the non-translated matrix
            const scaleMatrix = Matrix4.multiply(rotationMatrix.inverse(), matrixCopy);
            scale.set(scaleMatrix.mat[0], scaleMatrix.mat[5], scaleMatrix.mat[10]);

            // Special consideration: if there's a single negative scale (all other combinations of negative 
            // scales will be part of the rotation matrix), the determinant of the normalized rotation matrix
            // will be < 0.  If this is the case we apply a negative to one arbitrary component of the scale.
            const row0 = matrixCopy.getRow(0);
            const row1 = matrixCopy.getRow(1);
            const row2 = matrixCopy.getRow(2);
            row0.normalize();
            row1.normalize();
            row2.normalize();

            const normalizedRotationMatrix = new Matrix4();
            normalizedRotationMatrix.setRow(0, row0);
            normalizedRotationMatrix.setRow(1, row1);
            normalizedRotationMatrix.setRow(2, row2);
            if (normalizedRotationMatrix.determinant() < 0.0) 
            {
                scale.x *= -1;
            }    
        }
        else
        {
            // If the matrix does not include negative scales
            // then we can decompose the matrix more efficiently

            // Extract scale component of the matrix
            const sx = matrixCopy.getColumn(0).length();
            const sy = matrixCopy.getColumn(1).length();
            const sz = matrixCopy.getColumn(2).length();
            scale.set(sx, sy, sz);

            // Remove scale component from the matrix
            matrixCopy.multiply(Matrix4.makeScale(new Vector3(1 / sx, 1 / sy, 1 / sz)));

            // Set the rotation quaternion from the pure rotation matrix
            rotation.setMatrix(matrixCopy);
        }

        return [position, rotation, scale];
    }

    /**
     * Checks if every element of this Matrix4 is exactly equal to every element of the given Matrix4
     *
     * @param other - The other Matrix3 to compare to
     * @returns A boolean value indicating if the two matrices are equal
     */
    equals(other: Matrix4): boolean
    {
        for (let i=0; i<16; i++) {
            if (this.mat[i] != other.mat[i]) 
                return false;
        }
        return true;
    }

    /**
     * Checks if  every element of this Matrix4 is exactly equal (within a small value of epsilon) to
     * every element of the given Matrix4  
     *
     * @param other - The other Matrix3 to compare to
     * @param epsilon - A small value of acceptable variance to account for numerical instability
     * @returns A boolean value indicating if the two matrices are equal
     */
    fuzzyEquals(other: Matrix4, epsilon: number = MathUtils.EPSILON): boolean
    {
        for (let i=0; i<16; i++) {
            if (Math.abs(this.mat[i] - other.mat[i]) < epsilon) 
                return false;
        }
        return true;
    }
}
