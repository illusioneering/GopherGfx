import { Light } from './Light'
import { Vector3 } from '../math/Vector3';

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
            if(light.visible)
            {
                this.lightPositions.push(light.worldPosition.x, light.worldPosition.y, light.worldPosition.z);

                this.lightTypes.push(light.getType());
                this.ambientIntensities.push(light.ambientIntensity.r, light.ambientIntensity.g, light.ambientIntensity.b);
                this.diffuseIntensities.push(light.diffuseIntensity.r, light.diffuseIntensity.g, light.diffuseIntensity.b);
                this.specularIntensities.push(light.specularIntensity.r, light.specularIntensity.g, light.specularIntensity.b);
            }
            else
            {
                this.lightPositions.push(light.worldPosition.x, light.worldPosition.y, light.worldPosition.z);

                this.lightTypes.push(light.getType());
                this.ambientIntensities.push(0, 0, 0);
                this.diffuseIntensities.push(0, 0, 0);
                this.specularIntensities.push(0, 0, 0);
            }
        });
    }
}