import { Vector3 } from "./Vector3"

export class Plane3 
{
    public point: Vector3;
    public normal: Vector3;

/**
 * Constructs a new Plane object
 * 
 * @param point - The point on the plane (defaults to Vector3(0, 0, 0))
 * @param normal - The normal vector of the plane (defaults to Vector3(0, 0, -1))
 */
    constructor(point = new Vector3(), normal = new Vector3(0, 0, -1))
    {
        this.point = point.clone();
        this.normal = Vector3.normalize(normal);
    }

/**
 * Calculates the distance between a point and this Plane
 * 
 * @param point - The point to calculate the distance to
 * @returns The distance between the point and this Plane
 */
    distanceTo(point: Vector3): number
    {
        return this.normal.dot(point) - this.point.dot(this.normal);
    }


/**
 * Projects the given point onto the Plane 
 * 
 * @param point - The point to be projected onto the Plane
 * @returns The projected point on the Plane
 */
    project(point: Vector3): Vector3
    {
        const target = new Vector3(this.normal.x, this.normal.y, this.normal.z);
        target.multiplyScalar(-this.distanceTo(point));
        target.add(point);

        return target;
    }
}