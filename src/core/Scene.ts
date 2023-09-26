import { Camera } from "./Camera";
import { Node2 } from "./Node2";
import { Node3 } from "./Node3";
import { LightManager } from "../lights/LightManager";

/**
 * The Scene class contains and organizes all of the 2D and 3D objects that GopherGfx can draw each frame.
 * In computer graphics, the classic way to organize all these objects is in a graph data structure called
 * a "scene graph".  This Scene class actually contains two such scene graphs, one for all the 2D objects in
 * the scene and one for all the 3D objects in the scene.  Each scene graph follows a tree structure with
 * one root node (see root2d and root3d), and every object in the scene needs to be added to one of these
 * root nodes, either as a direct child of the root node or a child of a child, or child of a child of a child,
 * etc.
 * 
 * For the 2D scene graph the base class for every object that can be added to the scene graph is Node2.  If
 * you look at the Node2 class, you will see every Node2 has a postion, rotation, scale, and a number of other
 * properties.
 * 
 * For the 3D scene graph the base class for every object is Node3.  Again, each Node3 has a position, rotation,
 * scale, etc.  It is possible to create Node3s directly, and the main reason for this would be to setup a 
 * hierarchy of nodes in the scenegraph, for example
 * ```
 *    // add a node for the parent of a car geometry to the scene
 *    const carParentNode = new Node3();
 *    this.scene.add(carParentNode);
 * 
 *    // add child nodes to the carParentNode
 *    const wheels = new Node3();
 *    carParentNode.add(wheels);
 *    const doors = new Node3();
 *    carParentNode.add(doors);
 * ```
 * 
 * If you don't need a complex hierarchy, you may never deal directly with a Node3 and instead
 * just work with subclasses of Node3, like Mesh3 and PointLight.  In the car example above, none of
 * the Node3s that have been added so far actually draw anything because none of them are meshes.  They
 * are just there for organization.  A next step in creating the car would be to add 4 cylinders Mesh3s
 * under the wheels node, for example:
 * ```
 *    const leftFrontWheel = gfx.Geometry3Factory.createCylinder(..);
 *    wheels.add(leftFrontWheel);
 *    const leftBackWheel = gfx.Geometry3Factory.createCylinder(..);
 *    wheels.add(leftBackWheel);
 *    const rightFrontWheel = gfx.Geometry3Factory.createCylinder(..);
 *    wheels.add(rightFrontWheel);
 *    const rightBackWheel = gfx.Geometry3Factory.createCylinder(..);
 *    wheels.add(rightBackWheel);
 * ```
 * 
 * There are several benefits to using a hierarchy like this to organize our Meshes.  If we want to reposition
 * the entire car in the scene, then we can change the position of the carParentNode and all of the wheels, doors,
 * etc, will move because they are all children of the carParentNode.  We may also want to loop through all of
 * the wheels of the car, for example, to make them spin, and we can do this by looping through all of the
 * children of the "wheels" node.
 * 
 * ```
 *    for (let i=0; i<wheels.children.length; i++) {
 *       // note that wheels.children is an Array of Node3s, so accessing wheels.children[i] will give you a Node3
 *       childNode: gfx.Node3 = wheels.children[i];
 *       // that is great if all we want to do is rotate the wheels becuase rotation is a property of every Node3
 *       childNode.rotation.multiply(Quaternion.makeRotationX(deltaTime * angularVel));
 * 
 *       // in this case, we know that wheels.children[i] is also a Mesh3. if we want to change something about
 *       // the mesh, we must first cast wheels.children[i] to a Mesh3 using the keyword "as".
 *       childNodeAsMesh: gfx.Mesh3 = wheels.children[i] as gfx.Mesh3;
 *       if (childNodeAsMesh instanceof gfx.Mesh3) {
 *          // the cast to a Mesh3 succeeded and we can now access any properties of the Mesh3
 *          childNodeAsMesh.material.setColor(..);
 *       }
 *    }
 * ```
 */
export class Scene
{
    /**
     * The root node for all 3D elements in the scene.
     */
    public root3d: Node3;

    /**
     * The root node for all 2D elements in the scene.
     */
    public root2d: Node2;

    /**
     * Manager for updating the lights in the scene.
     */
    private lightManager: LightManager;
    
    constructor()
    {
        this.root3d = new Node3();
        this.root2d = new Node2();
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

        this.root3d.children.forEach((elem: Node3) => {
            elem.draw(this.root3d, camera, this.lightManager);
        });

        this.root2d.children.forEach((elem: Node2) => {
            elem.draw();
        });
    }

    /**
     * Adds a child element to the scene, either as a Node3 or a Node2.
     * @param child - The child element to add to the scene.
     */
    add(child: Node2 | Node3): void
    {
        if(child instanceof Node3)
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
        this.root3d.children.forEach((elem: Node3) => {
            elem.traverseSceneGraph();
        });

        this.root2d.children.forEach((elem: Node2) => {
            elem.traverseSceneGraph();
        });
    }
}