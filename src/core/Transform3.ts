import { Matrix4 } from "../math/Matrix4";
import { Quaternion } from "../math/Quaternion";
import { Vector3 } from "../math/Vector3";
import { Camera } from "./Camera";
import { LightManager } from "../lights/LightManager";

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
        this.position.add(this.rotation.rotate(translation));
    }

    translateX(distance: number): void
    {
        this.position.add(this.rotation.rotate(new Vector3(distance, 0, 0)));
    }

    translateY(distance: number): void
    {
        this.position.add(this.rotation.rotate(new Vector3(0, distance, 0)));
    }

    translateZ(distance: number): void
    {
        this.position.add(this.rotation.rotate(new Vector3(0, 0, distance)));
    }

    // in local space
    lookAt(target: Vector3, up = Vector3.UP): void
    {
        const rotationMatrix = Matrix4.lookAt(this.position, target, up);
        this.rotation.setMatrix(rotationMatrix);
    }
}