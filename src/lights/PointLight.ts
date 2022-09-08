import { Color } from "../math/Color";
import { Light, LightType } from "./Light";

export class PointLight extends Light
{
    constructor(color = new Color(0.5, 0.5, 0.5))
    {
        super(LightType.POINT, new Color(0, 0, 0), color, color);
    }
}