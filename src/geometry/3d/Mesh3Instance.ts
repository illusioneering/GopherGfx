import { Mesh3 } from './Mesh3'
import { Node3 } from '../../core/Node3'
import { Camera } from "../../core/Camera";
import { LightManager } from "../../lights/LightManager";
import { Material3 } from '../../materials/Material3';

export class Mesh3Instance extends Node3
{
    public readonly baseMesh3;
    public material: Material3;

    constructor(baseMesh3: Mesh3, copyTransform = true)
    {
        super();
        this.baseMesh3 = baseMesh3;
        this.material = baseMesh3.material;
        this.boundingBox = baseMesh3.boundingBox;
        this.boundingSphere = baseMesh3.boundingSphere;
        this.visible = baseMesh3.visible;
        this.drawBoundingVolume = baseMesh3.drawBoundingVolume;
        this.boundingVolumeMaterial = baseMesh3.boundingVolumeMaterial;
        
        if(copyTransform)
        {
            this.position.copy(baseMesh3.position);
            this.rotation.copy(baseMesh3.rotation);
            this.scale.copy(baseMesh3.scale);  
        }
    }

    getBaseMesh3(): Mesh3
    {
        return this.baseMesh3;
    }

    draw(parent: Node3, camera: Camera, lightManager: LightManager): void
    {
        if(!this.visible)
            return;

        this.material.draw(this.baseMesh3, this, camera, lightManager);

        if(this.drawBoundingVolume && this.boundingVolumeMaterial)
            this.boundingVolumeMaterial.draw(this, this, camera, lightManager);

        this.children.forEach((elem: Node3) => {
            elem.draw(this, camera, lightManager);
        });
    }
}