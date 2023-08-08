import { Camera } from '../core/Camera';
import { Vector3 } from '../math/Vector3';
import { Quaternion } from '../math/Quaternion';
import { Vector2 } from '../math/Vector2';

export class FirstPersonControls
{
    public camera: Camera;
    
    public translationSpeed: number;
    public rotationSpeed: number;
    public mouseButton: number;
    public flyMode: boolean;
    public hasMoved: boolean;

    // Camera parameters
    private moveDirection: Vector3;
    private rotationDirection: Vector3;
    private mouseDrag: boolean;
    private mouseMovement: Vector2;

    private targetOrbitX: Quaternion;
    private targetOrbitY: Quaternion;

/**
 * Constructs an instance of the FirstPersonControls class.
 * 
 * @param camera - The camera object to use with the controls
 */    
    constructor(camera: Camera)
    {
        this.camera = camera;

        this.mouseButton = 0;
        this.translationSpeed = 2;
        this.rotationSpeed = Math.PI / 4;
        this.flyMode = true;
        this.hasMoved = false;

        this.moveDirection = new Vector3();
        this.rotationDirection = new Vector3();
        this.mouseDrag = false;
        this.mouseMovement = new Vector2();

        this.targetOrbitX = new Quaternion();
        this.targetOrbitY = new Quaternion();

        window.addEventListener('mousedown', (event: MouseEvent) => {this.onMouseDown(event)});
        window.addEventListener('mouseup', (event: MouseEvent) => {this.onMouseUp(event)});
        window.addEventListener('mousemove', (event: MouseEvent) => {this.onMouseMove(event)});
        window.addEventListener('keydown', (event: KeyboardEvent) => {this.onKeyDown(event)});
        window.addEventListener('keyup', (event: KeyboardEvent) => {this.onKeyUp(event)});  
    }

/**
 * Handles the mousedown event, setting a flag to indicate that the mouse is being dragged.
 * 
 * @param event - The mouse event object
 */
    onMouseDown(event: MouseEvent): void 
    {
        if(this.mouseButton == event.button && (event.target! as Element).localName == "canvas")
            this.mouseDrag = true;
    }

/**
 * Handles the mouseup event, setting a flag to indicate that the mouse is no longer being dragged.
 * 
 * @param event - The mouse event object
 */
    onMouseUp(event: MouseEvent): void
    {
        if(this.mouseButton == event.button)
            this.mouseDrag = false;
    }

/**
 * Handles the mousemove event, updating the mouseMovement vector with the movement of the mouse.
 * 
 * @param event - The mouse event object
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
 * Handles the keydown event, updating the moveDirection vector based on the key pressed.
 * 
 * @param event - The keyboard event object
 */
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

/**
 * Handles the keyup event, updating the moveDirection vector based on the key released.
 * 
 * @param event - The keyboard event object
 */    
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

/**
 * Updates the FirstPersonControls object
 * 
 * @param deltaTime - The amount of time since the last update
 */
    update(deltaTime: number): void
    {
        this.rotationDirection.x += this.mouseMovement.x;
        this.rotationDirection.y += this.mouseMovement.y;
        this.mouseMovement.x = 0;
        this.mouseMovement.y = 0;

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
        if(this.moveDirection.length() == 0)
        {
            this.hasMoved = false;
        }
        else
        {
            const moveDirectionNormalized = Vector3.normalize(this.moveDirection);
            if(this.flyMode)
            {
                moveDirectionNormalized.multiplyScalar(this.translationSpeed * deltaTime);
                const translation = Vector3.rotate(moveDirectionNormalized, this.camera.rotation);
                this.camera.position.add(translation);
            }
            else
            {
                const translation = Vector3.rotate(moveDirectionNormalized, this.camera.rotation);
                translation.y = 0;
                translation.normalize();
                translation.multiplyScalar(this.translationSpeed * deltaTime);
                this.camera.position.add(translation);
            }
            this.hasMoved = true;
        }
    }

/**
 * Freezes the FirstPersonControls object
 */
    freeze(): void
    {
        this.mouseDrag = false;
        this.mouseMovement.x = 0;
        this.mouseMovement.y = 0;
        this.moveDirection.set(0, 0, 0);
    }
}