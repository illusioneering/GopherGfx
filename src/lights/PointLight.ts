import { Color } from "../math/Color";
import { Vector3 } from "../math/Vector3";
import { Light, LightType } from "./Light";

export class PointLight extends Light
{
    constructor(intensity: Vector3 | Color = new Vector3(0.5, 0.5, 0.5))
    {
        super(LightType.POINT, Vector3.ZERO, intensity, intensity);
    }
}