import { Matrix3 } from "../math/Matrix3";
import { Vector2 } from "../math/Vector2";
import { BoundingBox2 } from "../math/BoundingBox2";
import { BoundingCircle } from "../math/BoundingCircle";

export enum IntersectionMode2
{
    BOUNDING_CIRCLE,
    AXIS_ALIGNED_BOUNDING_BOX
}

export enum CoordinateSpace2
{
    LOCAL_SPACE,
    WORLD_SPACE
}

/**
 * This is the base class for all objects that can be added to a GopherGfx 2D scene.  It is named "Node"
 * because the scene is stored in a graph data structure, so we think of every element in that graph
 * as a "node" in the graph.  There is also a "Node3" base class for all objects that can be added to
 * the 3D scene.  
 * 
 * Every object that can be added to a 2D scene (e.g., Mesh2s, Line2s) will inherit from this base object.
 * So, every object in the scene will have a position, rotation, scale, boundingBox, boundingSphere, 
 * visibility, and all of the other properties listed in this class.
 * 
 * For more detail on how the scene graph works, see the documentation for the Scene class.
 * 
 */
export class Node2
{
     /**
     * Vector2 representing the position
     */
     protected _position: Vector2;

     /**
      * Rotation of the transform in radians
      */
     protected _rotation: number;
 
     /**
      * Vector2 representing the scale
      */
     protected _scale: Vector2;

     protected _shear: Vector2 | null;

    /**
     * Matrix3 representing the transformation matrix in local space
     */
    protected localToParentMatrix: Matrix3;

    /**
     * Matrix3 representing the transformation matrix in world space
     */
    public localToWorldMatrix: Matrix3;

    protected localMatrixDirty: boolean;
    protected localMatrixUpdated: boolean;
    protected worldMatrixDirty: boolean;
    
    /**
     * Array of children for this transform
     */
    public children: Array<Node2>;

    /**
     * Parent transform for this transform
     */
    public parent: Node2 | null;

    /**
     * Integer representing the layer of this transform
     */
    public layer: number;

    /**
     * Boolean indicating whether this transform should be rendered
     */
    public visible: boolean;

    /**
     * Bounding box in vertex coordinate space
     */
    public boundingBox: BoundingBox2;

    /**
     * Bounding circle in vertex coordinate space
     */
    public boundingCircle: BoundingCircle;

    /**
     * Bounding box in this transform's local coordinate space
     */
    public _localBoundingBox: BoundingBox2;

    /**
     * Bounding circle in this transform's local coordinate space
     */
    public _localBoundingCircle: BoundingCircle;

    /**
     * Bounding box in the world coordinate space
     */
    public _worldBoundingBox: BoundingBox2;

    /**
     * Bounding box in the world coordinate space
     */
    public _worldBoundingCircle: BoundingCircle;

    public localBoundsDirty: boolean;
    public worldBoundsDirty: boolean;

    /**
     * Constructor for Node2 class
     * 
     */
    constructor()
    {
        this.children = [];

        this._position = new Vector2();
        this._rotation = 0;
        this._scale = new Vector2(1, 1);
        this._shear = null;

        this.localToParentMatrix = new Matrix3();
        this.localToWorldMatrix = new Matrix3();

        this.localMatrixDirty = false;
        this.localMatrixUpdated = false;
        this.worldMatrixDirty = false;

        // default layer
        this.layer = 0;

        this.visible = true;

        this.parent = null;

        this.boundingBox = new BoundingBox2();
        this.boundingCircle = new BoundingCircle();
        this._localBoundingBox = new BoundingBox2();
        this._localBoundingCircle = new BoundingCircle();
        this._worldBoundingBox = new BoundingBox2();
        this._worldBoundingCircle = new BoundingCircle();

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

    public set position(value: Vector2)
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

    public set rotation(value: number)
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

    public set scale(value: Vector2)
    {
        this.localMatrixDirty = true;
        this._scale = value;
    }

    public get shear()
    {
        if(this.localMatrixUpdated)
        {
            this.decomposeLocalMatrix();
        }

        if(!this._shear)
        {
            this._shear = new Vector2();
        }

        this.localMatrixDirty = true;
        return this._shear;
    }

    public set shear(value: Vector2)
    {
        if(!this._shear)
        {
            this._shear = new Vector2();
        }

        this.localMatrixDirty = true;
        this._shear = value;
    }

    public getLocalToParentMatrix(): Matrix3
    {
        if(this.localMatrixDirty)
        {
            this.composeLocalMatrix();
        }
        
        return this.localToParentMatrix.clone();
    }

    public setLocalToParentMatrix(matrix: Matrix3): void
    {
        this.localToParentMatrix.copy(matrix);  
        this.localMatrixUpdated = true;
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

    public set localBoundingBox(value: BoundingBox2)
    {
        this._localBoundingBox = value;
    }

    public get localBoundingCircle()
    {
        if(this.localBoundsDirty)
        {
            this.updateLocalBounds();
        }

        return this._localBoundingCircle;
    }

    public set localBoundingSphere(value: BoundingCircle)
    {
        this._localBoundingCircle = value;
    }

    public get worldBoundingBox()
    {
        if(this.worldBoundsDirty)
        {
            this.updateWorldBounds();
        }

        return this._worldBoundingBox;
    }

    public set worldBoundingBox(value: BoundingBox2)
    {
        this._worldBoundingBox = value;
    }

    public get worldBoundingCircle()
    {
        if(this.worldBoundsDirty)
        {
            this.updateWorldBounds();
        }

        return this._worldBoundingCircle;
    }

    public set worldBoundingSphere(value: BoundingCircle)
    {
        this._worldBoundingCircle = value;
    }

    /**
     * Recursively draws the Node2 object and its children
     */
    draw(): void
    {
        if(!this.visible)
            return;

        this.children.forEach((elem: Node2) => {
            elem.draw();
        });
    }

    /**
     * Traverses the scene graph starting from the current Node2 object
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

        this.children.forEach((elem: Node2) => {
            elem.traverseSceneGraph(worldMatrixDirty);
        });
    }

    /**
     * Updates the world matrix of the current Node2 object and its parent
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
     * Adds a child Node2 to the current Node2
     * 
     * @param child - The child Node2 to add
     */
    add(child: Node2) 
    {
        this.children.push(child);
        child.parent = this;
    }

    /**
     * Removes the current Node2 from its parent
     * 
     * @returns True if the Node2 was successfully removed, false otherwise
     */
    remove(): boolean
    {
        if(this.parent == null)
            return false;
        else
            return this.parent.removeChild(this) != null;
    }

    /**
     * Removes the specified child Node2 from the current Node2
     * 
     * @param child - The child Node2 to remove
     * @returns The removed Node2, or null if it was not found
     */
    removeChild(child: Node2): Node2 | null
    {
        const index = this.children.indexOf(child);

        if(index == -1)
        {
            return null;
        }
        else
        {
            const removedElement = this.children.splice(index, 1);
            removedElement[0].parent = null;
            return removedElement[0];
        }
    }

    /**
     * Looks at a target vector with the given look vector
     * 
     * @param target - The vector to look at
     * @param lookVector - The vector used to determine the look direction (defaults to Vector2.UP)
     */
    lookAt(target: Vector2, lookVector = Vector2.UP, coordinateSpace = CoordinateSpace2.LOCAL_SPACE): void
    {
        if(coordinateSpace == CoordinateSpace2.LOCAL_SPACE)
        {
            const targetVector = Vector2.subtract(target, this.position);

            if(targetVector.length() > 0)
            {
                this._rotation = lookVector.angleBetweenSigned(targetVector);
                this.localMatrixDirty = true;
            }
        }
        else
        {
            this.updateWorldMatrix();

            const worldPosition = this.localToWorldMatrix.getTranslation();
            const targetVector = Vector2.subtract(target, worldPosition);

            if(targetVector.length() > 0)
            {
                const worldLookVector = this.localToWorldMatrix.transformVector(lookVector);
                this._rotation += worldLookVector.angleBetweenSigned(targetVector);
                this.localMatrixDirty = true;
            }
        }
    }

    public composeLocalMatrix(): void
    {
        this.localMatrixDirty = false;
        this.localMatrixUpdated = false;
        this.worldMatrixDirty = true;
        this.localBoundsDirty = true;
        this.localToParentMatrix.compose(this._position, this._rotation, this._scale, this._shear);
    }

    public decomposeLocalMatrix(): void
    {
        this.localMatrixDirty = false;
        this.localMatrixUpdated = false;
        
        [this._position, this._rotation, this._scale, this._shear] = this.localToParentMatrix.decompose();
    }

    updateLocalBounds(): void
    {
        this._localBoundingBox.copy(this.boundingBox);
        this._localBoundingBox.transform(this.localToParentMatrix);
        this._localBoundingCircle.copy(this.boundingCircle);
        this._localBoundingCircle.transform(this.localToParentMatrix);
        this.localBoundsDirty = false;
    }

    updateWorldBounds(): void
    {
        this._worldBoundingBox.copy(this.boundingBox);
        this._worldBoundingBox.transform(this.localToWorldMatrix);
        this._worldBoundingCircle.copy(this.boundingCircle);
        this._worldBoundingCircle.transform(this.localToWorldMatrix)
        this.worldBoundsDirty = false;
    }

    /**
     * Checks if this Node2 intersects another Node2, using either a BoundingCircle or AxisAlignedBoundingBox
     * 
     * @param other - The Node2 to check for intersection with 
     * @param mode - The IntersectionMode2 to use for the comparison (default: BOUNDING_CIRCLE)
     * @param space - The CoordinateSpace2 to use for the comparison (default: LOCAL_SPACE)
     * @returns A boolean indicating whether the two objects intersect
     */
    intersects(other: Node2, mode = IntersectionMode2.BOUNDING_CIRCLE, space = CoordinateSpace2.LOCAL_SPACE): boolean
    {
        if(space == CoordinateSpace2.LOCAL_SPACE)
        {
            if(this.localMatrixDirty)
                this.composeLocalMatrix();

            if(other.localMatrixDirty)
                other.composeLocalMatrix();

            if(this.localBoundsDirty)
                this.updateLocalBounds();

            if(other.localBoundsDirty)
                other.updateLocalBounds();
   
            if(mode == IntersectionMode2.BOUNDING_CIRCLE)
                return this._localBoundingCircle.intersects(other._localBoundingCircle);
            else if(mode == IntersectionMode2.AXIS_ALIGNED_BOUNDING_BOX)
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

            if(mode == IntersectionMode2.BOUNDING_CIRCLE)
                return this._worldBoundingCircle.intersects(other._worldBoundingCircle);
            else if(mode == IntersectionMode2.AXIS_ALIGNED_BOUNDING_BOX)
                return this._worldBoundingBox.intersects(other._worldBoundingBox);
            else
                return false;
        }
    }
}