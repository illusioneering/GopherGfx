import { Shape } from './Shape'

export class Circle extends Shape
{
    public readonly radius: number;

    constructor(radius = 0.5, numSegments = 50)
    {
        super();

        this.radius = radius;

        this.material.drawMode = this.gl.TRIANGLE_FAN;

        this.createVertices(this.radius, numSegments);
        this.createTextureCoordinates(numSegments);
        this.createDefaultVertexColors();
    }


    private createVertices(radius: number, numSegments: number): void
    {
        const vertices = [0, 0];
   
        const angle = (Math.PI * 2) / numSegments;

        for(let i=0; i <= numSegments; i++)
        {
            vertices.push(Math.cos(angle*i) * radius, Math.sin(angle*i) * radius);
        }
        
        this.setVertices(vertices);
    }

    private createTextureCoordinates(numSegments: number): void
    {
        const uvs = [0.5, 0.5];

        const angle = (Math.PI * 2) / numSegments;

        for(let i=0; i <= numSegments; i++)
        {
            uvs.push((Math.cos(angle*i) + 1) / 2, (Math.sin(angle*i) - 1) / -2);
        }
        
        this.setTextureCoordinates(uvs);
    }
}