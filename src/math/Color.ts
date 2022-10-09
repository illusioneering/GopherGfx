export class Color
{
    public static readonly WHITE = new Color(1, 1, 1);
    public static readonly BLACK = new Color(0, 0, 0);
    public static readonly RED = new Color(1, 0 ,0);
    public static readonly GREEN = new Color(0, 1 ,0);
    public static readonly BLUE = new Color(0, 0, 1);
    public static readonly YELLOW = new Color(1, 1, 0);
    public static readonly PURPLE = new Color(1, 0, 1);
    public static readonly CYAN = new Color(0, 1, 1);

    static copy(color: Color): Color
    {
        const newColor = new Color();
        newColor.r = color.r;
        newColor.g = color.g;
        newColor.b = color.b;
        newColor.a = color.a;
        return newColor;
    }

    public static lerp(c1: Color, c2: Color, alpha: number): Color
    {
        return new Color(
            c1.r * (1-alpha) + c2.r * alpha,
            c1.g * (1-alpha) + c2.g * alpha,
            c1.b * (1-alpha) + c2.b * alpha,
            c1.a * (1-alpha) + c2.a * alpha,
        );
    }

    public r: number;
    public g: number;
    public b: number;
    public a: number;

    constructor(r = 0, g = 0, b = 0, a = 1)
    {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    set(r = 0, g = 0, b = 0, a = 1): void
    {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    copy(color: Color)
    {
        this.r = color.r;
        this.g = color.g;
        this.b = color.b;
        this.a = color.a;
    }

    clone(): Color
    {
        return new Color(this.r, this.g, this.b, this.a);
    }

    lerp(c1: Color, c2: Color, alpha: number): void
    {
        this.r = c1.r * (1-alpha) + c2.r * alpha;
        this.g = c1.g * (1-alpha) + c2.g * alpha;
        this.b = c1.b * (1-alpha) + c2.b * alpha;
        this.a = c1.b * (1-alpha) + c2.a * alpha;
    }
}