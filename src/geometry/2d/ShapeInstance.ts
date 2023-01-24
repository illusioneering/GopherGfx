import { Shape } from './Shape'
import { Transform2 } from '../../core/Transform2'
import { Material2 } from '../../materials/Material2';

/**
 * Represents an instance of a 2D shape.
 */
export class ShapeInstance extends Transform2
{
    /**
     * The "prototype" shape to base the shape instance off of
     */
    public readonly baseShape: Shape;

    /**
     * The material to draw this shape instance with
     */
    public material: Material2;

    /**
     * Create a new instance of a shape.
     * @param baseShape Template shape to base this one off of
     * @param copyTransform Copy the transform of the template shape into this shape instance
     */
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

    /**
     * @returns The template shape this instance is based upon.
     */
    getBaseShape(): Shape
    {
        return this.baseShape;
    }

    /**
     * Draw the shape instance
     */
    draw(): void
    {
        if(!this.visible)
            return;

        this.material.draw(this.baseShape, this);

        this.children.forEach((elem: Transform2) => {
            elem.draw();
        });
    }
}