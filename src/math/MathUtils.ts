export class MathUtils
{

    /**
     * Default small value used to account for numerical instabilities when testing for equality, etc. 
     */
    public static readonly EPSILON = 0.0000001;

    /**
     * Converts degrees to radians
     * 
     * @param degrees - The degrees value to be converted
     * @returns The converted radians value
     */
    public static degreesToRadians(degrees: number)
    {
        return degrees * Math.PI / 180;
    }

    /**
     * Converts radians to degrees
     * 
     * @param radians - The radians value to be converted
     * @returns The converted degrees value
     */
    public static radiansToDegrees(radians: number)
    {
        return radians * 180 / Math.PI;
    }

    /**
     * Rescales a value from one range to another
     * 
     * @param value - The value to be rescaled
     * @param min - The minimum value of the original range
     * @param max - The maximum value of the original range
     * @param scaledMin - The minimum value of the scaled range
     * @param scaledMax - The maximum value of the scaled range
     * @returns The rescaled value
     */
    public static rescale(value: number, min: number, max: number, scaledMin: number, scaledMax: number): number
    {
        return scaledMin + (scaledMax - scaledMin) * (value - min) / (max - min);
    }

    /**
     * Clamps a value between a minimum and maximum value
     * 
     * @param value - The value to be clamped
     * @param min - The minimum value
     * @param max - The maximum value
     * @returns The clamped value
     */
    public static clamp(value: number, min: number, max: number): number
    {
        return Math.max(min, Math.min(max, value));
    }

    /**
     * Performs linear interpolation between two values
     * 
     * @param x - The first value
     * @param y - The second value
     * @param alpha - The interpolation factor
     * @returns The interpolated value
     */
    public static lerp(x: number, y: number, alpha: number): number
    {
        return x * (1-alpha) + y * alpha;
    }
}