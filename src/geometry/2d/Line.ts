import { Vector2 } from '../../math/Vector2';
import { Shape } from './Shape'

export class Line extends Shape
{

    constructor(startPoint: Vector2, endPoint: Vector2, thickness = .01)
    {
        super();

        this.material.drawMode = this.gl.TRIANGLE_STRIP;

       this.createVertices(startPoint.distanceTo(endPoint), thickness);

       this.position = Vector2.add(startPoint, endPoint);
       this.position.divideScalar(2);

       const direction = Vector2.subtract(endPoint, startPoint);
       direction.normalize();
       this.rotation = Vector2.angleBetween(Vector2.RIGHT, direction);

       this.createDefaultVertexColors();
    }

    private createVertices(width: number, height: number): void
    {
        const vertices: number[] = [];

        vertices.push(-width/2, height/2);
        vertices.push(-width/2, -height/2);
        vertices.push(width/2, height/2);
        vertices.push(width/2, -height/2);
        
        this.setVertices(vertices);
    }
}