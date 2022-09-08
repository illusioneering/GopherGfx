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
}