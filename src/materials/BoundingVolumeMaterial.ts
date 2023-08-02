import { Material3 } from './Material3';
import { WireframeMaterial } from './WireframeMaterial'
import { Camera } from '../core/Camera';
import { Node3 } from '../core/Node3'
import { LightManager } from '../lights/LightManager';
import { Color } from '../math/Color' 
import { Mesh3 } from '../geometry/3d/Mesh3';
import { Geometry3Factory } from '../geometry/Geometry3Factory';
import { Line3 } from '../geometry/3d/Line3';
import { BoundingBox3 } from '../math/BoundingBox3';

export enum BoundingVolumeMode
{
    ORIENTED_BOUNDING_BOX,
    AXIS_ALIGNED_BOUNDING_BOX,
    BOUNDING_SPHERE
}

export class BoundingVolumeMaterial extends Material3
{
    public mode: BoundingVolumeMode;
    
    public readonly color: Color;
    public readonly wireframeMaterial: WireframeMaterial;

    private sphere: Mesh3;
    private box: Line3;
    
    constructor(mode = BoundingVolumeMode.ORIENTED_BOUNDING_BOX, color = new Color(1, 1, 1, 1))
    {
        super();

        this.mode = mode;
        this.color = Color.copy(color);

        this.sphere = Geometry3Factory.createSphere(1, 1);

        const boundingBox = new BoundingBox3();
        boundingBox.max.set(0.5, 0.5, 0.5);
        boundingBox.min.set(-0.5, -0.5, -0.5);

        this.box = new Line3();
        this.box.createFromBox(boundingBox);
        this.box.color = this.color;

        this.wireframeMaterial = new WireframeMaterial();
        this.wireframeMaterial.color = this.color;
        this.sphere.material = this.wireframeMaterial;
    }

    draw(object: Node3, transform: Node3, camera: Camera, lightManager: LightManager): void
    {
        if(this.mode == BoundingVolumeMode.ORIENTED_BOUNDING_BOX)
        {
            this.box.position.copy(object.boundingBox.min);
            this.box.position.add(object.boundingBox.max);

            this.box.position.multiplyScalar(0.5);
            this.box.scale.set(
                object.boundingBox.max.x - object.boundingBox.min.x,
                object.boundingBox.max.y - object.boundingBox.min.y,
                object.boundingBox.max.z - object.boundingBox.min.z
            );

            this.box.matrix.compose(this.box.position, this.box.rotation, this.box.scale);
            this.box.worldMatrix.copy(object.worldMatrix);
            this.box.worldMatrix.multiply(this.box.matrix);

            this.box.draw(object, camera, lightManager);
        }
        else if(this.mode == BoundingVolumeMode.AXIS_ALIGNED_BOUNDING_BOX)
        {
            const abb = new BoundingBox3();
            abb.copy(object.boundingBox);

            const [worldPosition, worldRotation, worldScale] = object.worldMatrix.decompose();
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
            this.box.draw(object, camera, lightManager);
        }
        else if(this.mode == BoundingVolumeMode.BOUNDING_SPHERE)
        {
            this.sphere.position.copy(object.boundingSphere.center);
            this.sphere.scale.set(object.boundingSphere.radius, object.boundingSphere.radius, object.boundingSphere.radius);

            this.sphere.matrix.compose(this.sphere.position, this.sphere.rotation, this.sphere.scale);
            this.sphere.worldMatrix.copy(object.worldMatrix);
            this.sphere.worldMatrix.multiply(this.sphere.matrix);

            this.sphere.draw(object, camera, lightManager);
        }
    }

    setColor(color: Color): void
    {
        this.color.copy(color);
    }

    getColor(): Color
    {
        return this.color;
    }
}