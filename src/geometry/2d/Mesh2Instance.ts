import { Mesh2 } from './Mesh2'
import { Node2 } from '../../core/Node2'
import { Material2 } from '../../materials/Material2';

/**
 * Represents an instance of a 2D Mesh2.
 */
export class Mesh2Instance extends Node2
{
    /**
     * The "prototype" Mesh2 to base the Mesh2 instance off of
     */
    public readonly baseMesh: Mesh2;

    /**
     * The material to draw this Mesh2 instance with
     */
    public material: Material2;

    /**
     * Create a new instance of a Mesh2.
     * @param baseMesh Template Mesh2 to base this one off of
     * @param copyTransform Copy the transform of the template Mesh2 into this Mesh2 instance
     */
    constructor(baseMesh: Mesh2, copyTransform = true)
    {
        super();
        this.baseMesh = baseMesh;
        this.boundingBox = baseMesh.boundingBox;
        this.boundingCircle = baseMesh.boundingCircle;
        this.material = baseMesh.material;
        
        if(copyTransform)
        {
            this.position.copy(baseMesh.getPosition());
            this.rotation = baseMesh.getRotation();
            this.scale.copy(baseMesh.getScale());
            this.layer = baseMesh.layer;
            this.localMatrixDirty = true;
        }
    }

    /**
     * @returns The template Mesh2 this instance is based upon.
     */
    getBaseMesh(): Mesh2
    {
        return this.baseMesh;
    }

    /**
     * Draw the Mesh2 instance
     */
    draw(): void
    {
        if(!this.visible)
            return;

        this.material.draw(this.baseMesh, this);

        this.children.forEach((elem: Node2) => {
            elem.draw();
        });
    }
}