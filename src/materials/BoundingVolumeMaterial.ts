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
import { Vector3 } from '../math/Vector3'
import { Quaternion } from '../math/Quaternion';
import { Matrix4 } from '../math/Matrix4';

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

    draw(object: Node3, camera: Camera, lightManager: LightManager): void
    {
        if(this.mode == BoundingVolumeMode.ORIENTED_BOUNDING_BOX)
        {
            const boxPosition = Vector3.add(object.boundingBox.min, object.boundingBox.max);
            boxPosition.multiplyScalar(0.5);

            const boxScale = new Vector3(
                object.boundingBox.max.x - object.boundingBox.min.x,
                object.boundingBox.max.y - object.boundingBox.min.y,
                object.boundingBox.max.z - object.boundingBox.min.z
            );
            
            const boxMatrix = Matrix4.makeScale(boxScale);
            boxMatrix.mat[12] = boxPosition.x;
            boxMatrix.mat[13] = boxPosition.y;
            boxMatrix.mat[14] = boxPosition.z;

            this.box.localToWorldMatrix.copy(boxMatrix);
            this.box.localToWorldMatrix.premultiply(object.localToWorldMatrix);

            this.box.draw(object, camera, lightManager);
        }
        else if(this.mode == BoundingVolumeMode.AXIS_ALIGNED_BOUNDING_BOX)
        {
            const abb = object.worldBoundingBox;

            const boxPosition = Vector3.add(abb.min, abb.max);
            boxPosition.multiplyScalar(0.5);

            const boxScale = new Vector3(
                abb.max.x - abb.min.x,
                abb.max.y - abb.min.y,
                abb.max.z - abb.min.z
            );

            const boxMatrix = Matrix4.makeScale(boxScale);
            boxMatrix.mat[12] = boxPosition.x;
            boxMatrix.mat[13] = boxPosition.y;
            boxMatrix.mat[14] = boxPosition.z;

            this.box.localToWorldMatrix.copy(boxMatrix);

            this.box.draw(object, camera, lightManager);
        }
        else if(this.mode == BoundingVolumeMode.BOUNDING_SPHERE)
        {
            const sphereScale = new Vector3(object.boundingSphere.radius, object.boundingSphere.radius, object.boundingSphere.radius);

            const sphereMatrix = Matrix4.makeScale(sphereScale);
            sphereMatrix.mat[12] = object.boundingSphere.center.x;
            sphereMatrix.mat[13] = object.boundingSphere.center.y;
            sphereMatrix.mat[14] = object.boundingSphere.center.z;

            this.sphere.localToWorldMatrix.copy(sphereMatrix);
            this.sphere.localToWorldMatrix.premultiply(object.localToWorldMatrix);
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