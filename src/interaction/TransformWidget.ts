import { GfxApp } from '../core/GfxApp';
import { Node3 } from '../core/Node3';
import { Geometry3Factory } from '../geometry/Geometry3Factory';
import { Line3 } from '../geometry/3d/Line3';
import { Mesh3 } from '../geometry/3d/Mesh3';
import { UnlitMaterial } from '../materials/UnlitMaterial';
import { Color } from '../math/Color';
import { Plane3 } from '../math/Plane3';
import { Ray } from '../math/Ray3'
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';

export class TransformWidget extends Node3
{
    public axes: Line3;
    public thickAxes: Mesh3[];
    
    private deviceCoords: Vector2;
    private currentAxis: number;
    private selectionPoint: Vector3;

    /**
 * Constructor for the TransformWidget class
 * 
 * @param lineLength - The length of each line in the axes, default = 1 
 * @param selectionWidth - The width of each selected axis line
 * @param triggerDistance - The maximum distance from the axis line that can trigger selection
 */
    constructor(lineLength = 1, selectionWidth = 0.01, triggerDistance = 0.05)
    {
        super();

        this.currentAxis = -1;
        this.deviceCoords = new Vector2();
        this.selectionPoint = new Vector3();

        this.axes = Geometry3Factory.createAxes(lineLength);
        this.add(this.axes);

        this.thickAxes = [];
        this.thickAxes.push(Geometry3Factory.createBox(lineLength, selectionWidth, selectionWidth));
        this.thickAxes.push(Geometry3Factory.createBox(selectionWidth, lineLength, selectionWidth));
        this.thickAxes.push(Geometry3Factory.createBox(selectionWidth, selectionWidth, lineLength));

        this.thickAxes[0].setPositionXYZ(lineLength/2, 0, 0);
        this.thickAxes[1].setPositionXYZ(0, lineLength/2, 0);
        this.thickAxes[2].setPositionXYZ(0, 0, lineLength/2);

        this.thickAxes[0].material = new UnlitMaterial();
        this.thickAxes[1].material = new UnlitMaterial();
        this.thickAxes[2].material = new UnlitMaterial();

        this.thickAxes[0].material.setColor(new Color(1, 0, 0));
        this.thickAxes[1].material.setColor(new Color(0, 1, 0));
        this.thickAxes[2].material.setColor(new Color(0, 0, 1));

        this.thickAxes[0].boundingBox.max.y = triggerDistance;
        this.thickAxes[0].boundingBox.max.z = triggerDistance;

        this.thickAxes[1].boundingBox.max.x = triggerDistance;
        this.thickAxes[1].boundingBox.max.z = triggerDistance;

        this.thickAxes[2].boundingBox.max.x = triggerDistance;
        this.thickAxes[2].boundingBox.max.y = triggerDistance;

        this.add(this.thickAxes[0]);
        this.add(this.thickAxes[1]);
        this.add(this.thickAxes[2]);

        window.addEventListener('mousedown', (event: MouseEvent) => {this.onMouseDown(event)});
        window.addEventListener('mouseup', (event: MouseEvent) => {this.onMouseUp(event)});
        window.addEventListener('mousemove', (event: MouseEvent) => {this.onMouseMove(event)});
    }

/**
 * Updates the TransformWidget based on the deltaTime value
 *
 * @param deltaTime - The amount of time that has passed since the last update
 */
    update(deltaTime: number): void
    {
        const ray = new Ray();
        ray.setPickRay(this.deviceCoords, GfxApp.getInstance().camera);

        if(this.currentAxis == -1)
        {
            this.thickAxes[0].visible = false;
            this.thickAxes[1].visible = false;
            this.thickAxes[2].visible = false;
            
            if(ray.intersectsOrientedBoundingBox(this.thickAxes[0]))
            {
                this.thickAxes[0].visible = true;
            }
            else if(ray.intersectsOrientedBoundingBox(this.thickAxes[1]))
            {
                this.thickAxes[1].visible = true;
            }
            else if(ray.intersectsOrientedBoundingBox(this.thickAxes[2]))
            {
                this.thickAxes[2].visible = true;
            }
        }
        else if(this.currentAxis == 0)
        {
            const worldPosition = GfxApp.getInstance().camera.getWorldMatrix().getTranslation();
            const projectedPosition = ray.intersectsPlane(new Plane3(Vector3.ZERO, new Vector3(0, worldPosition.y, worldPosition.z)));
            if(projectedPosition)
            {
                this.translateX(projectedPosition.x - this.selectionPoint.x);
                this.selectionPoint = projectedPosition;
            }
        }
        else if(this.currentAxis == 1)
        {
            const worldPosition = GfxApp.getInstance().camera.getWorldMatrix().getTranslation();
            const projectedPosition = ray.intersectsPlane(new Plane3(Vector3.ZERO, new Vector3(worldPosition.x, 0, worldPosition.z)));
            if(projectedPosition)
            {
                this.translateY(projectedPosition.y - this.selectionPoint.y);
                this.selectionPoint = projectedPosition;
            }
        }
        else if(this.currentAxis == 2)
        {
            const worldPosition = GfxApp.getInstance().camera.getWorldMatrix().getTranslation();
            const projectedPosition = ray.intersectsPlane(new Plane3(Vector3.ZERO, new Vector3(worldPosition.x, worldPosition.y, 0)));
            if(projectedPosition)
            {
                this.translateZ(projectedPosition.z - this.selectionPoint.z);
                this.selectionPoint = projectedPosition;
            }
        }
    }

/**
 * Handles a mouse down event, checking for intersection with the thickAxes and setting currentAxis if one is found
 * 
 * @param event - The MouseEvent
 */
    onMouseDown(event: MouseEvent): void 
    {
        this.deviceCoords = GfxApp.getInstance().getNormalizedDeviceCoordinates(event.x, event.y);

        const ray = new Ray();
        ray.setPickRay( this.deviceCoords, GfxApp.getInstance().camera);

        if(this.currentAxis == -1)
        {
            if(ray.intersectsOrientedBoundingBox(this.thickAxes[0]))
            {
                const worldPosition = GfxApp.getInstance().camera.getWorldMatrix().getTranslation();
                const projectedPosition = ray.intersectsPlane(new Plane3(Vector3.ZERO, new Vector3(0, worldPosition.y, worldPosition.z)));

                if(projectedPosition)
                {
                    this.selectionPoint = projectedPosition;
                    this.currentAxis = 0;
                }

                return;
            }

            if(ray.intersectsOrientedBoundingBox(this.thickAxes[1]))
            {
                const worldPosition = GfxApp.getInstance().camera.getWorldMatrix().getTranslation();
                const projectedPosition = ray.intersectsPlane(new Plane3(Vector3.ZERO, new Vector3(worldPosition.x, 0, worldPosition.z)));
                if(projectedPosition)
                {
                    this.selectionPoint = projectedPosition;
                    this.currentAxis = 1;
                }

                return;
            }

            if(ray.intersectsOrientedBoundingBox(this.thickAxes[2]))
            {
                const worldPosition = GfxApp.getInstance().camera.getWorldMatrix().getTranslation();
                const projectedPosition = ray.intersectsPlane(new Plane3(Vector3.ZERO, new Vector3(worldPosition.x, worldPosition.y, 0)));

                if(projectedPosition)
                {
                    this.selectionPoint = projectedPosition;
                    this.currentAxis = 2;
                }

                return;
            }
        }
    }

/**
 * Handles a mouse up event, resetting the currentAxis
 * 
 * @param event - The MouseEvent
 */    
    onMouseUp(event: MouseEvent): void
    {
        this.currentAxis = -1;
    }
    
/**
 * Handles a mouse move event, updating the deviceCoords
 * 
 * @param event - The MouseEvent
 */
    onMouseMove(event: MouseEvent): void
    {
        this.deviceCoords = GfxApp.getInstance().getNormalizedDeviceCoordinates(event.x, event.y);
    }

/**
 * Checks if the TransformWidget is currently selected
 * 
 * @returns True if the TransformWidget is selected, false otherwise
 */
    isSelected(): boolean
    {
        return this.currentAxis >= 0;
    }
}