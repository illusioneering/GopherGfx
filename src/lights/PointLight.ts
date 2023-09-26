import { Color } from "../math/Color";
import { Vector3 } from "../math/Vector3";
import { Light, LightType } from "./Light";

/**
 * Creates a new point light that can be added to the scene, for example:
 * ```
 * const p = new PointLight();
 * p.diffuseIntensity = new Vector3(0.3, 0.3, 0.3);
 * p.specularIntensity = new Vector3(0.3, 0.3, 0.3);
 * this.scene.add(p);
 * ```
 */
export class PointLight extends Light
{
    constructor(intensity: Vector3 | Color = new Vector3(0.5, 0.5, 0.5))
    {
        super(LightType.POINT, Vector3.ZERO, intensity, intensity);
    }
}