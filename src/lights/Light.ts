import { Vector3 } from "../math/Vector3";
import { Color } from "../math/Color";
import { LightManager } from "./LightManager";
import { Node3 } from "../core/Node3";

export enum LightType
{
    POINT = 0,
    DIRECTIONAL
}

export abstract class Light extends Node3
{
    public ambientIntensity: Vector3;
    public diffuseIntensity: Vector3;
    public specularIntensity: Vector3;

    protected readonly type: LightType;

    constructor(type: LightType, ambientIntensity: Vector3 | Color, diffuseIntensity: Vector3 | Color, specularIntensity: Vector3 | Color)
    {
        super();

        this.type = type;

        if(ambientIntensity instanceof Vector3)
            this.ambientIntensity = new Vector3(ambientIntensity.x, ambientIntensity.y, ambientIntensity.z);
        else
            this.ambientIntensity = new Vector3(ambientIntensity.r, ambientIntensity.g, ambientIntensity.b);

        if(diffuseIntensity instanceof Vector3)
            this.diffuseIntensity = new Vector3(diffuseIntensity.x, diffuseIntensity.y, diffuseIntensity.z);
        else
            this.diffuseIntensity = new Vector3(diffuseIntensity.r, diffuseIntensity.g, diffuseIntensity.b);

        if(specularIntensity instanceof Vector3)
            this.specularIntensity = new Vector3(specularIntensity.x, specularIntensity.y, specularIntensity.z);
        else
            this.specularIntensity = new Vector3(specularIntensity.r, specularIntensity.g, specularIntensity.b);
    }

    getType(): LightType
    {
        return this.type;
    }

    setLights(lightManager: LightManager): void
    {
        lightManager.addLight(this);
        super.setLights(lightManager);
    }
}