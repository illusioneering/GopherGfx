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

    setTargetPoint(targetPoint: Vector3): void
    {
        this.targetPoint.copy(targetPoint);
        this.updateCamera();
    }

    setDistance(distance: number): void
    {
        this.distance = distance;
        this.updateCamera();
    }

    setOrbit(orbitX: number, orbitY: number): void
    {
        this.cameraOrbitX.setRotationX(orbitX);
        this.cameraOrbitY.setRotationY(orbitY);
        this.updateCamera();
    }

    onMouseDown(event: MouseEvent): void 
    {
        if(this.mouseButton == event.button && (event.target! as Element).localName == "canvas")
            this.mouseDrag = true;
    }

    onMouseUp(event: MouseEvent): void
    {
        if(this.mouseButton == event.button)
            this.mouseDrag = false;
    }
    
    onMouseMove(event: MouseEvent): void
    {
        if(this.mouseDrag)
        {
            this.mouseMovement.x = -event.movementY;
            this.mouseMovement.y = -event.movementX;
        }
    }

    onMouseWheel(event: WheelEvent): void 
    {
        if(this.zoomable)
        {
            this.zoomDirection += event.deltaY;
        }
    }

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

    private updateCamera(): void 
    {
        this.camera.rotation.copy(this.cameraOrbitY);
        this.camera.rotation.multiply(this.cameraOrbitX);

        this.camera.position.set(0, 0, this.distance);
        this.camera.position.rotate(this.camera.rotation);
        this.camera.position.add(this.targetPoint);
    }

    freeze(): void
    {
        this.mouseDrag = false;
        this.mouseMovement.set(0, 0);
        this.zoomDirection = 0;
    }
}