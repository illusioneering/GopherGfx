import { Transform3 } from './Transform3'
import { Matrix4 } from '../math/Matrix4'

export class Camera extends Transform3
{
    protected aspectRatio: number;
    protected fov: number;
    protected near: number;
    protected far: number;
    protected left: number;
    protected right: number;
    
    public projectionMatrix: Matrix4;
    public viewMatrix: Matrix4;
    public projectionMatrixDirty: boolean;

    constructor()
    {
        super();

        this.fov = 0;
        this.aspectRatio = 0;
        this.near = 0;
        this.far = 0;
        this.left = 0;
        this.right = 0;
        this.projectionMatrixDirty = true;

        this.projectionMatrix = new Matrix4();
        this.viewMatrix = new Matrix4();
    }

    public setPerspectiveCamera(fov: number, aspectRatio: number, near: number, far: number): void
    {
        this.fov = fov;
        this.aspectRatio = aspectRatio;
        this.near = near;
        this.far = far;
        this.projectionMatrixDirty = true;

        this.projectionMatrix.makePerspective(fov, aspectRatio, near, far);
    }

    public setOrthographicCamera(left: number, right: number, bottom: number, top: number, near: number, far: number): void
    {
        this.left = left;
        this.right = right;
        this.aspectRatio = Math.abs((right-left) / (top-bottom));
        this.near = near;
        this.far = far;
        this.projectionMatrixDirty = true;

        this.projectionMatrix.makeOrthographic(left, right, bottom, top, near, far);
    }

    public computeWorldTransform(): void
    {
        super.computeWorldTransform();
        this.viewMatrix = this.worldMatrix.inverse();
    }

    public getAspectRatio(): number
    {
        return this.aspectRatio;
    }

    public getNear(): number
    {
        return this.near;
    }

    public getFar(): number
    {
        return this.far;
    }

    public getLeft(): number
    {
        return this.left;
    }

    public getRight(): number
    {
        return this.right;
    }

}