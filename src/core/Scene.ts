import { Camera } from "./Camera";
import { Transform2 } from "./Transform2";
import { Transform3 } from "./Transform3";
import { LightManager } from "../lights/LightManager";

/**
 * The Scene class represents a container for 3D and 2D objects.
 */
export class Scene
{
    /**
     * The root node for all 3D elements in the scene.
     */
    public root3d: Transform3;

    /**
     * The root node for all 2D elements in the scene.
     */
    public root2d: Transform2;

    /**
     * Manager for updating the lights in the scene.
     */
    private lightManager: LightManager;
    
    constructor()
    {
        this.root3d = new Transform3();
        this.root2d = new Transform2();
        this.lightManager = new LightManager();
    }

    /**
     * Draws the scene by updating the camera's world transform, updating the lights, and drawing the 3D and 2D elements.
     * @param camera - The camera used to draw the scene.
     */
    draw(camera: Camera): void
    {
        // Make sure the camera world transform is computed
        camera.updateWorldMatrix();

        // Update the scene lights
        this.lightManager.clear();
        this.root3d.setLights(this.lightManager);
        this.lightManager.updateLights();

        this.root3d.children.forEach((elem: Transform3) => {
            elem.draw(this.root3d, camera, this.lightManager);
        });

        this.root2d.children.forEach((elem: Transform2) => {
            elem.draw();
        });
    }

    /**
     * Adds a child element to the scene, either as a Transform3 or a Transform2.
     * @param child - The child element to add to the scene.
     */
    add(child: Transform2 | Transform3): void
    {
        if(child instanceof Transform3)
        {
            this.root3d.add(child);
        }
        else
        {
            this.root2d.add(child);
        }
    }

    /**
     * Traverses the 3D and 2D elements of the scene, recursively calling the `traverseSceneGraph()` method on each element.
     */
    traverseSceneGraph(): void
    {
        this.root3d.children.forEach((elem: Transform3) => {
            elem.traverseSceneGraph();
        });

        this.root2d.children.forEach((elem: Transform2) => {
            elem.traverseSceneGraph();
        });
    }
}