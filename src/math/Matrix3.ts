import { Vector2 } from './Vector2'

export class Matrix3
{
/**
 *  A static Matrix3 object representing the identity matrix
 */
    public static readonly IDENTITY = new Matrix3();

/**
 * An array of 9 numbers representing a 3x3 matrix
 */
    public mat: Array<number>;

/**
 * Multiplies two 3x3 matrices, m1 and m2, and returns the result as a new Matrix3
 * 
 * @param m1 - The first Matrix3 object to be multiplied
 * @param m2 - The second Matrix3 object to be multiplied
 * @returns A new Matrix3 object representing the product of m1 and m2
 */
    // Code from https://webglfundamentals.org/webgl/lessons/webgl-2d-matrices.html
    static multiply(m1: Matrix3, m2: Matrix3): Matrix3
    {
        const m = new Matrix3();
        
        m.mat[0] = m1.mat[0] * m2.mat[0] + m1.mat[1] * m2.mat[3] + m1.mat[2] * m2.mat[6];
        m.mat[1] = m1.mat[0] * m2.mat[1] + m1.mat[1] * m2.mat[4] + m1.mat[2] * m2.mat[7];
        m.mat[2] = m1.mat[0] * m2.mat[2] + m1.mat[1] * m2.mat[5] + m1.mat[2] * m2.mat[8];
        m.mat[3] = m1.mat[3] * m2.mat[0] + m1.mat[4] * m2.mat[3] + m1.mat[5] * m2.mat[6];
        m.mat[4] = m1.mat[3] * m2.mat[1] + m1.mat[4] * m2.mat[4] + m1.mat[5] * m2.mat[7];
        m.mat[5] = m1.mat[3] * m2.mat[2] + m1.mat[4] * m2.mat[5] + m1.mat[5] * m2.mat[8];
        m.mat[6] = m1.mat[6] * m2.mat[0] + m1.mat[7] * m2.mat[3] + m1.mat[8] * m2.mat[6];
        m.mat[7] = m1.mat[6] * m2.mat[1] + m1.mat[7] * m2.mat[4] + m1.mat[8] * m2.mat[7];
        m.mat[8] = m1.mat[6] * m2.mat[2] + m1.mat[7] * m2.mat[5] + m1.mat[8] * m2.mat[8];

        return m;
    }

/**
 * Creates a copy of a Matrix3 object
 * 
 * @param m - The Matrix3 object to be copied
 * @returns A new Matrix3 object representing a copy of the input Matrix3
 */
    static copy(m: Matrix3): Matrix3
    {
        const mat = new Matrix3();
        mat.copy(m);
        return mat;
    }

/**
 * Creates a new Matrix3 object from 9 numbers representing a row-major matrix
 * 
 * @param n1 - Number in row 1, column 1
 * @param n2 - Number in row 1, column 2
 * @param n3 - Number in row 1, column 3
 * @param n4 - Number in row 2, column 1
 * @param n5 - Number in row 2, column 2
 * @param n6 - Number in row 2, column 3
 * @param n7 - Number in row 3, column 1
 * @param n8 - Number in row 3, column 2
 * @param n9 - Number in row 3, column 3
 * @returns A new Matrix3 object created from the given numbers
 */
    public static fromRowMajor(n1: number, n2: number, n3: number,
        n4: number, n5: number, n6: number, 
        n7: number, n8: number, n9: number): Matrix3
    {
        const matrix = new Matrix3();
        matrix.setRowMajor(n1, n2, n3, n4, n5, n6, n7, n8, n9);
        return matrix;
    }

/**
 * Creates a new Matrix3 object from 9 numbers representing a column-major matrix
 * 
 * @param n1 - Number in column 1, row 1
 * @param n2 - Number in column 2, row 1
 * @param n3 - Number in column 3, row 1
 * @param n4 - Number in column 1, row 2
 * @param n5 - Number in column 2, row 2
 * @param n6 - Number in column 3, row 2
 * @param n7 - Number in column 1, row 3
 * @param n8 - Number in column 2, row 3
 * @param n9 - Number in column 3, row 3
 * @returns A new Matrix3 object created from the given numbers
 */
    public static fromColumnMajor(n1: number, n2: number, n3: number,
        n4: number, n5: number, n6: number, 
        n7: number, n8: number, n9: number): Matrix3
    {
        const matrix = new Matrix3();
        matrix.setColumnMajor(n1, n2, n3, n4, n5, n6, n7, n8, n9);
        return matrix;
    }

/**
 * Creates a new Matrix3 object representing a translation matrix
 * 
 * @param v - The Vector2 object representing the translation vector
 * @returns A new Matrix3 object representing a translation matrix
 */
    public static makeTranslation(v: Vector2): Matrix3
    {
        return Matrix3.fromRowMajor(
            1, 0, v.x,
            0, 1, v.y,
            0, 0, 1
        );
    }

/**
 * Creates a new Matrix3 object representing a rotation matrix
 * 
 * @param angle - The angle of rotation, in radians
 * @returns A new Matrix3 object representing a rotation matrix
 */
    public static makeRotation(angle: number): Matrix3
    {
        const cosTheta = Math.cos(angle);
        const sinTheta = Math.sin(angle);
        
        return Matrix3.fromRowMajor(
            cosTheta, -sinTheta, 0,
            sinTheta, cosTheta, 0,
            0, 0, 1
        );
    }

/**
 * Creates a new Matrix3 object representing a scaling matrix
 * 
 * @param scale - The Vector2 object representing the x and y scaling factors
 * @returns A new Matrix3 object representing a scaling matrix
 */
    public static makeScale(scale: Vector2): Matrix3
    {
        return Matrix3.fromRowMajor(
            scale.x, 0, 0,
            0, scale.y, 0,
            0, 0, 1 
        );
    }

/**
 * Creates a Matrix3 object from position, rotation, and scale
 * 
 * @param position - The Vector2 representing the position
 * @param rotation - The angle to rotate by, in radians
 * @param scale - The Vector2 representing the scale to apply
 * @returns The resulting Matrix3 object
 */ 
    public static compose(position = Vector2.ZERO, rotation = 0, scale = Vector2.ONE): Matrix3
    {
        const matrix = new Matrix3();
        matrix.compose(position, rotation, scale);
        return matrix;
    }

/**
 * Creates a new Matrix3 object and initializes the mat array with the given values.
 */
    constructor()
    {
        this.mat = [ 
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ];
    }

/**
 * Sets the elements of the Matrix3 in column major order.
 * 
 * @param n1 - The first element in the first column
 * @param n2 - The second element in the first column
 * @param n3 - The third element in the first column
 * @param n4 - The first element in the second column
 * @param n5 - The second element in the second column
 * @param n6 - The third element in the second column
 * @param n7 - The first element in the third column
 * @param n8 - The second element in the third column
 * @param n9 - The third element in the third column
 */
    setColumnMajor(n1: number, n2: number, n3: number,
        n4: number, n5: number, n6: number, 
        n7: number, n8: number, n9: number): void
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
    }

/**
 * Sets the elements of the Matrix3 in row major order.
 * 
 * @param n1 - The first element in the first row
 * @param n2 - The second element in the first row
 * @param n3 - The third element in the first row
 * @param n4 - The first element in the second row
 * @param n5 - The second element in the second row
 * @param n6 - The third element in the second row
 * @param n7 - The first element in the third row
 * @param n8 - The second element in the third row
 * @param n9 - The third element in the third row
 */
    setRowMajor(n1: number, n2: number, n3: number,
        n4: number, n5: number, n6: number, 
        n7: number, n8: number, n9: number): void
    {
        this.mat[0] = n1;
        this.mat[1] = n4;
        this.mat[2] = n7;
        this.mat[3] = n2;
        this.mat[4] = n5;
        this.mat[5] = n8;
        this.mat[6] = n3;
        this.mat[7] = n6;
        this.mat[8] = n9;
    }

/**
 * Copies the values of the specified Matrix3 into this Matrix3.
 * 
 * @param m - The Matrix3 to copy the values from
 */
    copy(m: Matrix3): void
    {
        for(let i=0; i < 9; i++)
            this.mat[i] = m.mat[i];
    }

/**
 * Returns the element at the specified row and column of the Matrix3.
 * 
 * @param row - The row of the element to return
 * @param col - The column of the element to return
 * @returns The element at the specified row and column of the Matrix3
 */
    element(row: number, col: number): number
    {
        return this.mat[col*3 + row];
    }

/**
 * Sets the value of the specified element in the Matrix3.
 * 
 * @param value - The value to set
 * @param row - The row of the element to set
 * @param col - The column of the element to set
 */
    set(value: number, row: number, col: number): void
    {
       this.mat[col*3 + row] = value;
    }

/**
 * Multiplies the current matrix with another Matrix3
 * 
 * @param m - The Matrix3 to be multiplied with the current matrix
 */
    multiply(m: Matrix3): void
    {
        const temp = Matrix3.multiply(m, this);
        this.copy(temp);
    }

/**
 * Sets the translation of this matrix from a Vector2.
 * 
 * @param v - The Vector2 to set the translation from.
 */
    setTranslation(v: Vector2): void
    { 
        this.setRowMajor(
            1, 0, v.x,
            0, 1, v.y,
            0, 0, 1
        );
    }

 /**
 * Sets the rotation of this matrix from a given angle.
 * 
 * @param angle - The angle in radians to set the rotation from.
 */   
    setRotation(angle: number): void
    {
        const cosTheta = Math.cos(angle);
        const sinTheta = Math.sin(angle);
        
        this.setRowMajor(
            cosTheta, -sinTheta, 0,
            sinTheta, cosTheta, 0,
            0, 0, 1
        );
    }

/**
 * Sets the scale of this matrix from a Vector2.
 * 
 * @param scale - The Vector2 to set the scale from.
 */
    setScale(scale: Vector2): void
    {
        this.setRowMajor(
            scale.x, 0, 0,
            0, scale.y, 0,
            0, 0, 1 
        );
    }

    multiplyScalar(x: number): void
    {
        for(let i=0; i < 9; i++)
            this.mat[i] *= x;
    }
    
/**
 * Computes the inverse of this matrix.
 * 
 * @returns The inverse of this matrix
 */
    // Code from http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/threeD/index.htm
    inverse(): Matrix3
    {
        const inverse = new Matrix3();

        const det = this.mat[0]*this.mat[4]*this.mat[8] + 
            this.mat[1]*this.mat[5]*this.mat[6] + 
            this.mat[2]*this.mat[3]*this.mat[7] - 
            this.mat[0]*this.mat[5]*this.mat[7] -
             this.mat[1]*this.mat[3]*this.mat[8] - 
             this.mat[2]*this.mat[4]*this.mat[6];

        this.mat[0] = (this.mat[4]*this.mat[8] - this.mat[5]*this.mat[7])/det;
        this.mat[1] = (this.mat[2]*this.mat[7] - this.mat[1]*this.mat[8])/det;
        this.mat[2] = (this.mat[1]*this.mat[5] - this.mat[2]*this.mat[4])/det;
        this.mat[3] = (this.mat[5]*this.mat[6] - this.mat[3]*this.mat[8])/det;
        this.mat[4] = (this.mat[0]*this.mat[8] - this.mat[2]*this.mat[6])/det;
        this.mat[5] = (this.mat[2]*this.mat[3] - this.mat[0]*this.mat[5])/det;
        this.mat[6] = (this.mat[3]*this.mat[7] - this.mat[4]*this.mat[6])/det;
        this.mat[7] = (this.mat[1]*this.mat[6] - this.mat[0]*this.mat[7])/det;
        this.mat[8] = (this.mat[0]*this.mat[4] - this.mat[1]*this.mat[3])/det;

        return inverse;
    }

/**
 * Inverts this matrix in place.
 */
    invert(): void
    {
        const inverseMatrix = this.inverse();
        this.copy(inverseMatrix);
    }

/**
 * Transposes this matrix.
 * 
 * @returns The transposed matrix.
 */
    transpose(): Matrix3
    {
        return Matrix3.fromRowMajor(
            this.mat[0], this.mat[1], this.mat[2], 
            this.mat[3], this.mat[4], this.mat[5], 
            this.mat[6], this.mat[7], this.mat[8]
        );
    }

/**
 * Compose the current Matrix3 object from position, rotation, and scale
 * 
 * @param position - The Vector2 representing the position
 * @param rotation - The angle to rotate by, in radians
 * @param scale - The Vector2 representing the scale to apply
 */
    compose(position = Vector2.ZERO, rotation = 0, scale = Vector2.ONE): void
    {
        this.setTranslation(position);
        this.multiply(Matrix3.makeRotation(rotation));
        this.multiply(Matrix3.makeScale(scale));
    }

/**
 * Decomposes this matrix into a position, rotation and scale.
 * 
 * @returns An array containing the position, rotation and scale of this matrix.
 */
    decompose(): [Vector2, number, Vector2]
    {
        const position = new Vector2();
        const scale = new Vector2();
        
        position.setPositionFromMatrix(this);
        scale.setScaleFromMatrix(this);

        return [position, Math.atan2(this.mat[1], this.mat[0]), scale];
    }
}