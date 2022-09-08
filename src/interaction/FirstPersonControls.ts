import { Camera } from '../core/Camera';
import { Vector3 } from '../math/Vector3';
import { Quaternion } from '../math/Quaternion';

export class FirstPersonControls
{
    public camera: Camera;
    
    public translationSpeed: number;
    public rotationSpeed: number;

    // Camera parameters
    private moveDirection: Vector3;
    private rotationDirection: Vector3;
    private mouseDrag: boolean;

    private targetOrbitX: Quaternion;
    private targetOrbitY: Quaternion;

    constructor(camera: Camera)
    {
        this.camera = camera;

        this.translationSpeed = 2;
        this.rotationSpeed = Math.PI / 4;

        this.moveDirection = new Vector3();
        this.rotationDirection = new Vector3();
        this.mouseDrag = false;

        this.targetOrbitX = new Quaternion();
        this.targetOrbitY = new Quaternion();

        window.addEventListener('mousedown', (event: MouseEvent) => {this.onMouseDown(event)});
        window.addEventListener('mouseup', (event: MouseEvent) => {this.onMouseUp(event)});
        window.addEventListener('mousemove', (event: MouseEvent) => {this.onMouseMove(event)});
        window.addEventListener('keydown', (event: KeyboardEvent) => {this.onKeyDown(event)});
        window.addEventListener('keyup', (event: KeyboardEvent) => {this.onKeyUp(event)});  
    }


    onMouseDown(event: MouseEvent): void 
    {
        if((event.target! as Element).localName == "canvas")
            this.mouseDrag = true;
    }

    onMouseUp(event: MouseEvent): void
    {
        this.mouseDrag = false;
        this.rotationDirection.set(0, 0, 0);
    }
    
    onMouseMove(event: MouseEvent): void
    {
        if(this.mouseDrag)
        {
            this.rotationDirection.x += -event.movementY;
            this.rotationDirection.y += -event.movementX;
        }
    }

    onKeyDown(event: KeyboardEvent): void 
    {
        if(event.key == 'w')
        {
            this.moveDirection.z = -1;
        }
        else if(event.key == 's')
        {
            this.moveDirection.z = 1;
        }
        else if(event.key == 'a')
        {
            this.moveDirection.x = -1;
        }
        else if(event.key == 'd')
        {
            this.moveDirection.x = 1;
        }
    }

    onKeyUp(event: KeyboardEvent): void 
    {
        if(event.key == 'w' && this.moveDirection.z == -1)
        {
            this.moveDirection.z = 0;
        }
        if(event.key == 's' && this.moveDirection.z == 1)
        {
            this.moveDirection.z = 0;
        }
        else if(event.key == 'a' && this.moveDirection.x == -1)
        {
            this.moveDirection.x = 0;
        }
        else if(event.key == 'd' && this.moveDirection.x == 1)
        {
            this.moveDirection.x = 0;
        }
    }

    update(deltaTime: number): void
    {
        // Prevent the camera from rotating upside-down
        const newTargetOrbitX = Quaternion.multiply(this.targetOrbitX, Quaternion.makeRotationX(this.rotationDirection.x * this.rotationSpeed * deltaTime));
        const testVector = new Vector3(0, 0, -1);
        testVector.rotate(newTargetOrbitX);
        if(testVector.z < 0)
            this.targetOrbitX.copy(newTargetOrbitX);

        // Set the yaw target
        this.targetOrbitY.multiply(Quaternion.makeRotationY(this.rotationDirection.y * this.rotationSpeed * deltaTime));

        // Reset the cumulative rotation direction
        this.rotationDirection.set(0, 0, 0);
        
        // Compute the look target and aim the camera accordignly
        const target = new Vector3(0, 0, -1);
        target.rotate(this.targetOrbitX);
        target.rotate(this.targetOrbitY);
        target.add(this.camera.position);
        this.camera.lookAt(target, Vector3.UP);
        
        // Translate the camera based on the keyboard input
        const moveDirectionNormalized = Vector3.normalize(this.moveDirection);
        moveDirectionNormalized.multiplyScalar(this.translationSpeed * deltaTime);
        this.camera.translate(moveDirectionNormalized);
    }
}