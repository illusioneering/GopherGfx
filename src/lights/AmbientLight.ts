import { Color } from "../math/Color";
import { Vector3 } from "../math/Vector3";
import { Light, LightType } from "./Light";

/**
 * Creates a new ambient light that can be added to the scene, for example:
 * ```
 * const a = new AmbientLight();
 * a.ambientIntensity = new Vector3(0.3, 0.3, 0.3);
 * this.scene.add(a);
 * ```
 */
export class AmbientLight extends Light
{
    constructor(intensity: Vector3 | Color = new Vector3(0.5, 0.5, 0.5))
    {
        super(LightType.POINT, intensity, Vector3.ZERO, Vector3.ZERO);
    }
}