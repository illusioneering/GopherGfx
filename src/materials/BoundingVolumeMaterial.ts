import { Material3 } from './Material3';
import { WireframeMaterial } from './WireframeMaterial'
import { Mesh } from '../geometry/3d/Mesh';
import { Camera } from '../core/Camera';
import { Transform3 } from '../core/Transform3'
import { LightManager } from '../lights/LightManager';
import { Vector3 } from '../math/Vector3' 
import { Color } from '../math/Color' 
import { SphereMesh } from '../geometry/3d/SphereMesh';
import { BoxMesh } from '../geometry/3d/BoxMesh';

export enum BoundingVolumeMode
{
    BOX,
    SPHERE,
    NONE
}

export class BoundingVolumeMaterial extends Material3
{
    public mode: BoundingVolumeMode;
    public wireframeMaterial: WireframeMaterial;

    private sphere: SphereMesh;
    private box: BoxMesh;
    
    constructor(mode = BoundingVolumeMode.BOX, color = new Color(1, 1, 1, 1))
    {
        super();

        this.mode = mode;

        this.sphere = new SphereMesh(1, 2);
        this.box = new BoxMesh(1, 1, 1);

        this.wireframeMaterial = new WireframeMaterial();
        this.wireframeMaterial.color.copy(color);
        this.sphere.material = this.wireframeMaterial;
        this.box.material = this.wireframeMaterial;
    }

    draw(mesh: Mesh, transform: Transform3, camera: Camera, lightManager: LightManager): void
    {
        if(this.mode == BoundingVolumeMode.BOX)
        {
            const boxCenter = Vector3.add(mesh.boundingBox.min, mesh.boundingBox.max);
            boxCenter.multiplyScalar(0.5);
            this.box.position.copy(boxCenter);
            this.box.scale.set(
                mesh.boundingBox.max.x - mesh.boundingBox.min.x,
                mesh.boundingBox.max.y - mesh.boundingBox.min.y,
                mesh.boundingBox.max.z - mesh.boundingBox.min.z
            );
            this.box.parent = mesh;
            this.box.computeWorldTransform();
            this.box.draw(mesh, camera, lightManager);
        }
        else if(this.mode == BoundingVolumeMode.SPHERE)
        {
            this.sphere.position.copy(mesh.boundingSphere.center);
            this.sphere.scale.set(mesh.boundingSphere.radius, mesh.boundingSphere.radius, mesh.boundingSphere.radius);
            this.sphere.parent = mesh;
            this.sphere.computeWorldTransform();
            this.sphere.draw(mesh, camera, lightManager);
        }
    }
}