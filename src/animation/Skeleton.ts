import { Node3 } from "../core/Node3";
import { Vector3 } from "../math/Vector3";
import { Quaternion } from "../math/Quaternion";
import { Bone } from "./Bone";

export class Skeleton extends Node3
{
    public bones: Map<string, Bone>;
    public boneToRotationSpaceMap: Map<string, Quaternion>;
    public rotationToBoneSpaceMap: Map<string, Quaternion>;

    public rootPosition: Vector3;
    public rootRotation: Quaternion;

    constructor()
    {
        super();

        this.bones = new Map();
        this.boneToRotationSpaceMap = new Map();
        this.rotationToBoneSpaceMap = new Map();

        this.rootPosition = new Vector3();
        this.rootRotation = new Quaternion();
    }
}