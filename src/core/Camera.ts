import { Node3 } from './Node3'
import { Matrix4 } from '../math/Matrix4'


/**
 * Camera class that extends Node3.
*/
export class Camera extends Node3
{
    protected aspectRatio: number;
    protected fov: number;
    protected near: number;
    protected far: number;
    protected left: number;
    protected right: number;
    
    /**
     * The projection matrix of the camera.
    */
    public projectionMatrix: Matrix4;

    /**
     * The view matrix of the camera.
    */
    public viewMatrix: Matrix4;

    /**
     * Indicates if the projection matrix needs to be updated.
    */
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

    /**
     * Sets the camera parameters for a perspective view
     * 
     * @param fov - The field of view
     * @param aspectRatio - The aspect ratio
     * @param near - The near plane
     * @param far - The far plane
     */
    public setPerspectiveCamera(fov: number, aspectRatio: number, near: number, far: number): void
    {
        this.fov = fov;
        this.aspectRatio = aspectRatio;
        this.near = near;
        this.far = far;
        this.projectionMatrixDirty = true;

        this.projectionMatrix.setPerspective(fov, aspectRatio, near, far);
    }

    /**
     * Sets the camera parameters for an orthographic view
     * 
     * @param left - The left plane
     * @param right - The right plane
     * @param bottom - The bottom plane
     * @param top - The top plane
     * @param near - The near plane
     * @param far - The far plane
     */
    public setOrthographicCamera(left: number, right: number, bottom: number, top: number, near: number, far: number): void
    {
        this.left = left;
        this.right = right;
        this.aspectRatio = Math.abs((right-left) / (top-bottom));
        this.near = near;
        this.far = far;
        this.projectionMatrixDirty = true;

        this.projectionMatrix.setOrthographic(left, right, bottom, top, near, far);
    }
    
    /**
     * Updates the camera's world matrix and view matrix
     */
    public updateWorldMatrix(): void
    {
        super.updateWorldMatrix();
        this.viewMatrix = this.localToWorldMatrix.inverse();
    }

    /**
     * Gets the aspect ratio of the camera
     * 
     * @returns The aspect ratio of the camera
     */
    public getAspectRatio(): number
    {
        return this.aspectRatio;
    }

    /**
     * Gets the distance from the camera to the near clipping plane
     * 
     * @returns The distance from the camera to the near clipping plane
     */
    public getNear(): number
    {
        return this.near;
    }

    /**
     * Gets the distance from the camera to the far clipping plane
     * 
     * @returns The distance from the camera to the far clipping plane
     */
    public getFar(): number
    {
        return this.far;
    }

    /**
     * Gets the leftmost x position an orthographic camera's view frustum
     * 
     * @returns The leftmost x position for the camera's view frustum
     */
    public getLeft(): number
    {
        return this.left;
    }

    /**
     * Gets the rightmost x position for an orthographic camera's view frustum
     * 
     * @returns The rightmost x position for the camera's view frustum
     */
    public getRight(): number
    {
        return this.right;
    }

}