import { Mesh2 } from './2d/Mesh2'
import { Line2, LineMode2 } from './2d/Line2'
import { Vector2 } from '../math/Vector2';
import { BoundingBox2 } from "../math/BoundingBox2";

/**
 * This is a factory class for creating a variety of common geometries that can be drawn in a 2D scene.
 * Most of these geometries are Mesh2s, meaning they are constructed from triangles, but there are also
 * a few Line2 objects.  This factory is for creating simple 2D geometries (e.g., rectangles, circles)
 * that are easily described by a mathematical function.
 */
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

        return mesh;
    }


    /**
     * Creates a pie slice (technically a sector) that spans the arc from startAngle moving counter-clockwise to stopAngle.
     * @param radius Radius of the circle the pie slice is cut from
     * @param startAngle The starting angle for the pie slice
     * @param stopAngle The stopping angle
     * @param radiansPerSegment Controls the tesselation of the triangle fan, defaults to the same resolution as
     * Geometry2Factory.createCircle(), 50 segments per 2*PI.
     * @returns A Mesh2 triangle fan to represent the sector
     */
    public static createPieSlice(radius = 0.5, startAngle = 0, stopAngle = Math.PI, radiansPerSegment = Math.PI / 25): Mesh2
    {
        const mesh = new Mesh2();
        
        mesh.material.drawMode = WebGL2RenderingContext.TRIANGLE_FAN;

        const vertices = [0, 0];
        const uvs = [0.5, 0.5];

        while (stopAngle < startAngle) {
            stopAngle += 2 * Math.PI;
        }
        const numSegments = Math.floor(stopAngle - startAngle) / radiansPerSegment;
        const angleInc = (stopAngle - startAngle) / numSegments;
        let angle = startAngle;
        for (let i = 0; i <= numSegments; i++) {
            vertices.push(Math.cos(angle) * radius, Math.sin(angle) * radius);
            uvs.push((Math.cos(angle) + 1) / 2, (Math.sin(angle) - 1) / -2);
            angle += angleInc;
        }
        if (angle != stopAngle) {
            // if the total angle does not divide evenly by radiansPerSegment, add one final segment
            angle = stopAngle;
            vertices.push(Math.cos(angle) * radius, Math.sin(angle) * radius);
            uvs.push((Math.cos(angle) + 1) / 2, (Math.sin(angle) - 1) / -2);
        }

        mesh.setVertices(vertices);
        mesh.setTextureCoordinates(uvs);

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

        return line;
    }
}