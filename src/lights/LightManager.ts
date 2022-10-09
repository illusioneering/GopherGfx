import { Light } from './Light'
import { Vector3 } from '../math/Vector3';
import { Quaternion } from '../math/Quaternion';

export class LightManager
{
    public lights: Light[];
    public lightTypes: number[];
    public lightPositions: number[];
    public ambientIntensities: number[];
    public diffuseIntensities: number[];
    public specularIntensities: number[];

    constructor()
    {
        this.lights = [];
        this.lightTypes = [];
        this.lightPositions = [];
        this.ambientIntensities = [];
        this.diffuseIntensities = [];
        this.specularIntensities = [];
    }

    clear(): void
    {
        this.lights = [];
        this.lightTypes = [];
        this.lightPositions = [];
        this.ambientIntensities = [];
        this.diffuseIntensities = [];
        this.specularIntensities = [];
    }

    addLight(light: Light): void
    {
        const alreadyAdded = this.lights.some((elem: Light)=>{
            return elem==light;
        });

        if(!alreadyAdded)
            this.lights.push(light)
    }

    getNumLights(): number
    {
        return this.lights.length;
    }

    updateLights(): void
    {
        this.lights.forEach((light: Light) => {

            const [worldPosition, worldRotation, worldScale] = light.worldMatrix.decompose();
            this.lightPositions.push(worldPosition.x, worldPosition.y, worldPosition.z);
            this.lightTypes.push(light.getType());

            if(light.visible)
            {
                this.ambientIntensities.push(light.ambientIntensity.x, light.ambientIntensity.y, light.ambientIntensity.z);
                this.diffuseIntensities.push(light.diffuseIntensity.x, light.diffuseIntensity.y, light.diffuseIntensity.z);
                this.specularIntensities.push(light.specularIntensity.x, light.specularIntensity.y, light.specularIntensity.z);
            }
            else
            {
                this.ambientIntensities.push(0, 0, 0);
                this.diffuseIntensities.push(0, 0, 0);
                this.specularIntensities.push(0, 0, 0);
            }
        });
    }
}