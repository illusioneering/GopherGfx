import { Shape } from './Shape'
import { Transform2 } from '../../core/Transform2'
import { Material2 } from '../../materials/Material2';

/**
 * Represents an instance of a 2D shape.
 * 
 * @export
 * @class Shape
 * @extends {Transform2}
 */
export class ShapeInstance extends Transform2
{
    /**
     * The "prototype" shape to base the shape instance off of
     * 
     * @memberof ShapeInstance
     */
    public readonly baseShape;

    /**
     * The material to draw this shape instance with
     * 
     * @memberof ShapeInstance
     */
    public material: Material2;

    /**
     * Create a new instance of a shape.
     * 
     * @constructor
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
     * @returns The template shape this instance is based off.
     */
    getBaseShape(): Shape
    {
        return this.baseShape;
    }

    /**
     * Draw the shape instance
     * 
     * @param parent Unused
     */
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