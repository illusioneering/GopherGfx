import { Color } from "../math/Color";
import { Light, LightType } from "./Light";

export class AmbientLight extends Light
{
    constructor(color = new Color(0.5, 0.5, 0.5))
    {
        super(LightType.POINT, color, new Color(0, 0, 0),  new Color(0, 0, 0));
    }
}