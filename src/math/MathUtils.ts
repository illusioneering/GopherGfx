export class MathUtils
{
    public static degreesToRadians(degrees: number)
    {
        return degrees * Math.PI / 180;
    }

    public static radiansToDegrees(radians: number)
    {
        return radians * 180 / Math.PI;
    }

    public static rescale(value: number, min: number, max: number, scaledMin: number, scaledMax: number): number
    {
        return scaledMin + (scaledMax - scaledMin) * (value - min) / (max - min);
    }

    public static clamp(value: number, min: number, max: number): number
    {
        return Math.max(min, Math.min(max, value));
    }
}