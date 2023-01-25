import { Renderer } from './Renderer'
import { Camera } from './Camera'
import { Scene } from './Scene';
import { Vector2 } from '../math/Vector2'
import { AssetManager } from '../loaders/AssetManager';

/**
 * The base class for a GopherGfx application.
*/
export abstract class GfxApp 
{
    /**
     * The singleton instance of the GfxApp class.
     */
    private static instance: GfxApp;
    
    /**
     * Gets the singleton instance of the GfxApp class.
     * 
     * @returns The singleton instance of the GfxApp class.
     */
    public static getInstance(): GfxApp
    {
        return GfxApp.instance;
    }

    /**
     * The renderer used by the GfxApp instance.
     */
    public renderer: Renderer;

    /**
     * The camera used by the GfxApp instance.
     */
    public camera: Camera;

    /**
     * The scene used by the GfxApp instance.
     */
    public scene: Scene;

    /**
     * Coordinates asynchronous loading of external assets.
     */
    public assetManager: AssetManager;

    /**
     * A boolean indicating whether the GfxApp should continue to run in the background.
     */
    public runInBackground: boolean;

    /**
     * The current game time in seconds.
     */
    private time: number;

    /**
     * A boolean indicating whether the GfxApp is currently paused.
     */
    private paused: boolean;

    /**
     * An array of the previous touches on the touch screen.
     */
    private previousTouches: Vector2[];

    /**
     * Constructor for the GfxApp class
     * 
     * @param enableStencilBuffer - Boolean value to enable/disable the stencil buffer
     */
    constructor(enableStencilBuffer = false)
    {
        GfxApp.instance = this;

        this.time = Date.now();
        this.paused = false;

        this.camera = new Camera();
        this.scene = new Scene();
        this.renderer = new Renderer(enableStencilBuffer);
        this.assetManager = new AssetManager();
        this.runInBackground = false;

        this.previousTouches = [ new Vector2() ];
  
        // Register event handlers
        window.addEventListener('resize', () => {this.resize()}, false);
        window.addEventListener('mousedown', (event: MouseEvent) => {this.onMouseDown(event)});
        window.addEventListener('mouseup', (event: MouseEvent) => {this.onMouseUp(event)});
        window.addEventListener('mousemove', (event: MouseEvent) => {this.onMouseMove(event)});
        window.addEventListener('wheel', (event: WheelEvent) => {this.onMouseWheel(event)});
        window.addEventListener('keydown', (event: KeyboardEvent) => {this.onKeyDown(event)});
        window.addEventListener('keyup', (event: KeyboardEvent) => {this.onKeyUp(event)});  
        window.addEventListener('focus', (event: FocusEvent) => {this.onFocusReceived(event)});
        window.addEventListener('blur', (event: FocusEvent) => {this.onFocusLost(event)});
        window.addEventListener('touchstart', (event: TouchEvent) => {this.onTouchStart(event)}, {passive: false});
        window.addEventListener('touchmove', (event: TouchEvent) => {this.onTouchMove(event)}, {passive: false});
        window.addEventListener('touchend', (event: TouchEvent) => {this.onTouchEnd(event)}, {passive: false});
        window.addEventListener('touchcancel', (event: TouchEvent) => {this.onTouchEnd(event)}, {passive: false});
        window.addEventListener('contextmenu', event => event.preventDefault());

        // default orthographic camera
        this.camera.setOrthographicCamera(0, 1, 0, 1, 0.01, 1);
    }

    /**
     * Creates the scene and starts the program
     */
    start(): void 
    {
        this.createScene();
        this.initializationLoop();
    }

    /**
     * Initialization loop for loading assets before starting the main loop
     */
    private initializationLoop(): void
    {
        if(!this.assetManager.allAssetsLoaded())
        {
            window.requestAnimationFrame(() => this.initializationLoop());
        }
        else
        {
            this.onAssetsLoaded();
            this.time = Date.now();
            this.mainLoop();
        }
    }

    /**
     * Main loop for the GfxApp class
     * 
     * @param deltaTime - The time difference between frames for calculating updates
     */
    private mainLoop(): void
    {
        if(this.runInBackground || !this.paused)
        {
            // Compute the delta time
            const deltaTime =  (Date.now() - this.time) / 1000;

            // Update the time
            this.time = Date.now();

            // Update the app
            this.update(deltaTime);
            
            // Compute the world transforms for all objects in the scene graph
            this.scene.traverseSceneGraph();

            // Call the late update method
            this.lateUpdate(deltaTime);

            // Draw the graphics
            this.renderer.render(this.scene, this.camera);
        }

        // Run the main loop function on the next frame
        window.requestAnimationFrame(() => this.mainLoop());
    }

    /**
     * Resizes the viewport of the GfxApp
     */
    resize(): void
    {
        this.renderer.resize(window.innerWidth, window.innerHeight, this.camera.getAspectRatio());
    }

    /**
     * Creates a simulated mouse down event for touch input
     */
    onTouchStart(event: TouchEvent): void
    {
        event.preventDefault();
        if(event.touches.length == 1)
            this.simulateMouseEvent('mousedown', event);
    }

    /**
     * Creates a simulated mouse move event for touch input
     */
    onTouchMove(event: TouchEvent): void
    {
        event.preventDefault();
        if(event.touches.length == 1)
            this.simulateMouseEvent('mousemove', event);
        else
            this.simulateWheelEvent(event);
    }

    /**
     * Creates a simulated mouse up event for touch input
     */
    onTouchEnd(event: TouchEvent): void
    {
        event.preventDefault();
        if(event.touches.length == 0)
            this.simulateMouseEvent('mouseup', event);
    }

    /**
     * Handles focus events to pause and resume the application
     * 
     * @param event - The FocusEvent
     */
    onFocusReceived(event: FocusEvent): void 
    {
        this.resume();
    }

    /**
     * Handles focus events to pause and resume the application
     * 
     * @param event - The FocusEvent
     */
    onFocusLost(event: FocusEvent): void 
    {
        this.pause();
    }

    /**
     * Pauses the application
     */
    pause(): void
    {
        this.paused = true;
    }

    /**
     * Resumes the application
     */
    resume(): void
    {
        this.time = Date.now();
        this.paused = false;
    }

    /**
     * Returns true if the application is paused
     * 
     * @returns True if the application is paused, false otherwise
     */
    isPaused(): boolean
    {
        return this.paused;
    }

    /**
     * Converts mouse coordinates to normalized device coordinates
     * 
     * @param mouseX - The x coordinate of the mouse
     * @param mouseY - The y coordinate of the mouse
     * @returns The normalized device coordinates
     */
    getNormalizedDeviceCoordinates(mouseX: number, mouseY: number): Vector2
    {
        return this.renderer.getNormalizedDeviceCoordinates(mouseX, mouseY);
    }

    /**
     * Simulates a mouse event from a given TouchEvent
     * 
     * @param type - The type of mouse event to simulate
     * @param touchEvent - The touch event to use for simulating the mouse event
     */
    private simulateMouseEvent(type: string, touchEvent: TouchEvent): void
    {
        if(this.previousTouches.length == 1)
        {
            const mouseEvent = new MouseEvent(type, {
                'button': 0,
                'buttons': 1,
                'clientX': touchEvent.changedTouches[0].clientX, 
                'clientY': touchEvent.changedTouches[0].clientY,
                'screenX': touchEvent.changedTouches[0].screenX,
                'screenY': touchEvent.changedTouches[0].screenY,
                'movementX': touchEvent.changedTouches[0].clientX - this.previousTouches[0].x,
                'movementY': touchEvent.changedTouches[0].clientY - this.previousTouches[0].y,
                'view': touchEvent.view,
                cancelable: true,
                bubbles: true,
            });

            touchEvent.target!.dispatchEvent(mouseEvent);
        }

        this.previousTouches = [ new Vector2(touchEvent.changedTouches[0].clientX, touchEvent.changedTouches[0].clientY) ];
    }

    /**
     * Simulates a mouse wheel event from a given TouchEvent
     * 
     * @param touchEvent - The touch event to use for simulating the wheel event
     */
    private simulateWheelEvent(touchEvent: TouchEvent): void
    {
        if(this.previousTouches.length > 1)
        {
            const previousDistance = this.previousTouches[0].distanceTo(this.previousTouches[1]);
            const currentDistance = Math.sqrt(
                (touchEvent.touches[0].clientX -  touchEvent.touches[1].clientX) * (touchEvent.touches[0].clientX -  touchEvent.touches[1].clientX) +
                (touchEvent.touches[0].clientY -  touchEvent.touches[1].clientY) * (touchEvent.touches[0].clientY -  touchEvent.touches[1].clientY)
            );
            
            let scaleFactor = 0;
            if(currentDistance > previousDistance)
                scaleFactor = -currentDistance / previousDistance;
            else if(currentDistance < previousDistance)
                scaleFactor = previousDistance / currentDistance;

            const wheelEvent = new WheelEvent('wheel', {
                'clientX': (touchEvent.touches[0].clientX + touchEvent.touches[1].clientX) / 2, 
                'clientY': (touchEvent.touches[0].clientY + touchEvent.touches[1].clientY) / 2,
                'screenX': (touchEvent.touches[0].screenX + touchEvent.touches[1].screenX) / 2,
                'screenY': (touchEvent.touches[0].screenY + touchEvent.touches[1].screenY) / 2,
                'movementX': (
                    (touchEvent.touches[0].clientX - this.previousTouches[0].x) + 
                    (touchEvent.touches[1].clientX - this.previousTouches[1].x) ) / 2,
                'movementY': (
                    (touchEvent.touches[0].clientY - this.previousTouches[0].y) + 
                    (touchEvent.touches[1].clientY - this.previousTouches[1].y) ) / 2,
                'deltaX': 0,
                'deltaY': 50 * scaleFactor,
                'deltaZ': 0,
                'deltaMode': WheelEvent.DOM_DELTA_PIXEL,
                'view': touchEvent.view,
                cancelable: true,
                bubbles: true,
            });

            touchEvent.target!.dispatchEvent(wheelEvent);
        }  

        this.previousTouches = [];
        for(let i = 0; i < touchEvent.changedTouches.length; i++)
        {
            this.previousTouches.push(new Vector2(touchEvent.touches[i].clientX, touchEvent.touches[i].clientY));
        }   
    }

    /**
     * Abstract method to be implemented by any subclass of GfxApp.
     * Creates the scene for the application.
     */
    abstract createScene(): void;

    /**
     * Abstract method to be implemented by any subclass of GfxApp.
     * Updates the application's state with the given deltaTime.
     * 
     * @param deltaTime - Time elapsed since the last update call (in seconds)
     */
    abstract update(deltaTime: number): void;

    /**
     * Late update method to be called just before drawing the scene.
     * Optional method - subclasses do not need to override it.
     * 
     * @param deltaTime - Time elapsed since the last update call (in seconds)
     */
    lateUpdate(deltaTime: number): void {}

    /**
     * Method called after all assets are loaded before entering main loop.
     * Optional method - subclasses do not need to override it.
     */
    onAssetsLoaded(): void {}

    /**
     * Method called when the mouse is clicked. Subclasses can override this method to handle the event.
     * 
     * @param event - The MouseEvent object associated with the mouse click
     */
    onMouseDown(event: MouseEvent): void {}

    /**
     * Method called when the mouse is released. Subclasses can override this method to handle the event.
     * 
     * @param event - The MouseEvent object associated with the mouse release
     */
    onMouseUp(event: MouseEvent): void {}

    /**
     * Method called when the mouse is moved. Subclasses can override this method to handle the event.
     * 
     * @param event - The MouseEvent object associated with the mouse movement
     */
    onMouseMove(event: MouseEvent): void {}

    /**
     * Method called when the mouse wheel is moved. Subclasses can override this method to handle the event.
     * 
     * @param event - The WheelEvent object associated with the mouse wheel movement
     */
    onMouseWheel(event: WheelEvent): void {}

    /**
     * Method called when a key is pressed. Subclasses can override this method to handle the event.
     * 
     * @param event - The KeyboardEvent object associated with the key press
     */
    onKeyDown(event: KeyboardEvent): void {}

    /**
     * Method called when a key is released. Subclasses can override this method to handle the event.
     * 
     * @param event - The KeyboardEvent object associated with the key release
     */
    onKeyUp(event: KeyboardEvent): void {}
}