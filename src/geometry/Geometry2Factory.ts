import { Mesh2 } from './2d/Mesh2'
import { Line2, LineMode2 } from './2d/Line2'
import { Vector2 } from '../math/Vector2';
import { BoundingBox2 } from "../math/BoundingBox2";

export class Geometry2Factory
{
    public static createBox(width = 1, height = 1): Mesh2
    {
        const mesh = new Mesh2();
        
        mesh.material.drawMode = WebGL2RenderingContext.TRIANGLE_STRIP;

        const vertices: number[] = [];
        vertices.push(-width/2, height/2);
        vertices.push(-width/2, -height/2);
        vertices.push(width/2, height/2);
        vertices.push(width/2, -height/2);

        const uvs: number[] = [];
        uvs.push(0, 0);
        uvs.push(0, 1);
        uvs.push(1, 0);
        uvs.push(1, 1);
        
        mesh.setVertices(vertices);
        mesh.setTextureCoordinates(uvs);
        mesh.createDefaultVertexColors();

        return mesh;
    }

    public static createCircle(radius = 0.5, numSegments = 50): Mesh2
    {
        const mesh = new Mesh2();
        
        mesh.material.drawMode = WebGL2RenderingContext.TRIANGLE_FAN;

        const vertices = [0, 0];
        const uvs = [0.5, 0.5];
        const angle = (Math.PI * 2) / numSegments;
        for (let i = 0; i <= numSegments; i++) {
            vertices.push(Math.cos(angle * i) * radius, Math.sin(angle * i) * radius);
            uvs.push((Math.cos(angle * i) + 1) / 2, (Math.sin(angle * i) - 1) / -2);
        }

        mesh.setVertices(vertices);
        mesh.setTextureCoordinates(uvs);
        mesh.createDefaultVertexColors();

        return mesh;
    }

    public static createAxes(size = 1): Line2
    {
        const axes = new Line2(LineMode2.LINES);
        
        const vertices: number[] = [];
        const colors: number[] = [];

        // X axis
        vertices.push(0, 0);
        vertices.push(size, 0);
        colors.push(1, 0, 0, 1);
        colors.push(1, 0, 0, 1);

        // Y axis
        vertices.push(0, 0);
        vertices.push(0, size);
        colors.push(0, 1, 0, 1);
        colors.push(0, 1, 0, 1);

        axes.setVertices(vertices);
        axes.setColors(colors);

        return axes;
    }

    public static createLine(startPoint: Vector2, endPoint: Vector2): Line2
    {
        const line = new Line2(LineMode2.LINES);

        const vertices: number[] = [];
        vertices.push(startPoint.x, startPoint.y);
        vertices.push(endPoint.x, endPoint.y);

        line.setVertices(vertices);
        line.createDefaultVertexColors();

        return line;
    }

    public static createLinesFromBox(box: BoundingBox2): Line2
    {
        const line = new Line2(LineMode2.LINE_LOOP);

        const vertices: number[] = [];
        vertices.push(box.min.x, box.min.y);
        vertices.push(box.max.x, box.min.y);
        vertices.push(box.max.x, box.max.y);
        vertices.push(box.min.x, box.max.y);

        line.setVertices(vertices);
        line.createDefaultVertexColors();

        return line;
    }
}