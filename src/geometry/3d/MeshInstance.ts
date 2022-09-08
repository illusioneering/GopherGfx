import { Mesh } from './Mesh'
import { Transform3 } from '../../core/Transform3'
import { Camera } from "../../core/Camera";
import { LightManager } from "../../lights/LightManager";
import { Material3 } from '../../materials/Material3';

export class MeshInstance extends Transform3
{
    public readonly baseMesh;
    public material: Material3;

    constructor(baseMesh: Mesh)
    {
        super();
        this.baseMesh = baseMesh;
        this.material = baseMesh.material;
    }

    getBaseMesh(): Mesh
    {
        return this.baseMesh;
    }

    draw(parent: Transform3, camera: Camera, lightManager: LightManager): void
    {
        if(!this.visible)
            return;

        this.material.draw(this.baseMesh, this, camera, lightManager);

        this.children.forEach((elem: Transform3) => {
            elem.draw(this, camera, lightManager);
        });
    }
}