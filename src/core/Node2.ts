import { Matrix3 } from "../math/Matrix3";
import { Vector2 } from "../math/Vector2";
import { BoundingBox2 } from "../math/BoundingBox2";
import { BoundingCircle } from "../math/BoundingCircle";

export enum IntersectionMode2
{
    BOUNDING_CIRCLE,
    AXIS_ALIGNED_BOUNDING_BOX
}

/**
 * The Node2 class is used to represent an object in two-dimensional space. 
 * It stores information such as position, rotation, scale, visibility, and a reference to its parent object. 
 * It also contains a matrix to keep track of its transformation relative to its parent object.
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

    /**
     * Matrix3 representing the transformation matrix in local space
     */
    protected _localToParentMatrix: Matrix3;

    protected localMatrixDirty: boolean;
    protected localMatrixUpdated: boolean;

    /**
     * Matrix3 representing the transformation matrix in world space
     */
    public localToWorldMatrix: Matrix3;
    
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
     * Bounding box for this transform
     */
    public boundingBox: BoundingBox2;

    /**
     * Bounding circle object for this transform
     */
    public boundingCircle: BoundingCircle;

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

        this._localToParentMatrix = new Matrix3();
        this.localMatrixDirty = false;
        this.localMatrixUpdated = false;

        this.localToWorldMatrix = new Matrix3();

        // default layer
        this.layer = 0;

        this.visible = true;

        this.parent = null;

        this.boundingBox = new BoundingBox2();
        this.boundingCircle = new BoundingCircle();
    }

    public get position()
    {
        if(this.localMatrixUpdated)
        {
            // to be added
            // decompose matrix
            this.localMatrixUpdated = false;
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
            // to be added
            // decompose matrix
            this.localMatrixUpdated = false;
        }

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
            // to be added
            // decompose matrix
            this.localMatrixUpdated = false;
        }

        this.localMatrixDirty = true;
        return this._scale;
    }

    public set scale(value: Vector2)
    {
        this.localMatrixDirty = true;
        this._scale = value;
    }

    public get localToParentMatrix()
    {
        if(this.localMatrixDirty)
        {
            this._localToParentMatrix.compose(this._position, this._rotation, this._scale);
            this.localMatrixDirty = false;
        }

        this.localMatrixUpdated = true;
        return this._localToParentMatrix;
    }

    public set localToParentMatrix(matrix: Matrix3)
    {
        this.localMatrixDirty = false;
        this.localMatrixUpdated = true;
        this._localToParentMatrix = matrix;   
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
        const worldMatrixDirty = parentMatrixDirty || this.localMatrixDirty;

        if(this.localMatrixDirty) 
        {
            this._localToParentMatrix.compose(this._position, this._rotation, this._scale);
            this.localMatrixDirty = false;
        }

        if(worldMatrixDirty)
        {
            if(this.parent)
            {
                this.localToWorldMatrix.copy(this.parent.localToWorldMatrix);
                this.localToWorldMatrix.premultiply(this._localToParentMatrix);
            }
            else
            {
                this.localToWorldMatrix.copy(this._localToParentMatrix);
            }
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
            this._localToParentMatrix.compose(this._position, this._rotation, this._scale);
            this.localMatrixDirty = false;
        }

        if (this.parent) 
        {
            this.parent.updateWorldMatrix();
            this.localToWorldMatrix.copy(this.parent.localToWorldMatrix);
            this.localToWorldMatrix.premultiply(this._localToParentMatrix);
        }
        else 
        {
            this.localToWorldMatrix.copy(this._localToParentMatrix);
        }
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
    lookAt(target: Vector2, lookVector = Vector2.UP): void
    {
        // TO BE CHANGED
        // Construct matrix directly
        // Matrix decomposition is unnecessary

        this.updateWorldMatrix();
        
        const worldPosition = this.localToWorldMatrix.getTranslation();
        const worldRotation = this.localToWorldMatrix.getRotation();
        const targetVector = Vector2.subtract(target, worldPosition);

        if(targetVector.length() > 0)
        {
            const worldLookVector = Vector2.rotate(lookVector, worldRotation);
            this.rotation += worldLookVector.angleBetweenSigned(targetVector);
            this.localMatrixDirty = true;
        }
    }

    /**
     * Checks if this Node2 intersects another Node2, using either a BoundingCircle or AxisAlignedBoundingBox
     * 
     * @param other - The Node2 to check for intersection with 
     * @param mode - The mode to use for intersection (defaults to BOUNDING_CIRCLE)
     * @returns A boolean indicating whether the two objects intersect
     */
    intersects(other: Node2, mode = IntersectionMode2.BOUNDING_CIRCLE): boolean
    {
        // TO BE CHANGED
        // Use the transformation matrix instead of position and scale
        // Add a parameter to specify local or world coordinate frame

        if(mode == IntersectionMode2.BOUNDING_CIRCLE)
        {
            const thisCircle = new BoundingCircle();
            thisCircle.copy(this.boundingCircle);
            thisCircle.transform(this._position, this._scale);

            const otherCircle = new BoundingCircle();
            otherCircle.copy(other.boundingCircle);
            otherCircle.transform(other._position, other._scale);

            return thisCircle.intersects(otherCircle);
        }
        else if(mode == IntersectionMode2.AXIS_ALIGNED_BOUNDING_BOX)
        {
            const thisBox = new BoundingBox2();
            thisBox.copy(this.boundingBox);
            thisBox.transform(this._position, this._rotation, this._scale);

            const otherBox = new BoundingBox2();
            otherBox.copy(other.boundingBox);
            otherBox.transform(other._position, other._rotation, other._scale);

            return thisBox.intersects(otherBox);
        }
        else
        {
            return false;
        }
    }
}