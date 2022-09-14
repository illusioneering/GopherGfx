import { Renderer } from './Renderer'
import { Camera } from './Camera'
import { Scene } from './Scene';
import { Vector2 } from '../math/Vector2'
import { AssetManager } from '../loaders/AssetManager';

export abstract class GfxApp 
{
    private static instance: GfxApp;
    
    public static getInstance(): GfxApp
    {
        return GfxApp.instance;
    }

    public renderer: Renderer;
    public camera: Camera;
    public scene: Scene;
    public assetManager: AssetManager;
    public runInBackground: boolean;
    public waitForAssetLoading: boolean;

    private time: number;
    private paused: boolean;
    private previousTouches: Vector2[];

    constructor()
    {
        GfxApp.instance = this;

        this.time = Date.now();
        this.paused = false;

        this.camera = new Camera();
        this.scene = new Scene();
        this.renderer = new Renderer();
        this.assetManager = new AssetManager();
        this.runInBackground = false;
        this.waitForAssetLoading = true;

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
        window.addEventListener('contextmenu', event => event.preventDefault());

        // default orthographic camera
        this.camera.setOrthographicCamera(0, 1, 0, 1, 0.01, 1);
    }

    // Create the scene and enter the main loop
    start(): void 
    {
        if(this.waitForAssetLoading && !this.assetManager.allAssetsLoaded())
        {
            window.requestAnimationFrame(() => this.start());
        }
        else
        {
            this.createScene();
            this.mainLoop();
        }
    }

    // This starts the main loop of the game
    private mainLoop(): void
    {
        if(this.runInBackground || !this.paused)
        {
            // Update the app
            this.update((Date.now() - this.time) / 1000);
            this.time = Date.now();
        }

        // Draw the graphics
        this.renderer.render(this.scene, this.camera);

        // Run the main loop function on the next frame
        window.requestAnimationFrame(() => this.mainLoop());
    }

    // Resize the viewport
    resize(): void
    {
        this.renderer.resize(window.innerWidth, window.innerHeight, this.camera.getAspectRatio());
    }

    // Create a simulated mouse event for touch input
    onTouchStart(event: TouchEvent): void
    {
        event.preventDefault();
        if(event.touches.length == 1)
            this.simulateMouseEvent('mousedown', event);
    }

    // Create a simulated mouse event for touch input
    onTouchMove(event: TouchEvent): void
    {
        event.preventDefault();
        if(event.touches.length == 1)
            this.simulateMouseEvent('mousemove', event);
        else
            this.simulateWheelEvent(event);
    }

    // Create a simulated mouse event for touch input
    onTouchEnd(event: TouchEvent): void
    {
        event.preventDefault();
        if(event.touches.length == 1)
            this.simulateMouseEvent('mouseup', event);
    }

    onFocusReceived(event: FocusEvent): void 
    {
        this.resume();
    }

    onFocusLost(event: FocusEvent): void 
    {
        this.pause();
    }

    pause(): void
    {
        this.paused = true;
    }

    resume(): void
    {
        this.time = Date.now();
        this.paused = false;
    }

    isPaused(): boolean
    {
        return this.paused;
    }

    getNormalizedDeviceCoordinates(mouseX: number, mouseY: number): Vector2
    {
        return this.renderer.getNormalizedDeviceCoordinates(mouseX, mouseY);
    }

    private simulateMouseEvent(type: string, touchEvent: TouchEvent): void
    {
        if(this.previousTouches.length == 1)
        {
            const mouseEvent = new MouseEvent(type, {
                'button': 0,
                'clientX': touchEvent.touches[0].clientX, 
                'clientY': touchEvent.touches[0].clientY,
                'screenX': touchEvent.touches[0].screenX,
                'screenY': touchEvent.touches[0].screenY,
                'movementX': touchEvent.touches[0].clientX - this.previousTouches[0].x,
                'movementY': touchEvent.touches[0].clientY - this.previousTouches[0].y,
                'view': touchEvent.view,
                cancelable: true,
                bubbles: true,
            });

            touchEvent.target!.dispatchEvent(mouseEvent);
        }

        this.previousTouches = [ new Vector2(touchEvent.touches[0].clientX, touchEvent.touches[0].clientY) ];
    }

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

    // Your app should implement the following abstract methods
    abstract createScene(): void;
    abstract update(deltaTime: number): void;

    // Subclasses can override these methods to handle events
    onMouseDown(event: MouseEvent): void {}
    onMouseUp(event: MouseEvent): void {}
    onMouseMove(event: MouseEvent): void {}
    onMouseWheel(event: WheelEvent): void {}
    onKeyDown(event: KeyboardEvent): void {}
    onKeyUp(event: KeyboardEvent): void {}
}