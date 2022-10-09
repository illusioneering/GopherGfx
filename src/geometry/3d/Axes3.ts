import { Line3, LineMode3 } from "./Line3";


export class Axes3 extends Line3
{
    constructor(size: number)
    {
        super(LineMode3.LINES);

        const vertices: number[] = [];
        const colors: number[] = [];

         // X axis
         vertices.push(0, 0, 0);
         vertices.push(size, 0, 0);
         colors.push(1, 0, 0, 1);
         colors.push(1, 0, 0, 1);

         // Y axis
         vertices.push(0, 0, 0);
         vertices.push(0, size, 0);
         colors.push(0, 1, 0, 1);
         colors.push(0, 1, 0, 1);

         // Z axis
         vertices.push(0, 0, 0);
         vertices.push(0, 0, size);
         colors.push(0, 0, 1, 1);
         colors.push(0, 0, 1, 1);

         this.setVertices(vertices);
         this.setColors(colors);
    }
}