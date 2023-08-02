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

export class Node3 {
    /*
    An array of child transforms that are attached to this transform.
    */
    public children: Array<Node3>;

    /**
    The position of this transform in 3D space.
    */
    public position: Vector3;
    /**
    The rotation of this transform represented as a quaternion.
    */
    public rotation: Quaternion;
    /**
    The scale of this transform.
    */
    public scale: Vector3;
    /**
    Whether this transform is currently visible in the scene.
    */
    public visible: boolean;

    /**
    Whether this transform should automatically update its matrix when its properties are changed.
    */
    public autoUpdateMatrix: boolean;
    /**
     The local transformation matrix of this transform.
     */
    public matrix: Matrix4;
    /**
    The world transformation matrix of this transform.
    */
    public worldMatrix: Matrix4;
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
    constructor() {
        this.children = [];
        this.position = new Vector3();
        this.rotation = new Quaternion();
        this.scale = new Vector3(1, 1, 1);
        this.visible = true;

        this.autoUpdateMatrix = true;
        this.matrix = new Matrix4();
        this.worldMatrix = new Matrix4();

        this.parent = null;

        this.boundingBox = new BoundingBox3();
        this.boundingSphere = new BoundingSphere();

        this.drawBoundingVolume = false;
        this.boundingVolumeMaterial = null;
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
     * Traverses the scene graph starting from this Node3 object and updates the world matrices of all
     * Node3 objects in the graph.
     */
    traverseSceneGraph(): void {
        if (this.autoUpdateMatrix) {
            this.matrix.compose(this.position, this.rotation, this.scale);
        }

        if (this.parent) {
            this.worldMatrix.copy(this.parent.worldMatrix);
            this.worldMatrix.multiply(this.matrix);
        }
        else {
            this.worldMatrix.copy(this.matrix);
        }

        this.children.forEach((elem: Node3) => {
            elem.traverseSceneGraph();
        });
    }

    /**
    Updates the world matrix of this Node3 by computing the multiplication
    of its local matrix with its parent's world matrix (if it has a parent).
    If autoUpdateMatrix is true, the local matrix is composed from the position,
    rotation and scale attributes.
    @returns void
    */
    // backwards traversal
    updateWorldMatrix(): void {
        if (this.autoUpdateMatrix) {
            this.matrix.compose(this.position, this.rotation, this.scale);
        }

        if (this.parent) {
            this.parent.updateWorldMatrix();
            this.worldMatrix.copy(this.parent.worldMatrix);
            this.worldMatrix.multiply(this.matrix);
        }
        else {
            this.worldMatrix.copy(this.matrix);
        }
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
     * Sets lights on the children of the Node3
     * @param lightManager - The LightManager object
     */
    setLights(lightManager: LightManager): void {
        this.children.forEach((elem) => {
            elem.setLights(lightManager);
        });
    }

    /**
    * Translates the transform by a given Vector3
    * 
     * @param translation - The Vector3 to translate by
     */
    translate(translation: Vector3): void {
        this.position.add(Vector3.rotate(translation, this.rotation));
    }

    /**
     * Translates the transform along the x axis
    * 
    * @param distance - The distance to translate by
    */
    translateX(distance: number): void {
        this.position.add(Vector3.rotate(new Vector3(distance, 0, 0), this.rotation));
    }

    /**
    * Translates the transform along the y axis
    * 
    * @param distance - The distance to translate by
    */
    translateY(distance: number): void {
        this.position.add(Vector3.rotate(new Vector3(0, distance, 0), this.rotation));
    }

    /**
     * Translates the transform along the z axis
     * 
     * @param distance - The distance to translate by
     */
    translateZ(distance: number): void {
        this.position.add(Vector3.rotate(new Vector3(0, 0, distance), this.rotation));
    }

    /**
    * Rotates this Node3 object by the given rotation vector
    * 
    * @param rotation - The Vector3 representing the rotation
    */
    rotate(rotation: Vector3): void {
        this.rotation.multiply(Quaternion.makeEulerAngles(rotation.x, rotation.y, rotation.z));
    }

    /**
    * Rotates this Node3 object around the X-axis by the given angle
    * 
    * @param angle - The angle to rotate by (in radians)
    */
    rotateX(angle: number): void {
        this.rotation.multiply(Quaternion.makeRotationX(angle));
    }


    /**
     * Rotates this Node3 object around the Y-axis by the given angle
     * 
     * @param angle - The angle to rotate by (in radians)
     */
    rotateY(angle: number): void {
        this.rotation.multiply(Quaternion.makeRotationY(angle));
    }

    /**
     * Rotates this Node3 object around the Z-axis by the given angle
     * 
    * @param angle - The angle to rotate by (in radians)
    */
    rotateZ(angle: number): void {
        this.rotation.multiply(Quaternion.makeRotationZ(angle));
    }

    /**
    * Rotates this Node3 object to look at the given target with the given up vector
    * 
    * @param target - The Vector3 representing the target
    * @param up - The Vector3 representing the up direction (defaults to Vector3.UP)
    */
    lookAt(target: Vector3, up = Vector3.UP): void {
        this.updateWorldMatrix();
        const [worldPosition, worldRotation, worldScale] = this.worldMatrix.decompose();
        this.rotation.lookAt(worldPosition, target, up);
    }

    /**
     * Checks for intersection between this Node3 and another
     * 
     * @param other - The other Node3 object
     * @param mode - The IntersectionMode3 to use for the comparison (default: BOUNDING_SPHERE)
     * @returns Whether or not the two objects intersect
     */
    intersects(other: Node3, mode = IntersectionMode3.BOUNDING_SPHERE): boolean {
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
}