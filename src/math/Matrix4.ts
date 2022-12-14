import { Vector3 } from "./Vector3";
import { Quaternion } from "./Quaternion";

export class Matrix4
{
    public static readonly IDENTITY = new Matrix4();

    public mat: Array<number>;

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

    static copy(m: Matrix4): Matrix4
    {
        const mat = new Matrix4();
        mat.copy(m);
        return mat;
    }

    public static fromRowMajor(n1: number, n2: number, n3: number, n4: number, 
        n5: number, n6: number, n7: number, n8: number, 
        n9: number, n10: number, n11: number, n12: number, 
        n13: number, n14: number, n15: number, n16: number): Matrix4
    {
        const matrix = new Matrix4();
        matrix.setRowMajor(n1, n2, n3, n4, n5, n6, n7, n8, n9, n10, n11, n12, n13, n14, n15, n16);
        return matrix;
    }

    public static fromColumnMajor(n1: number, n2: number, n3: number, n4: number, 
        n5: number, n6: number, n7: number, n8: number, 
        n9: number, n10: number, n11: number, n12: number, 
        n13: number, n14: number, n15: number, n16: number): Matrix4
    {
        const matrix = new Matrix4();
        matrix.setColumnMajor(n1, n2, n3, n4, n5, n6, n7, n8, n9, n10, n11, n12, n13, n14, n15, n16);
        return matrix;
    }

    public static makeIdentity(): Matrix4
    {
        return Matrix4.fromRowMajor(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
    }

    public static makeTranslation(v: Vector3): Matrix4
    {
        return Matrix4.fromRowMajor(
            1, 0, 0, v.x,
            0, 1, 0, v.y,
            0, 0, 1, v.z,
            0, 0, 0, 1
        );
    }

    public static makeRotation(rotation: Quaternion): Matrix4
    {
        const matrix = new Matrix4();
        matrix.setRotation(rotation);
        return matrix;
    }

    public static makeRotationX(angle: number): Matrix4
    {
        const matrix = new Matrix4();
        matrix.setRotationX(angle);
        return matrix;
    }

    public static makeRotationY(angle: number): Matrix4
    {
        const matrix = new Matrix4();
        matrix.setRotationY(angle);
        return matrix;
    }

    public static makeRotationZ(angle: number): Matrix4
    {
        const matrix = new Matrix4();
        matrix.setRotationZ(angle);
        return matrix;
    }

    public static makeAxisAngle(axis: Vector3, angle: number): Matrix4
    {
        const matrix = new Matrix4();
        matrix.setAxisAngle(axis, angle);
        return matrix;
    }

    public static makeEulerAngles(x: number, y: number, z: number, order = 'YZX'): Matrix4
    {
        const dest = new Matrix4();
        dest.setEulerAngles(x, y, z, order);
        return dest;
    }

    public static makeScale(scale: Vector3): Matrix4
    {
        const matrix = new Matrix4();
        matrix.setScale(scale);
        return matrix;
    }

    public static compose(position = Vector3.ZERO, rotation = Quaternion.IDENTITY, scale = Vector3.UP): Matrix4
    {
        const matrix = new Matrix4();
        matrix.compose(position, rotation, scale);
        return matrix;
    }

    public static lookAt(eye: Vector3, target: Vector3, up: Vector3): Matrix4
    {
        const matrix = new Matrix4();
        matrix.lookAt(eye, target, up);
        return matrix;
    }

    public static makeOrthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4
    {
        const matrix = new Matrix4();
        matrix.setOrthographic(left, right, bottom, top, near, far);
        return matrix;
    }

    public static makePerspective(fov: number, aspectRatio: number, near: number, far: number): Matrix4
    {
        const matrix = new Matrix4();
        matrix.setPerspective(fov, aspectRatio, near, far);
        return matrix;
    }

    public static makeFrustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4
    {
        const matrix = new Matrix4();
        matrix.setFrustum(left, right, bottom, top, near, far);
        return matrix;
    }

    constructor()
    {
        this.mat = [ 
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    }

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

    copy(m: Matrix4): void
    {
        for(let i=0; i < 16; i++)
            this.mat[i] = m.mat[i];
    }

    clone(): Matrix4
    {
        const matrix = new Matrix4();
        
        for(let i=0; i < 16; i++)
            matrix.mat[i] = this.mat[i];

        return matrix;
    }

    element(row: number, col: number): number
    {
        return this.mat[col*4 + row];
    }

    set(value: number, row: number, col: number): void
    {
       this.mat[col*4 + row] = value;
    }

    multiply(m: Matrix4): void
    {
        const temp = Matrix4.multiply(m, this);
        this.copy(temp);
    }

    premultiply(m: Matrix4): void
    {
        const temp = Matrix4.multiply(this, m);
        this.copy(temp);
    }

    setIdentity(): void
    {
        this.setRowMajor(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
    }

    setTranslation(v: Vector3): void
    {
        this.setRowMajor(
            1, 0, 0, v.x,
            0, 1, 0, v.y,
            0, 0, 1, v.z,
            0, 0, 0, 1
        );
    }

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

    setScale(scale: Vector3): void
    {
        this.setRowMajor(
            scale.x, 0, 0, 0,
            0, scale.y, 0, 0,
            0, 0, scale.z, 0,
            0, 0, 0, 1    
        );
    }

    getTranslation(): Vector3
    {
        return new Vector3(this.mat[12], this.mat[13], this.mat[14]);
    }

    getRotation(): Quaternion
    {
        return Quaternion.makeMatrix(this);
    }

    getScale(): Vector3
    {
        return new Vector3(
            Math.sqrt(this.mat[0]*this.mat[0] + this.mat[1]*this.mat[1] + this.mat[2]*this.mat[2]),
            Math.sqrt(this.mat[4]*this.mat[4] + this.mat[5]*this.mat[5] + this.mat[6]*this.mat[6]),
            Math.sqrt(this.mat[8]*this.mat[8] + this.mat[9]*this.mat[9] + this.mat[10]*this.mat[10])
        );
    }

    setOrthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): void
    {
        this.setRowMajor(
            2/(right-left), 0, 0, -(right+left)/(right-left),
            0, 2/(top-bottom), 0, -(top+bottom)/(top-bottom),
            0, 0, -2/(far-near), -(far+near)/(far-near),
            0, 0, 0, 1
        );
    }

    setPerspective(fov: number, aspectRatio: number, near: number, far: number): void
    {
        const yMax = near * Math.tan(fov * Math.PI / 360);
        const xMax = yMax * aspectRatio;
        this.setFrustum(-xMax, xMax, -yMax, yMax, near, far); 
    }

    setFrustum(left: number, right: number, bottom: number, top: number, near: number, far: number): void
    {
        this.setRowMajor(
            2*near/(right-left), 0, (right+left)/(right-left), 0,
            0, 2*near/(top-bottom), (top+bottom)/(top-bottom), 0,
            0, 0, -(far+near)/(far-near), -2*far*near/(far-near),
            0, 0, -1, 0
        );
    }

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

    multiplyScalar(x: number): void
    {
        for(let i=0; i < 16; i++)
            this.mat[i] *= x;
    }

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

    invert(): void
    {
        const inverseMatrix = this.inverse();
        this.copy(inverseMatrix);
    }

    transpose(): Matrix4
    {
        return Matrix4.fromRowMajor(
            this.mat[0], this.mat[1], this.mat[2], this.mat[3],
            this.mat[4], this.mat[5], this.mat[6], this.mat[7],
            this.mat[8], this.mat[9], this.mat[10], this.mat[11],
            this.mat[12], this.mat[13], this.mat[14], this.mat[15]
        );
    }

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

    compose(position = Vector3.ZERO, rotation = Quaternion.IDENTITY, scale = Vector3.ONE): void
    {
        this.setTranslation(position);
        this.multiply(rotation.getMatrix());
        this.multiply(Matrix4.makeScale(scale));
    }

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