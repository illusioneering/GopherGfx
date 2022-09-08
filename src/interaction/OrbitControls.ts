import { Camera } from '../core/Camera';
import { Quaternion } from '../math/Quaternion';
import { Vector3 } from '../math/Vector3';

export class OrbitControls
{
    public camera: Camera;
    public zoomable: boolean;
    public rotationSpeed: number;
    public zoomSpeed: number;

    // Camera parameters
    private targetPoint: Vector3;
    private distance: number;
    private cameraOrbitX: Quaternion;
    private cameraOrbitY: Quaternion;
    private rotationDirection: Vector3;
    private zoomDirection: number;
    private mouseDrag: boolean;

    constructor(camera: Camera, distance = 1, zoomable = true)
    {
        this.camera = camera;
        this.zoomable = zoomable;
        this.distance = distance;

        this.rotationSpeed = Math.PI / 4;
        this.zoomSpeed = .25;

        this.targetPoint = new Vector3();
        this.cameraOrbitX = new Quaternion();
        this.cameraOrbitY = new Quaternion();
        this.rotationDirection = new Vector3();
        this.zoomDirection = 0;
        this.mouseDrag = false;

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
        if((event.target! as Element).localName == "canvas")
            this.mouseDrag = true;
    }

    onMouseUp(event: MouseEvent): void
    {
        this.mouseDrag = false;
    }
    
    onMouseMove(event: MouseEvent): void
    {
        if(this.mouseDrag)
        {
            this.rotationDirection.x += -event.movementY;
            this.rotationDirection.y += -event.movementX;
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
        this.cameraOrbitX.multiply(Quaternion.makeRotationX(this.rotationDirection.x * this.rotationSpeed * deltaTime));
        this.cameraOrbitY.multiply(Quaternion.makeRotationY(this.rotationDirection.y * this.rotationSpeed * deltaTime));
        this.distance += this.zoomDirection * this.zoomSpeed * deltaTime;

        // Reset the cumulative parameters
        this.rotationDirection.set(0, 0, 0);
        this.zoomDirection = 0;

        this.updateCamera();
    }

    private updateCamera(): void 
    {
        this.camera.rotation.copy(this.cameraOrbitX);
        this.camera.rotation.multiply(this.cameraOrbitY);

        this.camera.position.set(0, 0, this.distance);
        this.camera.position.rotate(this.camera.rotation);
        this.camera.position.add(this.targetPoint);
    }
}