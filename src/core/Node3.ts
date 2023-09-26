import { Matrix4 } from "../math/Matrix4";
import { Quaternion } from "../math/Quaternion";
import { Vector3 } from "../math/Vector3";
import { Camera } from "./Camera";
import { LightManager } from "../lights/LightManager";
import { BoundingBox3 } from "../math/BoundingBox3";
import { BoundingSphere } from "../math/BoundingSphere"

export enum IntersectionMode3 {
    BOUNDING_SPHERE,
    AXIS_ALIGNED_BOUNDING_BOX
}

export enum CoordinateSpace3 {
    LOCAL_SPACE,
    WORLD_SPACE
}

/**
 * This is the base class for all objects that can be added to a GopherGfx 3D scene.  It is named "Node"
 * because the scene is stored in a graph data structure, so we think of every element in that graph
 * as a "node" in the graph.  There is also a "Node2" base class for all objects that can be added to
 * the 2D scene.  
 * 
 * Every object that can be added to a 3D scene (e.g., Lights, Mesh3s) will inherit from this base object.
 * So, every object in the scene will have a position, rotation, scale, boundingBox, boundingSphere, 
 * visibility, and all of the other properties listed in this class.
 * 
 * For more detail on how the scene graph works, see the documentation for the Scene class.
 */
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
    The bounding box in vertex coordinate space
    */
    public boundingBox: BoundingBox3;

    /**
    The bounding sphere in vertex coordinate space
    */
    public boundingSphere: BoundingSphere;

    /**
     * Bounding box in this transform's local coordinate space
     */
    protected _localBoundingBox: BoundingBox3;

    /**
     * Bounding circle in this transform's local coordinate space
     */
    protected _localBoundingSphere: BoundingSphere;

    /**
     * Bounding box in the world coordinate space
     */
    protected _worldBoundingBox: BoundingBox3;

    /**
     * Bounding box in the world coordinate space
     */
    protected _worldBoundingSphere: BoundingSphere;

    public localBoundsDirty: boolean;
    public worldBoundsDirty: boolean;

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
        this._localBoundingBox = new BoundingBox3();
        this._localBoundingSphere = new BoundingSphere();
        this._worldBoundingBox = new BoundingBox3();
        this._worldBoundingSphere = new BoundingSphere();

        this.localBoundsDirty = false;
        this.worldBoundsDirty = false;
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
        if(this.localMatrixDirty)
        {
            this.composeLocalMatrix();
        }

        return this.localToParentMatrix.clone();
    }

    public setLocalToParentMatrix(matrix: Matrix4, includesNegScale: boolean): void
    {
        this.localToParentMatrix.copy(matrix);  
        this.localMatrixUpdated = true;
        this.localMatrixNegScale = includesNegScale; 
        this.worldMatrixDirty = true;
        this.localBoundsDirty = true;
    }

    public get localBoundingBox()
    {
        if(this.localBoundsDirty)
        {
            this.updateLocalBounds();
        }

        return this._localBoundingBox;
    }

    public set localBoundingBox(value: BoundingBox3)
    {
        this._localBoundingBox = value;
    }

    public get localBoundingSphere()
    {
        if(this.localBoundsDirty)
        {
            this.updateLocalBounds();
        }

        return this._localBoundingSphere;
    }

    public set localBoundingSphere(value: BoundingSphere)
    {
        this._localBoundingSphere = value;
    }

    public get worldBoundingBox()
    {
        if(this.worldBoundsDirty)
        {
            this.updateWorldBounds();
        }

        return this._worldBoundingBox;
    }

    public set worldBoundingBox(value: BoundingBox3)
    {
        this._worldBoundingBox = value;
    }

    public get worldBoundingSphere()
    {
        if(this.worldBoundsDirty)
        {
            this.updateWorldBounds();
        }

        return this._worldBoundingSphere;
    }

    public set worldBoundingSphere(value: BoundingSphere)
    {
        this._worldBoundingSphere = value;
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

            this.worldBoundsDirty = true;
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

        this.worldBoundsDirty = true;
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
    lookAt(target: Vector3, up = Vector3.UP, coordinateSpace = CoordinateSpace3.LOCAL_SPACE): void
    {
        if(coordinateSpace == CoordinateSpace3.LOCAL_SPACE)
        {
            this._rotation.lookAt(this.position, target, up);
            this.localMatrixDirty = true;
        }
        else
        {
            this.updateWorldMatrix();
            const worldPosition = this.localToWorldMatrix.getTranslation();
            this._rotation.lookAt(worldPosition, target, up);
            this.localMatrixDirty = true;
        }
    }

    public composeLocalMatrix(): void
    {
        this.localMatrixNegScale = this._scale.x < 0 || this._scale.y < 0 || this._scale.z < 0;
        this.localMatrixDirty = false;
        this.localMatrixUpdated = false;
        this.worldMatrixDirty = true;
        this.localBoundsDirty = true;
        this.localToParentMatrix.compose(this._position, this._rotation, this._scale);
    }

    public decomposeLocalMatrix(): void
    {
        this.localMatrixDirty = false;
        this.localMatrixUpdated = false;

        [this._position, this._rotation, this._scale] = this.localToParentMatrix.decompose(this.localMatrixNegScale);
    }

    updateLocalBounds(): void
    {
        this._localBoundingBox.copy(this.boundingBox);
        this._localBoundingBox.transform(this.localToParentMatrix);
        this._localBoundingSphere.copy(this.boundingSphere);
        this._localBoundingSphere.transform(this.localToParentMatrix);
        this.localBoundsDirty = false;
    }

    updateWorldBounds(): void
    {
        this._worldBoundingBox.copy(this.boundingBox);
        this._worldBoundingBox.transform(this.localToWorldMatrix);
        this._worldBoundingSphere.copy(this.boundingSphere);
        this._worldBoundingSphere.transform(this.localToWorldMatrix)
        this.worldBoundsDirty = false;
    }

    /**
     * Checks for intersection between this Node3 and another
     * 
     * @param other - The other Node3 object
     * @param mode - The IntersectionMode3 to use for the comparison (default: BOUNDING_SPHERE)
     * @param space - The CoordinateSpace3 to use for the comparison (default: LOCAL_SPACE)
     * @returns Whether or not the two objects intersect
     */
    intersects(other: Node3, mode = IntersectionMode3.BOUNDING_SPHERE, space = CoordinateSpace3.LOCAL_SPACE): boolean 
    {
        if(space == CoordinateSpace3.LOCAL_SPACE)
        {
            if(this.localMatrixDirty)
                this.composeLocalMatrix();

            if(other.localMatrixDirty)
                other.composeLocalMatrix();

            if(this.localBoundsDirty)
                this.updateLocalBounds();

            if(other.localBoundsDirty)
                other.updateLocalBounds();

            if(mode == IntersectionMode3.BOUNDING_SPHERE)
                return this._localBoundingSphere.intersects(other._localBoundingSphere);
            else if(mode == IntersectionMode3.AXIS_ALIGNED_BOUNDING_BOX)
                return this._localBoundingBox.intersects(other._localBoundingBox);
            else
                return false;
        }
        else
        {
            if(this.localMatrixDirty || this.worldMatrixDirty)
                this.updateWorldMatrix();

            if(this.localMatrixDirty || this.worldMatrixDirty)
                other.updateWorldMatrix();

            if(this.worldBoundsDirty)
                this.updateWorldBounds();

            if(other.worldBoundsDirty)
                other.updateWorldBounds();

            if(mode == IntersectionMode3.BOUNDING_SPHERE)
                return this._worldBoundingSphere.intersects(other._worldBoundingSphere);
            else if(mode == IntersectionMode3.AXIS_ALIGNED_BOUNDING_BOX)
                return this._worldBoundingBox.intersects(other._worldBoundingBox);
            else
                return false;
        }
    }
}