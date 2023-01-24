import { Line2, LineMode2 } from "./Line2";
/**
 * The `Axes2` class is used for creating a 2D X and Y axes with a specified size. 
 *
 * @extends {Line2}
 */
export class Axes2 extends Line2 {
    /**
     * 
     * Creates an instance of Axes2.
     * @param {number} [size=1] - The size of the axes.
     * 
     * @memberof Axes2
     */
    constructor(size = 1) {
        super(LineMode2.LINES);

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

        this.setVertices(vertices);
        this.setColors(colors);
    }
}
