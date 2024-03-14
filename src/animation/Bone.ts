import { Node3 } from "../core/Node3";
import { Vector3 } from "../math/Vector3";
import { Keyframe } from "./Keyframe";

export class Bone extends Node3
{
    public name: string;
    public direction: Vector3;
    public length: number;
    public dofs: boolean[];

    constructor()
    {
        super();

        this.name = '';
        this.direction = new Vector3();
        this.length = 0;
        this.dofs = [false, false, false];
    }

    public updatePose(pose: Keyframe): void
    {
        this.position.copy(this.direction);
        this.position.multiplyScalar(this.length);
        this.position.rotate(pose.getJointRotation(this.name));

        this.rotation.copy(pose.getJointRotation(this.name));

        this.children.forEach((child: Node3) => {
            if(child instanceof Bone)
                child.updatePose(pose);
        });
    }

}