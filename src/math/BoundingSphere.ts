import { BoundingBox3 } from "./BoundingBox3";
import { Vector3 } from "./Vector3"

export class BoundingSphere 
{
    public center: Vector3;
    public radius: number;

    constructor()
    {
        this.center = new Vector3();
        this.radius = 0;
    }

    copy(circle: BoundingSphere): void
    {
        this.center.copy(circle.center);
        this.radius = circle.radius;
    }

    transform(translation: Vector3, scale: Vector3)
    {
        this.center.multiply(scale);
        this.center.add(translation);
        
        if(scale.x >= scale.y)
            this.radius *= scale.x;
        else
            this.radius *= scale.y;
    }

    intersects(circle: BoundingSphere): boolean
    {
        const distance = this.center.distanceTo(circle.center);

        if(distance < (this.radius + circle.radius))
            return true;
        else
            return false;
    }

    computeBounds(vertices: Vector3[] | number[], boundingBox: BoundingBox3): void
    {
        this.center.copy(boundingBox.min);
        this.center.add(boundingBox.max);
        this.center.multiplyScalar(0.5);
        this.radius = 0;
        if(typeof vertices[0] === 'number')
        {
            const vArray = vertices as number[];
            for(let i=0; i < vArray.length; i+=3)
            {
                const distance = Math.sqrt(
                    (vArray[i] - this.center.x) * (vArray[i] - this.center.x) +
                    (vArray[i+1] - this.center.y) * (vArray[i+1] - this.center.y) +
                    (vArray[i+2] - this.center.z) * (vArray[i+2] - this.center.z)
                );
                
                if(distance > this.radius)
                    this.radius = distance;
            }
        }
        else
        {
            (vertices as Vector3[]).forEach((elem: Vector3) =>
            {
                const distance = elem.distanceTo(this.center);

                if(distance > this.radius)
                    this.radius = distance;
            });
        }
    }
}