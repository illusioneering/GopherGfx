
/**
 * This class holds a color for computer graphics defined via four components (Red, Green, Blue, Alpha).
 * Alpha is opacity (0.0 = completely transparent, 1.0 = completely opaque).  All components range from
 * 0.0 to 1.0 in floating point.  
 */
export class Color
{

/**
 * Static properties representing standard colors
 */
    public static readonly WHITE = new Color(1, 1, 1);
    public static readonly BLACK = new Color(0, 0, 0);
    public static readonly RED = new Color(1, 0 ,0);
    public static readonly GREEN = new Color(0, 1 ,0);
    public static readonly BLUE = new Color(0, 0, 1);
    public static readonly YELLOW = new Color(1, 1, 0);
    public static readonly PURPLE = new Color(1, 0, 1);
    public static readonly CYAN = new Color(0, 1, 1);

/**
 * Static method to create a copy of the given Color object
 * 
 * @param color - The Color object to copy
 * @returns A copy of the given Color object
 */
    public static copy(color: Color): Color
    {
        const newColor = new Color();
        newColor.r = color.r;
        newColor.g = color.g;
        newColor.b = color.b;
        newColor.a = color.a;
        return newColor;
    }

/**
 * Static method to create a Color object from a hex string
 * 
 * @param color - The hex string to convert to a Color object
 * @returns A new Color object created from the given hex string
 */
    public static createFromString(color: string): Color
    {
        return new Color(
            parseInt(color.substring(1,3), 16) / 255,
            parseInt(color.substring(3,5), 16) / 255,
            parseInt(color.substring(5,7), 16) / 255
        );
    }

/**
 * Static method to interpolate between two Color objects
 * 
 * @param c1 - The first Color object
 * @param c2 - The second Color object
 * @param alpha - The interpolation factor between the two objects
 * @returns The interpolated Color object
 */
    public static lerp(c1: Color, c2: Color, alpha: number): Color
    {
        return new Color(
            c1.r * (1-alpha) + c2.r * alpha,
            c1.g * (1-alpha) + c2.g * alpha,
            c1.b * (1-alpha) + c2.b * alpha,
            c1.a * (1-alpha) + c2.a * alpha,
        );
    }

/**
 * Static method to add two Color objects
 * 
 * @param c1 - The first Color object
 * @param c2 - The second Color object
 * @returns The sum of the two Color objects
 */
    public static add(c1: Color, c2: Color): Color
    {
        return new Color(c1.r + c2.r, c1.g + c2.g, c1.b + c2.b);
    }

/**
 * Static method to subtract two Color objects
 * 
 * @param c1 - The first Color object
 * @param c2 - The second Color object
 * @returns The difference between the two Color objects
 */
    public static subtract(c1: Color, c2: Color): Color
    {
        return new Color(c1.r - c2.r, c1.g - c2.g, c1.b - c2.b);
    }

/**
 * Static method to multiply two Color objects
 * 
 * @param c1 - The first Color object
 * @param c2 - The second Color object
 * @returns The product of the two Color objects
 */
    public static multiply(c1: Color, c2: Color): Color
    {
        return new Color(c1.r * c2.r, c1.g * c2.g, c1.b * c2.b);
    }

/**
 * Static method to divide two Color objects
 * 
 * @param c1 - The first Color object
 * @param c2 - The second Color object
 * @returns The quotient of the two Color objects
 */
    public static divide(c1: Color, c2: Color): Color
    {
        return new Color(c1.r / c2.r, c1.g / c2.g, c1.b / c2.b);
    }

/**
 * Static method to multiply a Color object by a scalar
 * 
 * @param v - The Color object to multiply
 * @param n - The scalar to multiply by
 * @returns The product of the Color object and the scalar
 */
    public static multiplyScalar(v: Color, n: number): Color
    {
        return new Color(v.r * n, v.g * n, v.b * n);
    }

/**
 * Static method that calculates the result of dividing a Color by a scalar
 * 
 * @param v - The Color object to be divided
 * @param n - The scalar to divide the Color by
 * @returns The result of the division
 */
    public static divideScalar(v: Color, n: number): Color
    {
        return new Color(v.r / n, v.g / n, v.b / n);
    }

    public r: number;
    public g: number;
    public b: number;
    public a: number;

/**
 * Constructor for creating a Color object
 * 
 * @param r - The red component of the Color object
 * @param g - The green component of the Color object
 * @param b - The blue component of the Color object
 * @param a - The alpha component of the Color object
 */
    constructor(r = 0, g = 0, b = 0, a = 1)
    {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

/**
 * Set the components of the Color object
 * 
 * @param r - The red component
 * @param g - The green component
 * @param b - The blue component
 * @param a - The alpha component (optional, defaults to 1)
 */
    set(r = 0, g = 0, b = 0, a = 1): void
    {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

/**
 * Set the components of the Color object from a hex string
 * 
 * @param color - The hex string to convert to a Color object
 */
    setFromString(color: string): void
    {
        this.r = parseInt(color.substring(1,3), 16) / 255;
        this.g = parseInt(color.substring(3,5), 16) / 255;
        this.b = parseInt(color.substring(5,7), 16) / 255;
    }

/**
 * Copy the components of a given Color object
 * 
 * @param color - The Color object to copy
 */
    copy(color: Color)
    {
        this.r = color.r;
        this.g = color.g;
        this.b = color.b;
        this.a = color.a;
    }

/**
 * Create a clone of the Color object
 * 
 * @returns A new Color object that is an exact copy of the original
 */
    clone(): Color
    {
        return new Color(this.r, this.g, this.b, this.a);
    }

/**
 * Interpolate between two Color objects
 * 
 * @param c1 - The first Color object
 * @param c2 - The second Color object
 * @param alpha - The interpolation factor between the two objects
 */
    lerp(c1: Color, c2: Color, alpha: number): void
    {
        this.r = c1.r * (1-alpha) + c2.r * alpha;
        this.g = c1.g * (1-alpha) + c2.g * alpha;
        this.b = c1.b * (1-alpha) + c2.b * alpha;
        this.a = c1.b * (1-alpha) + c2.a * alpha;
    }

/**
 * Add another Color object to the current one
 * 
 * @param c - The Color object to add
 */
    add(c: Color): void
    {
        this.r += c.r;
        this.g += c.g;
        this.b += c.b;
    }

/**
 * Subtract another Color object from the current one
 * 
 * @param c - The Color object to subtract
 */
    subtract(c: Color): void
    {
        this.r -= c.r;
        this.g -= c.g;
        this.b -= c.b;
    }

/**
 * Multiply the current Color object by another one
 * 
 * @param c - The Color object to multiply by
 */
    multiply(c: Color): void
    {
        this.r *= c.r;
        this.g *= c.g;
        this.b *= c.b;
    }

/**
 * Divide the current Color object by another one
 * 
 * @param c - The Color object to divide by
 */
    divide(c: Color): void
    {
        this.r /= c.r;
        this.g /= c.g;
        this.b /= c.b;
    }

/**
 * Multiply the current Color object by a scalar
 * 
 * @param n - The scalar to multiply by
 */
    multiplyScalar(n: number): void
    {
        this.r *= n;
        this.g *= n;
        this.b *= n;
    }

/**
 * Method that divides a Color object by a scalar
 * 
 * @param n - The scalar to divide the Color object by
 */
    divideScalar(n: number): void
    {
        this.r /= n;
        this.g /= n;
        this.b /= n;
    }
}