import { Vector3 } from "./Vector3";
import { Quaternion } from "./Quaternion";

export class Matrix4
{
/**
 * Static field with the identity matrix
 */
    public static readonly IDENTITY = new Matrix4();

/**
 * Array of 16 numbers representing the elements in the Matrix4
 */
    public mat: Array<number>;

/**
 * Multiplies two Matrix4 objects and returns the result
 * 
 * @param m1 - The first Matrix4 object
 * @param m2 - The second Matrix4 object
 * @returns The result of the multiplication of the two input matrices
 */
    static multiply(m1: Matrix4, m2: Matrix4): Matrix4
    {
        const m = new Matrix4();
        m.mat[0] = 0;
        m.mat[5] = 0;
        m.mat[10] = 0;
        m.mat[15] = 0;

        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                for (let i = 0; i < 4; i++) {
                    m.mat[r*4+c] += m1.mat[r*4+i] * m2.mat[i*4+c];
                }
            }
        }

        return m;
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
        const matrix = new Matrix4();
        matrix.compose(position, rotation, scale);
        return matrix;
    }

/**
 * Creates a new Matrix4 object for the view matrix of a camera
 * 
 * @param eye - The Vector3 object representing the position of the camera
 * @param target - The Vector3 object representing the target of the camera
 * @param up - The Vector3 object representing the up vector of the camera
 * @returns A new Matrix4 object for the view matrix of a camera
 */
    public static lookAt(eye: Vector3, target: Vector3, up: Vector3): Matrix4
    {
        const matrix = new Matrix4();
        matrix.lookAt(eye, target, up);
        return matrix;
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
 * Multiplies this Matrix4 with the given Matrix4, and sets this Matrix4 to the result.
 * 
 * @param m - The Matrix4 to multiply with.
 */
    multiply(m: Matrix4): void
    {
        const temp = Matrix4.multiply(m, this);
        this.copy(temp);
    }

/**
 * Multiplies the given Matrix4 with this Matrix4, and sets this Matrix4 to the result.
 * 
 * @param m - The Matrix4 to multiply with.
 */    
    premultiply(m: Matrix4): void
    {
        const temp = Matrix4.multiply(this, m);
        this.copy(temp);
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
 * Sets the Matrix4 object to a look-at transformation
 * 
 * @param eye - The position of the eye
 * @param target - The target of the eye
 * @param up - The vector defining "up" (default Vector3.UP)
 */
    lookAt(eye: Vector3, target: Vector3, up = Vector3.UP): void
    {
        const z = Vector3.subtract(eye, target);
        z.normalize();

        const x = Vector3.cross(up, z);
        x.normalize();

        const y = Vector3.cross(z, x);
        y.normalize();

        const rotation = Matrix4.fromRowMajor(
            x.x, y.x, z.x, 0,
            x.y, y.y, z.y, 0,
            x.z, y.z, z.z, 0,
            0, 0, 0, 1
        );

        const translation = Matrix4.makeTranslation(eye);
        this.copy(Matrix4.multiply(rotation, translation));
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
* Computes the inverse of the Matrix4 object and sets the values of the current object
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
 * Sets the matrix's euler angles according to the specified order
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
 * Compose a Matrix4 object from a position, rotation, and scale
 * 
 * @param position - The position of the Matrix4 object (default Vector3.ZERO)
 * @param rotation - The rotation of the Matrix4 object (default Quaternion.IDENTITY)
 * @param scale - The scale of the Matrix4 object (default Vector3.ONE)
 */
    compose(position = Vector3.ZERO, rotation = Quaternion.IDENTITY, scale = Vector3.ONE): void
    {
        this.setTranslation(position);
        this.multiply(rotation.getMatrix());
        this.multiply(Matrix4.makeScale(scale));
    }

/**
 * Decompose a Matrix4 object into a position, rotation, and scale
 * 
 * @returns A tuple containing the position, rotation, and scale of the Matrix4 object
 */
    decompose(): [Vector3, Quaternion, Vector3]
    {
        const position = new Vector3();
        const rotation = new Quaternion();
        const scale = new Vector3();

        position.setPositionFromMatrix(this);
        scale.setScaleFromMatrix(this);

        const rotationMatrix = new Matrix4();
        rotationMatrix.mat[0] = this.mat[0] / scale.x;
        rotationMatrix.mat[1] = this.mat[1] / scale.x;
        rotationMatrix.mat[2] = this.mat[2] / scale.x;
        rotationMatrix.mat[3] = 0;

        rotationMatrix.mat[4] = this.mat[4] / scale.y;
        rotationMatrix.mat[5] = this.mat[5] / scale.y;
        rotationMatrix.mat[6] = this.mat[6] / scale.y;
        rotationMatrix.mat[7] = 0;

        rotationMatrix.mat[8] = this.mat[8] / scale.z;
        rotationMatrix.mat[9] = this.mat[9] / scale.z;
        rotationMatrix.mat[10] = this.mat[10] / scale.z;
        rotationMatrix.mat[11] = 0;

        rotationMatrix.mat[12] = 0;
        rotationMatrix.mat[13] = 0;
        rotationMatrix.mat[14] = 0;
        rotationMatrix.mat[15] = 1;

        rotation.setMatrix(rotationMatrix);

        return [position, rotation, scale];
    }
}