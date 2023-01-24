# GopherGfx

GopherGfx is a high-level scene graph library written in TypeScript and WebGL2.  It was written by [Evan Suma Rosenberg](https://illusioneering.cs.umn.edu/) for teaching [CSCI 4611: Programming Interactive Computer Graphics and Games](https://csci-4611-spring-2023.github.io/) at the University of Minnesota.

For more information, please see the [online documentation](https://illusioneering.github.io/GopherGfx/).

## To Do (for TAs)

The following classes still need documentation.  Please delete them from this list as they are completed.

```
src\core\Transform3.ts
src\geometry\3d\Axes3.ts
src\geometry\3d\BoxMesh.ts
src\geometry\3d\ConeMesh.ts
src\geometry\3d\CylinderMesh.ts
src\geometry\3d\Line3.ts
src\geometry\3d\Mesh.ts
src\geometry\3d\MeshInstance.ts
src\geometry\3d\PlaneMesh.ts
src\geometry\3d\SphereMesh.ts
src\interaction\FirstPersonControls.ts
src\interaction\OrbitControls.ts
src\interaction\TransformWidget.ts
src\lights\AmbientLight.ts
src\lights\DirectionalLight.ts
src\lights\Light.ts
src\lights\LightManager.ts
src\lights\PointLight.ts
src\loaders\AssetManager.ts
src\loaders\ObjLoader.ts
src\loaders\StringParser.ts
src\loaders\TextFileLoader.ts
src\materials\BoundingVolumeMaterial.ts
src\materials\GouraudMaterial.ts
src\materials\LineMaterial.ts
src\materials\Material3.ts
src\materials\MorphMaterial.ts
src\materials\PhongMaterial.ts
src\materials\ShaderProgram.ts
src\materials\Text.ts
src\materials\UnlitMaterial.ts
src\materials\WireframeMaterial.ts
src\math\BoundingBox3.ts
src\math\LinearPath3.ts
src\math\Matrix4.ts
```

## Documentation Workflow

1. Go to https://beta.openai.com/playground.  Note that you will need to create an OpenAI account if you have not already been messing around with ChatGPT.
2. Set the maximum length of the query to 2048.  All other parameters can be left with their default values.
3. Enter the following query, replacing INSERT_CLASS_HERE with the name of the class.

```
Use the following format for writing TypeScript comments:

        /**
         * Computes the distance between two Vector3 objects
         * 
         * @param v1 - The first Vector3 object
         * @param v2 - The second Vector3 object
         * @returns The distance between the two input vectors
         */

Write comments for the following methods of the INSERT_CLASS_HERE class.  You don't need to include the original code.
```

3. Copy and paste several methods from the class after the query template.  In my experience, batching about 4-5 methods seems to work well.  After that it may run out of tokens or produce errors, but it depends on the total combined length of both the input and response.
4. Submit the query.
5. Copy and paste the generated comments above the header for each method.
6. If you notice any obvious errors or opportunities for clarification, feel free to make edits or additions.  (But don't worry too much, I will go through all the AI-generated comments before we push this out to students.)

## License

This work is licensed under a [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-nc-sa/4.0/).