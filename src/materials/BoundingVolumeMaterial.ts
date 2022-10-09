import { Material3 } from './Material3';
import { WireframeMaterial } from './WireframeMaterial'
import { Mesh } from '../geometry/3d/Mesh';
import { Camera } from '../core/Camera';
import { Transform3 } from '../core/Transform3'
import { LightManager } from '../lights/LightManager';
import { Color } from '../math/Color' 
import { SphereMesh } from '../geometry/3d/SphereMesh';
import { LineMaterial } from './LineMaterial';
import { Line3 } from '../geometry/3d/Line3';
import { BoundingBox3 } from '../math/BoundingBox3';
import { Vector3 } from '../math/Vector3';
import { Quaternion } from '../math/Quaternion';

export enum BoundingVolumeMode
{
    ORIENTED_BOUNDING_BOX,
    AXIS_ALIGNED_BOUNDING_BOX,
    BOUNDING_SPHERE
}

export class BoundingVolumeMaterial extends Material3
{
    public mode: BoundingVolumeMode;
    public color: Color;

    public lineMaterial: LineMaterial
    public wireframeMaterial: WireframeMaterial;

    private sphere: SphereMesh;
    private box: Line3;
    
    constructor(mode = BoundingVolumeMode.ORIENTED_BOUNDING_BOX, color = new Color(1, 1, 1, 1))
    {
        super();

        this.mode = mode;
        this.color = Color.copy(color);

        this.sphere = new SphereMesh(1, 1);

        const boundingBox = new BoundingBox3();
        boundingBox.max.set(0.5, 0.5, 0.5);
        boundingBox.min.set(-0.5, -0.5, -0.5);

        this.box = new Line3();
        this.box.createFromBox(boundingBox);

        this.wireframeMaterial = new WireframeMaterial();
        this.wireframeMaterial.color = color;
        this.sphere.material = this.wireframeMaterial;

        this.lineMaterial = new  LineMaterial();
        this.lineMaterial.color = color;
        this.box.material = this.lineMaterial;
    }

    draw(mesh: Mesh, transform: Transform3, camera: Camera, lightManager: LightManager): void
    {
        if(this.mode == BoundingVolumeMode.ORIENTED_BOUNDING_BOX)
        {
            this.box.position.copy(mesh.boundingBox.min);
            this.box.position.add(mesh.boundingBox.max);

            this.box.position.multiplyScalar(0.5);
            this.box.scale.set(
                mesh.boundingBox.max.x - mesh.boundingBox.min.x,
                mesh.boundingBox.max.y - mesh.boundingBox.min.y,
                mesh.boundingBox.max.z - mesh.boundingBox.min.z
            );
            this.box.parent = mesh;
            this.box.traverseSceneGraph();
            this.box.draw(mesh, camera, lightManager);
        }
        else if(this.mode == BoundingVolumeMode.AXIS_ALIGNED_BOUNDING_BOX)
        {
            const abb = new BoundingBox3();
            abb.copy(mesh.boundingBox);

            const [worldPosition, worldRotation, worldScale] = mesh.worldMatrix.decompose();
            abb.transform(worldPosition, worldRotation, worldScale);

            this.box.position.copy(abb.min);
            this.box.position.add(abb.max);
            this.box.position.multiplyScalar(0.5);
            this.box.scale.set(
                abb.max.x - abb.min.x,
                abb.max.y - abb.min.y,
                abb.max.z - abb.min.z
            );
            this.box.matrix.compose(this.box.position, this.box.rotation, this.box.scale)
            this.box.worldMatrix.copy(this.box.matrix);
            this.box.draw(mesh, camera, lightManager);
        }
        else if(this.mode == BoundingVolumeMode.BOUNDING_SPHERE)
        {
            const [worldPosition, worldRotation, worldScale] = mesh.worldMatrix.decompose();
            this.sphere.position.copy(worldPosition);
            this.sphere.position.add(mesh.boundingSphere.center);
            this.sphere.scale.set(mesh.boundingSphere.radius, mesh.boundingSphere.radius, mesh.boundingSphere.radius);
            this.sphere.matrix.compose(this.sphere.position, this.sphere.rotation, this.sphere.scale)
            this.sphere.worldMatrix.copy(this.sphere.matrix);
            this.sphere.draw(mesh, camera, lightManager);
        }
    }

    setColor(color: Color): void
    {
        this.color.copy(color);
    }
}