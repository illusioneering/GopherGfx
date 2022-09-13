import { Camera } from "./Camera";
import { Transform2 } from "./Transform2";
import { Transform3 } from "./Transform3";
import { LightManager } from "../lights/LightManager";

export class Scene
{
    public root3d: Transform3;
    public root2d: Transform2;
    private lightManager: LightManager;
    
    constructor()
    {
        this.root3d = new Transform3();
        this.root2d = new Transform2();
        this.lightManager = new LightManager();
    }

    draw(camera: Camera): void
    {
        // Make sure the camera world transform is computed
        camera.computeWorldTransform();

        // Compute the world transforms for all objects in the scene graph
        this.computeWorldTransforms();

        // Update the scene lights
        this.lightManager.clear();
        this.root3d.setLights(this.lightManager);
        this.lightManager.updateLights();

        this.root3d.children.forEach((elem: Transform3) => {
            elem.draw(this.root3d, camera, this.lightManager);
        });

        this.root2d.children.forEach((elem: Transform2) => {
            elem.draw(this.root2d);
        });
    }

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

    computeWorldTransforms(): void
    {
        this.root3d.children.forEach((elem: Transform3) => {
            elem.computeWorldTransform();
        });

        this.root2d.children.forEach((elem: Transform2) => {
            elem.computeWorldTransform();
        });
    }
}