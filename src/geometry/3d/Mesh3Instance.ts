import { Mesh3 } from './Mesh3'
import { Node3 } from '../../core/Node3'
import { Camera } from "../../core/Camera";
import { LightManager } from "../../lights/LightManager";
import { Material3 } from '../../materials/Material3';

export class Mesh3Instance extends Node3
{
    public readonly baseMesh;
    public material: Material3;

    constructor(baseMesh: Mesh3, copyTransform = true)
    {
        super();
        this.baseMesh = baseMesh;
        this.material = baseMesh.material;
        this.boundingBox = baseMesh.boundingBox;
        this.boundingSphere = baseMesh.boundingSphere;
        this.visible = baseMesh.visible;
        
        if(copyTransform)
        {
            this._position.copy(baseMesh.position);
            this._rotation.copy(baseMesh.rotation);
            this._scale.copy(baseMesh.scale);  
        }
    }

    getBaseMesh3(): Mesh3
    {
        return this.baseMesh;
    }

    draw(parent: Node3, camera: Camera, lightManager: LightManager): void
    {
        if(!this.visible)
            return;

        this.material.draw(this.baseMesh, this, camera, lightManager);

        this.children.forEach((elem: Node3) => {
            elem.draw(this, camera, lightManager);
        });
    }
}