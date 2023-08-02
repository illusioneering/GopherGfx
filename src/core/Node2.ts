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
     protected position: Vector2;

     /**
      * Rotation of the transform in radians
      */
     protected rotation: number;
 
     /**
      * Vector2 representing the scale
      */
     protected scale: Vector2;

    /**
     * Matrix3 representing the transformation matrix in local space
     */
    protected localMatrix: Matrix3;

    /**
     * Matrix3 representing the transformation matrix in world space
     */
    protected worldMatrix: Matrix3;
    

    protected localMatrixDirty: boolean;

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

        this.position = new Vector2();
        this.rotation = 0;
        this.scale = new Vector2(1, 1);

        this.localMatrix = new Matrix3();
        this.worldMatrix = new Matrix3();
        this.localMatrixDirty = false;

        // default layer
        this.layer = 0;

        this.visible = true;

        this.parent = null;

        this.boundingBox = new BoundingBox2();
        this.boundingCircle = new BoundingCircle();
    }

    getPosition(): Vector2
    {
        return this.position.clone();
    }

    getRotation(): number
    {
        return this.rotation;
    }

    getScale(): Vector2
    {
        return this.scale.clone();
    }

    setPosition(position: Vector2): void
    {
        this.position.copy(position);
        this.localMatrixDirty = true;
    }

    setPositionXY(x: number, y: number): void
    {
        this.position.set(x, y);
        this.localMatrixDirty = true;
    }

    setRotation(rotation: number): void
    {
        this.rotation = rotation;
        this.localMatrixDirty = true;
    }

    setScale(scale: Vector2): void
    {
        this.scale.copy(scale);
        this.localMatrixDirty = true;
    }

    setScaleXY(x: number, y: number): void
    {
        this.scale.set(x, y);
        this.localMatrixDirty = true;
    }

    getLocalMatrix(): Matrix3
    {
        if(this.localMatrixDirty)
        {
            this.localMatrix.compose(this.position, this.rotation, this.scale);
            this.localMatrixDirty = false;
        }

        return this.localMatrix.clone();
    }

    setLocalMatrix(localMatrix: Matrix3): void
    {
        this.localMatrix.copy(localMatrix);
        this.localMatrixDirty = false;
        
        this.position = this.localMatrix.getTranslation();
        this.rotation = this.localMatrix.getRotation();
        this.scale = this.localMatrix.getScale();
    }

    getWorldMatrix(): Matrix3
    {
        return this.worldMatrix.clone();
    }

    setWorldMatrix(worldMatrix: Matrix3): void
    {
        this.worldMatrix.copy(worldMatrix);
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
            this.localMatrix.compose(this.position, this.rotation, this.scale);
            this.localMatrixDirty = false;
        }

        if(worldMatrixDirty)
        {
            if(this.parent)
            {
                this.worldMatrix.copy(this.parent.worldMatrix);
                this.worldMatrix.multiply(this.localMatrix);
            }
            else
            {
                this.worldMatrix.copy(this.localMatrix);
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
            this.localMatrix.compose(this.position, this.rotation, this.scale);
            this.localMatrixDirty = false;
        }

        if (this.parent) 
        {
            this.parent.updateWorldMatrix();
            this.worldMatrix.copy(this.parent.worldMatrix);
            this.worldMatrix.multiply(this.localMatrix);
        }
        else 
        {
            this.worldMatrix.copy(this.localMatrix);
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
     * Translates the current Node2 by the specified Vector2
     * 
     * @param translation - The Vector2 to translate the Node2
     */
    translate(translation: Vector2): void
    {
        const localVector = Vector2.rotate(translation, this.rotation);
        this.position.add(localVector);
        this.localMatrixDirty = true;
    }

    /**
     * Translates the position of a Node2 along the X-axis
     * 
     * @param distance - The distance to translate the Node2 by
     */
    translateX(distance: number): void
    {
        const localVector = Vector2.rotate(new Vector2(distance, 0), this.rotation);
        this.position.add(localVector);
        this.localMatrixDirty = true;
    }

    /**
     * Translates the position of a Node2 along the Y-axis
     * 
     * @param distance - The distance to translate the Node2 by
     */
    translateY(distance: number): void
    {
        const localVector = Vector2.rotate(new Vector2(0, distance), this.rotation);
        this.position.add(localVector);
        this.localMatrixDirty = true;
    }

    /**
     * Looks at a target vector with the given look vector
     * 
     * @param target - The vector to look at
     * @param lookVector - The vector used to determine the look direction (defaults to Vector2.UP)
     */
    lookAt(target: Vector2, lookVector = Vector2.UP): void
    {
        this.updateWorldMatrix();
        
        const worldPosition = this.worldMatrix.getTranslation();
        const worldRotation = this.worldMatrix.getRotation();
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
        if(mode == IntersectionMode2.BOUNDING_CIRCLE)
        {
            const thisCircle = new BoundingCircle();
            thisCircle.copy(this.boundingCircle);
            thisCircle.transform(this.position, this.scale);

            const otherCircle = new BoundingCircle();
            otherCircle.copy(other.boundingCircle);
            otherCircle.transform(other.position, other.scale);

            return thisCircle.intersects(otherCircle);
        }
        else if(mode == IntersectionMode2.AXIS_ALIGNED_BOUNDING_BOX)
        {
            const thisBox = new BoundingBox2();
            thisBox.copy(this.boundingBox);
            thisBox.transform(this.position, this.rotation, this.scale);

            const otherBox = new BoundingBox2();
            otherBox.copy(other.boundingBox);
            otherBox.transform(other.position, other.rotation, other.scale);

            return thisBox.intersects(otherBox);
        }
        else
        {
            return false;
        }
    }
}