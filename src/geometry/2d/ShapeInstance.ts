import { Shape } from './Shape'
import { Transform2 } from '../../core/Transform2'
import { Material2 } from '../../materials/Material2';

export class ShapeInstance extends Transform2
{
    public readonly baseShape;
    public material: Material2;

    constructor(baseShape: Shape, copyTransform = true)
    {
        super();
        this.baseShape = baseShape;
        this.boundingBox = baseShape.boundingBox;
        this.boundingCircle = baseShape.boundingCircle;
        this.material = baseShape.material;
        
        if(copyTransform)
        {
            this.position.copy(baseShape.position);
            this.rotation = baseShape.rotation;
            this.scale.copy(baseShape.scale);
            this.layer = baseShape.layer;
        }
    }

    getBaseShape(): Shape
    {
        return this.baseShape;
    }

    draw(parent: Transform2): void
    {
        if(!this.visible)
            return;

        this.material.draw(this.baseShape, this);

        this.children.forEach((elem: Transform2) => {
            elem.draw(this);
        });
    }
}