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
    public readonly baseMesh2: Mesh2;

    /**
     * The material to draw this Mesh2 instance with
     */
    public material: Material2;

    /**
     * Create a new instance of a Mesh2.
     * @param baseMesh2 Template Mesh2 to base this one off of
     * @param copyTransform Copy the transform of the template Mesh2 into this Mesh2 instance
     */
    constructor(baseMesh2: Mesh2, copyTransform = true)
    {
        super();
        this.baseMesh2 = baseMesh2;
        this.boundingBox = baseMesh2.boundingBox;
        this.boundingCircle = baseMesh2.boundingCircle;
        this.material = baseMesh2.material;
        
        if(copyTransform)
        {
            this.position.copy(baseMesh2.position);
            this.rotation = baseMesh2.rotation;
            this.scale.copy(baseMesh2.scale);
            this.layer = baseMesh2.layer;
        }
    }

    /**
     * @returns The template Mesh2 this instance is based upon.
     */
    getBaseMesh2(): Mesh2
    {
        return this.baseMesh2;
    }

    /**
     * Draw the Mesh2 instance
     */
    draw(): void
    {
        if(!this.visible)
            return;

        this.material.draw(this.baseMesh2, this);

        this.children.forEach((elem: Node2) => {
            elem.draw();
        });
    }
}