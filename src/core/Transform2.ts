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
 * The Transform2 class is used to represent an object in two-dimensional space. 
 * It stores information such as position, rotation, scale, visibility, and a reference to its parent object. 
 * It also contains a matrix to keep track of its transformation relative to its parent object.
 */
export class Transform2
{
    /**
     * Array of children for this transform
     */
    public children: Array<Transform2>;

    /**
     * Parent transform for this transform
     */
    public parent: Transform2 | null;

    /**
     * Vector2 representing the position
     */
    public position: Vector2;

    /**
     * Rotation of the transform in radians
     */
    public rotation: number;

    /**
     * Vector2 representing the scale
     */
    public scale: Vector2;


    /**
     * Integer representing the layer of this transform
     */
    public layer: number;

    /**
     * Boolean indicating whether the matrix should be automatically updated
     */
    public autoUpdateMatrix: boolean;

    /**
     * Matrix3 representing the transformation matrix in local space
     */
    public matrix: Matrix3;

    /**
     * Matrix3 representing the transformation matrix in world space
     */
    public worldMatrix: Matrix3;
    
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
     * Constructor for Transform2 class
     * 
     */
    constructor()
    {
        this.children = [];

        this.position = new Vector2();
        this.rotation = 0;
        this.scale = new Vector2(1, 1);

        this.autoUpdateMatrix = true;
        this.matrix = new Matrix3();
        this.worldMatrix = new Matrix3();

        // default layer
        this.layer = 0;

        this.visible = true;

        this.parent = null;

        this.boundingBox = new BoundingBox2();
        this.boundingCircle = new BoundingCircle();
    }

    /**
     * Recursively draws the Transform2 object and its children
     */
    draw(): void
    {
        if(!this.visible)
            return;

        this.children.forEach((elem: Transform2) => {
            elem.draw();
        });
    }

    /**
     * Traverses the scene graph starting from the current Transform2 object
     */
    traverseSceneGraph(): void
    {
        if(this.autoUpdateMatrix)
        {
            this.matrix.compose(this.position, this.rotation, this.scale);
        }

        if(this.parent)
        {
            this.worldMatrix.copy(this.parent.worldMatrix);
            this.worldMatrix.multiply(this.matrix);
        }
        else
        {
            this.worldMatrix.copy(this.matrix);
        }

        this.children.forEach((elem: Transform2) => {
            elem.traverseSceneGraph();
        });
    }

    /**
     * Updates the world matrix of the current Transform2 object and its parent
     */
    updateWorldMatrix(): void
    {
        if(this.autoUpdateMatrix)
        {
            this.matrix.compose(this.position, this.rotation, this.scale);
        }
        
        if(this.parent)
        {
            this.parent.updateWorldMatrix();
            this.worldMatrix.copy(this.parent.worldMatrix);
            this.worldMatrix.multiply(this.matrix);
        }
        else
        {
            this.worldMatrix.copy(this.matrix);
        }
    }

    /**
     * Adds a child Transform2 to the current Transform2
     * 
     * @param child - The child Transform2 to add
     */
    add(child: Transform2) 
    {
        this.children.push(child);
        child.parent = this;
    }

    /**
     * Removes the current Transform2 from its parent
     * 
     * @returns True if the Transform2 was successfully removed, false otherwise
     */
    remove(): boolean
    {
        if(this.parent == null)
            return false;
        else
            return this.parent.removeChild(this) != null;
    }

    /**
     * Removes the specified child Transform2 from the current Transform2
     * 
     * @param child - The child Transform2 to remove
     * @returns The removed Transform2, or null if it was not found
     */
    removeChild(child: Transform2): Transform2 | null
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
     * Translates the current Transform2 by the specified Vector2
     * 
     * @param translation - The Vector2 to translate the Transform2
     */
    translate(translation: Vector2): void
    {
        const localVector = Vector2.rotate(translation, this.rotation);
        this.position.add(localVector);
    }

    /**
     * Translates the position of a Transform2 along the X-axis
     * 
     * @param distance - The distance to translate the Transform2 by
     */
    translateX(distance: number): void
    {
        const localVector = Vector2.rotate(new Vector2(distance, 0), this.rotation);
        this.position.add(localVector);
    }

    /**
     * Translates the position of a Transform2 along the Y-axis
     * 
     * @param distance - The distance to translate the Transform2 by
     */
    translateY(distance: number): void
    {
        const localVector = Vector2.rotate(new Vector2(0, distance), this.rotation);
        this.position.add(localVector);
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
        
        const [worldPosition, worldRotation, worldScale] = this.worldMatrix.decompose();
        const targetVector = Vector2.subtract(target, worldPosition);

        if(targetVector.length() > 0)
        {
            const worldLookVector = Vector2.rotate(lookVector, worldRotation);
            this.rotation += worldLookVector.angleBetweenSigned(targetVector);
        }
    }

    /**
     * Checks if this Transform2 intersects another Transform2, using either a BoundingCircle or AxisAlignedBoundingBox
     * 
     * @param other - The Transform2 to check for intersection with 
     * @param mode - The mode to use for intersection (defaults to BOUNDING_CIRCLE)
     * @returns A boolean indicating whether the two objects intersect
     */
    intersects(other: Transform2, mode = IntersectionMode2.BOUNDING_CIRCLE): boolean
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