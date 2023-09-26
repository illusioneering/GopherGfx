import { Color } from "../math/Color";
import { Vector3 } from "../math/Vector3";
import { Light, LightType } from "./Light";

/**
 * Creates a new directional light that can be added to the scene, for example:
 * ```
 * const d = new DirectionalLight();
 * d.diffuseIntensity = new Vector3(0.3, 0.3, 0.3);
 * d.specularIntensity = new Vector3(0.3, 0.3, 0.3);
 * this.scene.add(d);
 * ```
 */
export class DirectionalLight extends Light
{
    constructor(intensity: Vector3 | Color = new Vector3(0.5, 0.5, 0.5))
    {
        super(LightType.DIRECTIONAL, Vector3.ZERO, intensity, intensity);
    }
}