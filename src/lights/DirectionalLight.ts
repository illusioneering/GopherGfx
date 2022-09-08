import { Color } from "../math/Color";
import { Light, LightType } from "./Light";

export class DirectionalLight extends Light
{
    constructor(color = new Color(0.5, 0.5, 0.5))
    {
        super(LightType.DIRECTIONAL, new Color(0, 0, 0), color, color);
    }
}