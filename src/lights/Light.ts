import { Color } from "../math/Color";
import { LightManager } from "./LightManager";
import { Transform3 } from "../core/Transform3";

export enum LightType
{
    POINT = 0,
    DIRECTIONAL
}

export abstract class Light extends Transform3
{
    public ambientIntensity: Color;
    public diffuseIntensity: Color;
    public specularIntensity: Color;

    protected readonly type: LightType;

    constructor(type = LightType.POINT, ambientIntensity = new Color(), diffuseIntensity = new Color(), specularIntensity = new Color())
    {
        super();

        this.type = type;
        this.ambientIntensity = ambientIntensity;
        this.diffuseIntensity = diffuseIntensity;
        this.specularIntensity = specularIntensity;
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