import { Vector3 } from "../math/Vector3";
import { Quaternion } from "../math/Quaternion";
import { MathUtils } from "../math/MathUtils";

export class Keyframe
{
    public frame: number;
    public rootPosition: Vector3;
    public rootRotation: Quaternion;

    private jointRotations: Map<string, Quaternion>;

    constructor()
    {
        this.frame = 0;
        this.rootPosition = new Vector3();
        this.rootRotation = new Quaternion();

        this.jointRotations = new Map();
    }

    public getJointRotation(boneName: string): Quaternion
    {
        const jointRotation = this.jointRotations.get(boneName);

        if(jointRotation)
            return jointRotation;
        else
            return new Quaternion();
    }

    public setJointRotation(boneName: string, rotation: Quaternion): void
    {
        this.jointRotations.set(boneName, rotation);
    }

    public lerp(other: Keyframe, alpha: number): void
    {
        this.frame = Math.round(MathUtils.lerp(this.frame, other.frame, alpha));
        this.rootPosition.lerp(this.rootPosition, other.rootPosition, alpha);
        this.rootRotation.slerp(this.rootRotation, other.rootRotation, alpha);

        this.jointRotations.forEach((value: Quaternion, key: string) => {
            value.slerp(value, other.getJointRotation(key), alpha);
        });
    }

    public clone(): Keyframe
    {
        const pose = new Keyframe();
        pose.frame = this.frame;
        pose.rootRotation.copy(this.rootRotation);
        pose.rootPosition.copy(this.rootPosition);
        
        this.jointRotations.forEach((value: Quaternion, key: string) => {
            pose.setJointRotation(key, value.clone());
        });

        return pose;
    }
}