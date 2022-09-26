import { Matrix4 } from "../math/Matrix4";
import { Quaternion } from "../math/Quaternion";
import { Vector3 } from "../math/Vector3";
import { Camera } from "./Camera";
import { LightManager } from "../lights/LightManager";
import { BoundingBox3 } from "../math/BoundingBox3";
import { BoundingSphere } from "../math/BoundingSphere"

export enum IntersectionMode3
{
    BOUNDING_SPHERE,
    AXIS_ALIGNED_BOUNDING_BOX
}

export class Transform3
{
    public children: Array<Transform3>;

    public position: Vector3;
    public rotation: Quaternion;
    public scale: Vector3;
    public visible: boolean;

    public autoUpdateMatrix: boolean;
    public matrix: Matrix4;
    public worldMatrix: Matrix4;

    public worldPosition: Vector3;
    public worldRotation: Quaternion;
    public worldScale: Vector3;

    public parent: Transform3 | null;

    public boundingBox: BoundingBox3;
    public boundingSphere: BoundingSphere;

    constructor()
    {
        this.children = [];
        this.position = new Vector3();
        this.rotation = new Quaternion();
        this.scale = new Vector3(1, 1, 1);
        this.visible = true;

        this.autoUpdateMatrix = true;
        this.matrix = new Matrix4();
        this.worldMatrix = new Matrix4();

        this.worldPosition = new Vector3();
        this.worldRotation = new Quaternion();
        this.worldScale = new Vector3();

        this.parent = null;

        this.boundingBox = new BoundingBox3();
        this.boundingSphere = new BoundingSphere();
    }

    draw(parent: Transform3, camera: Camera, lightManager: LightManager): void
    {
        if(!this.visible)
            return;

        this.children.forEach((elem: Transform3) => {
            elem.draw(this, camera, lightManager);
        });
    }

    computeWorldTransform(): void
    {
        if(this.autoUpdateMatrix)
        {
            this.matrix.makeTransform(this.position, this.rotation, this.scale);
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

        this.worldMatrix.decompose(this.worldPosition, this.worldRotation, this.worldScale);

        this.children.forEach((elem: Transform3) => {
            elem.computeWorldTransform();
        });
    }

    add(child: Transform3) 
    {
        this.children.push(child);
        child.parent = this;
    }

    remove(): boolean
    {
        if(this.parent == null)
            return false;
        else
            return this.parent.removeChild(this) != null;
    }

    removeChild(child: Transform3): Transform3 | null
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

    setLights(lightManager: LightManager): void
    {
        this.children.forEach((elem) => {
            elem.setLights(lightManager);
        });
    }

    translate(translation: Vector3): void
    {
        this.position.add(this.rotation.rotateVector(translation));
    }

    translateX(distance: number): void
    {
        this.position.add(this.rotation.rotateVector(new Vector3(distance, 0, 0)));
    }

    translateY(distance: number): void
    {
        this.position.add(this.rotation.rotateVector(new Vector3(0, distance, 0)));
    }

    translateZ(distance: number): void
    {
        this.position.add(this.rotation.rotateVector(new Vector3(0, 0, distance)));
    }

    rotate(rotation: Vector3): void
    {
        this.rotation.multiply(Quaternion.makeEulerAngles(rotation.x, rotation.y, rotation.z));
    }

    rotateX(angle: number): void
    {
        this.rotation.multiply(Quaternion.makeRotationX(angle));
    }

    rotateY(angle: number): void
    {
        this.rotation.multiply(Quaternion.makeRotationY(angle));
    }

    rotateZ(angle: number): void
    {
        this.rotation.multiply(Quaternion.makeRotationZ(angle));
    }

    // in local space
    lookAt(target: Vector3, up = Vector3.UP): void
    {
        const rotationMatrix = Matrix4.lookAt(this.position, target, up);
        this.rotation.setMatrix(rotationMatrix);
    }

    intersects(other: Transform3, mode = IntersectionMode3.BOUNDING_SPHERE): boolean
    {
        if(mode == IntersectionMode3.BOUNDING_SPHERE)
        {
            const thisSphere = new BoundingSphere();
            thisSphere.copy(this.boundingSphere);
            thisSphere.transform(this.position, this.scale);

            const otherSphere = new BoundingSphere();
            otherSphere.copy(other.boundingSphere);
            otherSphere.transform(other.position, other.scale);

            return thisSphere.intersects(otherSphere);
        }
        else if(mode == IntersectionMode3.AXIS_ALIGNED_BOUNDING_BOX)
        {
            const thisBox = new BoundingBox3();
            thisBox.copy(this.boundingBox);
            thisBox.transform(this.position, this.rotation, this.scale);

            const otherBox = new BoundingBox3();
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