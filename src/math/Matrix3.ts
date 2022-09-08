import { Vector2 } from './Vector2'

export class Matrix3
{
    public static readonly IDENTITY = new Matrix3();

    public mat: Array<number>;

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

    static copy(m: Matrix3): Matrix3
    {
        const mat = new Matrix3();
        mat.copy(m);
        return mat;
    }

    public static fromRowMajor(n1: number, n2: number, n3: number,
        n4: number, n5: number, n6: number, 
        n7: number, n8: number, n9: number): Matrix3
    {
        const matrix = new Matrix3();
        matrix.setRowMajor(n1, n2, n3, n4, n5, n6, n7, n8, n9);
        return matrix;
    }

    public static fromColumnMajor(n1: number, n2: number, n3: number,
        n4: number, n5: number, n6: number, 
        n7: number, n8: number, n9: number): Matrix3
    {
        const matrix = new Matrix3();
        matrix.setColumnMajor(n1, n2, n3, n4, n5, n6, n7, n8, n9);
        return matrix;
    }

    public static makeTranslation(v: Vector2): Matrix3
    {
        return Matrix3.fromRowMajor(
            1, 0, v.x,
            0, 1, v.y,
            0, 0, 1
        );
    }

    public static makeRotation(angle: number): Matrix3
    {
        const matrix = new Matrix3();
        matrix.makeRotation(angle);
        return matrix;
    }

    public static makeScale(scale: Vector2): Matrix3
    {
        const matrix = new Matrix3();
        matrix.makeScale(scale);
        return matrix;
    }

    constructor()
    {
        this.mat = [ 
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ];
    }

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

    copy(m: Matrix3): void
    {
        for(let i=0; i < 9; i++)
            this.mat[i] = m.mat[i];
    }

    element(row: number, col: number): number
    {
        return this.mat[col*3 + row];
    }

    set(value: number, row: number, col: number): void
    {
       this.mat[col*3 + row] = value;
    }

    multiply(m: Matrix3): void
    {
        const temp = Matrix3.multiply(m, this);
        this.copy(temp);
    }

    makeTranslation(v: Vector2): void
    { 
        this.setRowMajor(
            1, 0, v.x,
            0, 1, v.y,
            0, 0, 1
        );
    }

    makeRotation(angle: number): void
    {
        const cosTheta = Math.cos(angle);
        const sinTheta = Math.sin(angle);
        
        this.setRowMajor(
            cosTheta, -sinTheta, 0,
            sinTheta, cosTheta, 0,
            0, 0, 1
        );
    }

    makeScale(scale: Vector2): void
    {
        this.setRowMajor(
            scale.x, 0, 0,
            0, scale.y, 0,
            0, 0, 1 
        );
    }

    makeTransform(position = Vector2.ZERO, rotation = 0, scale = Vector2.ONE): void
    {
        this.makeTranslation(position);
        this.multiply(Matrix3.makeRotation(rotation));
        this.multiply(Matrix3.makeScale(scale));
    }

    multiplyScalar(x: number): void
    {
        for(let i=0; i < 9; i++)
            this.mat[i] *= x;
    }

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

    invert(): void
    {
        const inverseMatrix = this.inverse();
        this.copy(inverseMatrix);
    }

    transpose(): Matrix3
    {
        return Matrix3.fromRowMajor(
            this.mat[0], this.mat[1], this.mat[2], 
            this.mat[3], this.mat[4], this.mat[5], 
            this.mat[6], this.mat[7], this.mat[8]
        );
    }

    decompose(): [Vector2, number, Vector2]
    {
        const position = new Vector2();
        const scale = new Vector2();
        
        position.setPositionFromMatrix(this);
        scale.setScaleFromMatrix(this);

        return [position, Math.atan2(this.mat[1], this.mat[3]), scale];
    }
}