import { Camera } from '../core/Camera';
import { Quaternion } from '../math/Quaternion';
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';

export class OrbitControls
{
    public camera: Camera;
    public zoomable: boolean;
    public rotationSpeedX: number;
    public rotationSpeedY: number;
    public zoomSpeed: number;
    public mouseButton: number;

    // Camera parameters
    private targetPoint: Vector3;
    private distance: number;
    private cameraOrbitX: Quaternion;
    private cameraOrbitY: Quaternion;
    private rotationDirection: Vector3;
    private zoomDirection: number;
    private mouseDrag: boolean;
    private mouseMovement: Vector2;

/**
 * Constructs an instance of the OrbitControls class
 * 
 * @param camera - The camera to be controlled by the OrbitControls object
 * @param distance - The distance of the camera from the target point
 * @param zoomable - Flag indicating whether the camera should be able to zoom
 */
    constructor(camera: Camera, distance = 1, zoomable = true)
    {
        this.camera = camera;
        this.zoomable = zoomable;
        this.distance = distance;

        this.rotationSpeedX = Math.PI / 4;
        this.rotationSpeedY = Math.PI / 4;
        this.zoomSpeed = .25;
        this.mouseButton = 0;

        this.targetPoint = new Vector3();
        this.cameraOrbitX = new Quaternion();
        this.cameraOrbitY = new Quaternion();
        this.rotationDirection = new Vector3();
        this.zoomDirection = 0;
        this.mouseDrag = false;
        this.mouseMovement = new Vector2();

        window.addEventListener('mousedown', (event: MouseEvent) => {this.onMouseDown(event)});
        window.addEventListener('mouseup', (event: MouseEvent) => {this.onMouseUp(event)});
        window.addEventListener('mousemove', (event: MouseEvent) => {this.onMouseMove(event)});
        window.addEventListener('wheel', (event: WheelEvent) => {this.onMouseWheel(event)});

        this.updateCamera();
    }

/**
 * Sets the target point which the camera will orbit around
 * 
 * @param targetPoint - The point around which the camera will orbit 
 */
    setTargetPoint(targetPoint: Vector3): void
    {
        this.targetPoint.copy(targetPoint);
        this.updateCamera();
    }

/**
 * Sets the distance of the camera from the target point
 * 
 * @param distance - The distance of the camera from the target point
 */
    setDistance(distance: number): void
    {
        this.distance = distance;
        this.updateCamera();
    }

/**
 * Sets the rotation angles of the camera around the target point
 * 
 * @param orbitX - The rotation angle around the horizontal axis
 * @param orbitY - The rotation angle around the vertical axis
 */
    setOrbit(orbitX: number, orbitY: number): void
    {
        this.cameraOrbitX.setRotationX(orbitX);
        this.cameraOrbitY.setRotationY(orbitY);
        this.updateCamera();
    }

/**
 * Listens for mouse down events and sets the mouse drag flag to true if necessary
 * 
 * @param event - The mouse down event
 */    
    onMouseDown(event: MouseEvent): void 
    {
        if(this.mouseButton == event.button && (event.target! as Element).localName == "canvas")
            this.mouseDrag = true;
    }

/**
 * Listens for mouse up events and sets the mouse drag flag to false 
 * 
 * @param event - The mouse up event
 */      
    onMouseUp(event: MouseEvent): void
    {
        if(this.mouseButton == event.button)
            this.mouseDrag = false;
    }

    
/**
 * onMouseMove updates the mouseMovement vector with the movementX and movementY properties of the mouse event
 * 
 * @param event - The mouse event
 */
    onMouseMove(event: MouseEvent): void
    {
        if(this.mouseDrag)
        {
            this.mouseMovement.x = -event.movementY;
            this.mouseMovement.y = -event.movementX;
        }
    }

/**
 * onMouseWheel updates the zoomDirection if the OrbitControls is zoomable
 * 
 * @param event - The mouse wheel event
 */    
    onMouseWheel(event: WheelEvent): void 
    {
        if(this.zoomable)
        {
            this.zoomDirection += event.deltaY;
        }
    }

/**
 * update updates the cameraOrbitX, cameraOrbitY and distance according to the mouse movement, 
 * rotation and zoom direction
 * 
 * @param deltaTime - The change in time since the last update
 */    
    update(deltaTime: number): void
    {
        this.rotationDirection.x += this.mouseMovement.x;
        this.rotationDirection.y += this.mouseMovement.y;
        this.mouseMovement.x = 0;
        this.mouseMovement.y = 0;

        this.cameraOrbitX.multiply(Quaternion.makeRotationX(this.rotationDirection.x * this.rotationSpeedX * deltaTime));
        this.cameraOrbitY.multiply(Quaternion.makeRotationY(this.rotationDirection.y * this.rotationSpeedY * deltaTime));
        this.distance += this.zoomDirection * this.zoomSpeed * deltaTime;

        // Reset the cumulative parameters
        this.rotationDirection.set(0, 0, 0);
        this.zoomDirection = 0;

        this.updateCamera();
    }

/**
 * Updates the camera's rotation and position based on OrbitControls' current state
 */
    private updateCamera(): void 
    {
        this.camera.rotation.copy(this.cameraOrbitY);
        this.camera.rotation.multiply(this.cameraOrbitX);
        this.camera.position.set(0, 0, this.distance);
        this.camera.position.rotate(this.camera.rotation);
        this.camera.position.add(this.targetPoint);

    }

/**
 * Freezes the camera's rotation, position, and zoom
 */
    freeze(): void
    {
        this.mouseDrag = false;
        this.mouseMovement.set(0, 0);
        this.zoomDirection = 0;
    }
}