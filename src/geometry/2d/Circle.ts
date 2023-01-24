import { Shape } from './Shape'

/**
 * The Circle class is used for creating a 2D circle with a specified radius and number of segments.
 */
export class Circle extends Shape {

    /**
     * The radius of the Circle
     */
    public readonly radius: number;

    /**
     * Creates an instance of Circle.
     * 
     * @param radius - The radius of the Circle
     * @param numSegments - The number of segments of the Circle 
     */
    constructor(radius = 0.5, numSegments = 50) {
        super();
        this.radius = radius;
        this.material.drawMode = this.gl.TRIANGLE_FAN;
        this.createVertices(this.radius, numSegments);
        this.createTextureCoordinates(numSegments);
        this.createDefaultVertexColors();
    }

    /**
     * Creates the vertices of the circle
     * 
     * @param radius - The radius of the circle
     * @param numSegments - The number of segments in the circle
     */
    private createVertices(radius: number, numSegments: number): void {
        const vertices = [0, 0];
        const angle = (Math.PI * 2) / numSegments;
        for (let i = 0; i <= numSegments; i++) {
            vertices.push(Math.cos(angle * i) * radius, Math.sin(angle * i) * radius);
        }
        this.setVertices(vertices);
    }

    /**
     * Creates the texture coordinates of the circle
     * 
     * @param numSegments - The number of segments in the circle
     */
    private createTextureCoordinates(numSegments: number): void {
        const uvs = [0.5, 0.5];
        const angle = (Math.PI * 2) / numSegments;
        for (let i = 0; i <= numSegments; i++) {
            uvs.push((Math.cos(angle * i) + 1) / 2, (Math.sin(angle * i) - 1) / -2);
        }
        this.setTextureCoordinates(uvs);
    }
}
