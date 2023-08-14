import { Matrix4 } from "../math/Matrix4";
import { Quaternion } from "../math/Quaternion";
import { Vector3 } from "../math/Vector3";
import { Camera } from "./Camera";
import { LightManager } from "../lights/LightManager";
import { BoundingBox3 } from "../math/BoundingBox3";
import { BoundingSphere } from "../math/BoundingSphere"
import { BoundingVolumeMaterial } from "../materials/BoundingVolumeMaterial";

export enum IntersectionMode3 {
    BOUNDING_SPHERE,
    AXIS_ALIGNED_BOUNDING_BOX
}

export class Node3
 {
    /**
     * The position of this node as a Vector3.
     */
    protected _position: Vector3;

    /**
     * The rotation of this transform represented as a quaternion.
     */
    protected _rotation: Quaternion;
    
    /**
     * The scale of this node as a Vector3.
     * */
    protected _scale: Vector3;

    /**
     * The local transformation matrix of this node.
     */
    protected localToParentMatrix: Matrix4;

    /**
     * The world transformation matrix of this node.
     */
    public localToWorldMatrix: Matrix4;

    protected localMatrixDirty: boolean;
    protected localMatrixUpdated: boolean;
    protected localMatrixNegScale: boolean;
    protected worldMatrixDirty: boolean;

    /*
    An array of child nodes that are attached to this nodes.
    */
    public children: Array<Node3>;

    /**
    Whether this transform is currently visible in the scene.
    */
    public visible: boolean;

    /**
    The parent transform of this transform. Null if this transform has no parent.
    */
    public parent: Node3 | null;
    /**
    The bounding box of this transform.
    */
    public boundingBox: BoundingBox3;
    /**
    The bounding sphere of this transform.
    */
    public boundingSphere: BoundingSphere;
    /**
    Whether to draw the bounding volume of this transform.
    */
    public drawBoundingVolume: boolean;
    /**
    The material to use for drawing the bounding volume of this transform.
    */
    public boundingVolumeMaterial: BoundingVolumeMaterial | null;

    /**
    Constructs a new Node3 object.
    */
    constructor() 
    {
        this._position = new Vector3();
        this._rotation = new Quaternion();
        this._scale = new Vector3(1, 1, 1);

        this.localToParentMatrix = new Matrix4();
        this.localToWorldMatrix = new Matrix4();

        this.localMatrixDirty = false;
        this.localMatrixUpdated = false;
        this.localMatrixNegScale = false;
        this.worldMatrixDirty = false;

        this.children = [];
        
        this.visible = true;
        this.parent = null;

        this.boundingBox = new BoundingBox3();
        this.boundingSphere = new BoundingSphere();

        this.drawBoundingVolume = false;
        this.boundingVolumeMaterial = null;
    }

    public get position()
    {
        if(this.localMatrixUpdated)
        {
            this.decomposeLocalMatrix();
        }
        
        this.localMatrixDirty = true;
        return this._position;
    }

    public set position(value: Vector3)
    {
        this.localMatrixDirty = true;
        this._position = value;
    }

    public get rotation()
    {
        if(this.localMatrixUpdated)
        {
            this.decomposeLocalMatrix();
        }

        this.localMatrixDirty = true;
        return this._rotation;
    }

    public set rotation(value: Quaternion)
    {
        this.localMatrixDirty = true;
        this._rotation = value;
    }

    public get scale()
    {
        if(this.localMatrixUpdated)
        {
            this.decomposeLocalMatrix();
        }

        this.localMatrixDirty = true;
        return this._scale;
    }

    public set scale(value: Vector3)
    {
        this.localMatrixDirty = true;
        this._scale = value;
    }

    public getLocalToParentMatrix(): Matrix4
    {
        this.composeLocalMatrix();
        return this.localToParentMatrix.clone();
    }

    public setLocalToParentMatrix(matrix: Matrix4, includesNegScale: boolean): void
    {
        this.localToParentMatrix.copy(matrix);  
        this.localMatrixUpdated = true;
        this.localMatrixNegScale = includesNegScale; 
        this.worldMatrixDirty = true;
    }

    /**
     * Traverses the scene graph starting from this Node3 object and updates the world matrices of all
     * Node3 objects in the graph.
     */
    traverseSceneGraph(parentMatrixDirty = false): void 
    {
        const worldMatrixDirty = parentMatrixDirty || this.localMatrixDirty || this.worldMatrixDirty;

        if(this.localMatrixDirty) 
        {
            this.composeLocalMatrix();
        }

        if(worldMatrixDirty)
        {
            this.localToWorldMatrix.copy(this.localToParentMatrix);

            if(this.parent)
            {  
                this.localToWorldMatrix.premultiply(this.parent.localToWorldMatrix);
            }

            this.worldMatrixDirty = false;
        }

        this.children.forEach((elem: Node3) => {
            elem.traverseSceneGraph(worldMatrixDirty);
        });
    }

    /**
    Updates the world matrix of this Node3 by computing the multiplication
    of its local matrix with its parent's world matrix (if it has a parent).
    @returns void
    */
    updateWorldMatrix(): void 
    {
        if(this.localMatrixDirty) 
        {
            this.composeLocalMatrix();
        }

        this.localToWorldMatrix.copy(this.localToParentMatrix);

        if (this.parent) 
        {
            this.parent.updateWorldMatrix();
            this.localToWorldMatrix.premultiply(this.parent.localToWorldMatrix);
        }

        this.worldMatrixDirty = false;
    }

    /**
     * Adds a child Node3 to the current Node3
     * @param child - The Node3 to be added
     */
    add(child: Node3) {
        this.children.push(child);
        child.parent = this;
    }

    /**
     * Removes the current Node3 from its parent Node3 
     * @returns true if the Node3 was successfully removed, false otherwise
     */
    remove(): boolean {
        if (this.parent == null)
            return false;
        else
            return this.parent.removeChild(this) != null;
    }

    /**
     * Removes the given child Node3 from the current Node3
     * @param child - The Node3 to be removed
     * @returns The removed Node3 if found, null otherwise
     */
    removeChild(child: Node3): Node3 | null {
        const index = this.children.indexOf(child);

        if (index == -1) {
            return null;
        }
        else {
            const removedElement = this.children.splice(index, 1);
            removedElement[0].parent = null;
            return removedElement[0];
        }
    }

    /**
    Draws this transform and all its children in the scene graph.
    @param parent - The parent transform of this transform.
    @param camera - The camera used to view the scene.
    @param lightManager - The light manager used to manage the lights in the scene.
    */
    draw(parent: Node3, camera: Camera, lightManager: LightManager): void {
        if (!this.visible)
            return;

        if (this.drawBoundingVolume && this.boundingVolumeMaterial)
            this.boundingVolumeMaterial.draw(this, this, camera, lightManager);

        this.children.forEach((elem: Node3) => {
            elem.draw(this, camera, lightManager);
        });
    }

    /**
     * Sets lights on the children of the Node3
     * @param lightManager - The LightManager object
     */
    setLights(lightManager: LightManager): void {
        this.children.forEach((elem) => {
            elem.setLights(lightManager);
        });
    }

    /**
    * Rotates this Node3 object to look at the given target with the given up vector
    * 
    * @param target - The Vector3 representing the target in world space
    * @param up - The Vector3 representing the up direction (defaults to Vector3.UP)
    */
    lookAt(target: Vector3, up = Vector3.UP): void {

        // TO BE CHANGED
        // Construct matrix directly
        // Matrix decomposition is unnecessary

        this.updateWorldMatrix();

        const worldPosition = this.localToWorldMatrix.getTranslation();
        this.rotation.lookAt(worldPosition, target, up);
        this.localMatrixDirty = true;
    }

    /**
     * Checks for intersection between this Node3 and another
     * 
     * @param other - The other Node3 object
     * @param mode - The IntersectionMode3 to use for the comparison (default: BOUNDING_SPHERE)
     * @returns Whether or not the two objects intersect
     */
    intersects(other: Node3, mode = IntersectionMode3.BOUNDING_SPHERE): boolean {

        // TO BE CHANGED
        // Use the transformation matrix instead of position and scale
        // Add a parameter to specify local or world coordinate frame

        if (mode == IntersectionMode3.BOUNDING_SPHERE) {
            const thisSphere = new BoundingSphere();
            thisSphere.copy(this.boundingSphere);
            thisSphere.transform(this.position, this.scale);

            const otherSphere = new BoundingSphere();
            otherSphere.copy(other.boundingSphere);
            otherSphere.transform(other.position, other.scale);

            return thisSphere.intersects(otherSphere);
        }
        else if (mode == IntersectionMode3.AXIS_ALIGNED_BOUNDING_BOX) {
            const thisBox = new BoundingBox3();
            thisBox.copy(this.boundingBox);
            thisBox.transform(this.position, this.rotation, this.scale);

            const otherBox = new BoundingBox3();
            otherBox.copy(other.boundingBox);
            otherBox.transform(other.position, other.rotation, other.scale);

            return thisBox.intersects(otherBox);
        }
        else {
            return false;
        }
    }

    public composeLocalMatrix(): void
    {
        this.localMatrixNegScale = this._scale.x < 0 || this._scale.y < 0 || this._scale.z < 0;
        this.localMatrixDirty = false;
        this.localMatrixUpdated = false;
        this.worldMatrixDirty = true;

        this.localToParentMatrix.compose(this._position, this._rotation, this._scale);
    }

    public decomposeLocalMatrix(): void
    {
        this.localMatrixDirty = false;
        this.localMatrixUpdated = false;

        [this._position, this._rotation, this._scale] = this.localToParentMatrix.decompose(this.localMatrixNegScale);
    }
}