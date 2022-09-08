import { Matrix3 } from "../math/Matrix3";
import { Vector2 } from "../math/Vector2";

export class Transform2
{
    public children: Array<Transform2>;
    public parent: Transform2 | null;

    public position: Vector2;
    public rotation: number;
    public scale: Vector2;
    public matrix: Matrix3;
    public layer: number;

    public worldPosition: Vector2;
    public worldRotation: number;
    public worldScale: Vector2;
    public worldMatrix: Matrix3;
    
    public visible: boolean;

    constructor()
    {
        this.children = [];

        this.position = new Vector2();
        this.rotation = 0;
        this.scale = new Vector2(1, 1);
        this.matrix = new Matrix3();

        this.worldPosition = new Vector2();
        this.worldRotation = 0;
        this.worldScale = new Vector2(1, 1);
        this.worldMatrix = new Matrix3();

        // default layer
        this.layer = 0;

        this.visible = true;

        this.parent = null;
    }

    draw(parent: Transform2): void
    {
        if(!this.visible)
            return;

        this.children.forEach((elem: Transform2) => {
            elem.draw(this);
        });
    }

    computeWorldTransform(): void
    {
        
        this.matrix.makeTransform(this.position, this.rotation, this.scale);

        if(this.parent)
        {
            this.worldMatrix.copy(this.parent.worldMatrix);
            this.worldMatrix.multiply(this.matrix);
        }
        else
        {
            this.worldMatrix.copy(this.matrix);
        }

        [this.worldPosition, this.worldRotation, this.worldScale] = this.worldMatrix.decompose();

        this.children.forEach((elem: Transform2) => {
            elem.computeWorldTransform();
        });
    }

    add(child: Transform2) 
    {
        this.children.push(child);
        child.parent = this;
    }

    remove(child: Transform2): Transform2 | null
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

    // translate(translation: Vector2): void
    // {
    //     this.position.add(this.rotation.rotate(translation));
    // }

    // translateX(distance: number): void
    // {
    //     this.position.add(this.rotation.rotate(new Vector2(distance, 0));
    // }

    // translateY(distance: number): void
    // {
    //     this.position.add(this.rotation.rotate(new Vector3(0, distance, 0)));
    // }

    // in local space
    lookAt(target: Vector2, lookVector = Vector2.UP): void
    {
        const targetVector = Vector2.subtract(target, this.position);
        if(targetVector.length() > 0)
        {
            this.rotation = lookVector.angleBetweenSigned(targetVector);
        }
    }
}