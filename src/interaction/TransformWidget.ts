import { GfxApp } from '../core/GfxApp';
import { Node3 } from '../core/Node3';
import { Geometry3Factory } from '../geometry/Geometry3Factory';
import { Line3 } from '../geometry/3d/Line3';
import { Mesh3 } from '../geometry/3d/Mesh3';
import { UnlitMaterial } from '../materials/UnlitMaterial';
import { Color } from '../math/Color';
import { Plane3 } from '../math/Plane3';
import { Ray3 } from '../math/Ray3'
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';

export class TransformWidget extends Node3
{
    public axes: Line3;
    public thickAxes: Mesh3[];
    
    private deviceCoords: Vector2;
    private currentAxis: number;
    private selectionPlane: Plane3;

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
        this.selectionPlane = new Plane3();

        this.axes = Geometry3Factory.createAxes(lineLength);
        this.add(this.axes);

        this.thickAxes = [];
        this.thickAxes.push(Geometry3Factory.createBox(lineLength, selectionWidth, selectionWidth));
        this.thickAxes.push(Geometry3Factory.createBox(selectionWidth, lineLength, selectionWidth));
        this.thickAxes.push(Geometry3Factory.createBox(selectionWidth, selectionWidth, lineLength));

        this.thickAxes[0].position.set(lineLength/2, 0, 0);
        this.thickAxes[1].position.set(0, lineLength/2, 0);
        this.thickAxes[2].position.set(0, 0, lineLength/2);

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
        const ray = new Ray3();
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
            const projectedPosition = ray.intersectsPlane(this.selectionPlane);
            if(projectedPosition)
            {
                const translation = new Vector3(projectedPosition.x - this.selectionPlane.point.x, 0, 0);
                translation.rotate(this.rotation);
                this.position.add(translation);
                this.selectionPlane.point = projectedPosition;
            }
        }
        else if(this.currentAxis == 1)
        {
            const projectedPosition = ray.intersectsPlane(this.selectionPlane);
            if(projectedPosition)
            {
                const translation = new Vector3(0, projectedPosition.y - this.selectionPlane.point.y, 0);
                translation.rotate(this.rotation);
                this.position.add(translation);
                this.selectionPlane.point = projectedPosition;
            }
        }
        else if(this.currentAxis == 2)
        {
            const projectedPosition = ray.intersectsPlane(this.selectionPlane);
            if(projectedPosition)
            {
                const translation = new Vector3(0, 0, projectedPosition.z - this.selectionPlane.point.z);
                translation.rotate(this.rotation);
                this.position.add(translation);
                this.selectionPlane.point = projectedPosition;
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

        const ray = new Ray3();
        ray.setPickRay( this.deviceCoords, GfxApp.getInstance().camera);

        if(this.currentAxis == -1)
        {
            const xAxisPosition = ray.intersectsOrientedBoundingBox(this.thickAxes[0]);
            if(xAxisPosition)
            {
                this.selectionPlane.point = xAxisPosition;
                this.selectionPlane.normal = this.rotation.rotate(new Vector3(0, 0, 1));
                this.currentAxis = 0;
                return;
            }

            const yAxisPosition = ray.intersectsOrientedBoundingBox(this.thickAxes[1]);
            if(yAxisPosition)
            {
                this.selectionPlane.point = yAxisPosition;
                this.selectionPlane.normal = this.rotation.rotate(new Vector3(0, 0, 1));
                this.currentAxis = 1;
                return;
            }

            const zAxisPosition = ray.intersectsOrientedBoundingBox(this.thickAxes[2]);
            if(zAxisPosition)
            {
                this.selectionPlane.point = zAxisPosition;
                this.selectionPlane.normal = this.rotation.rotate(new Vector3(1, 0, 0));
                this.currentAxis = 2;
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