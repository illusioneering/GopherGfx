# GopherGfx

GopherGfx is a high-level scene graph library written in TypeScript and WebGL2.  It was written by [Evan Suma Rosenberg](https://illusioneering.cs.umn.edu/) for teaching [CSCI 4611: Programming Interactive Computer Graphics and Games](https://csci-4611-spring-2023.github.io/) at the University of Minnesota.

For more information, please see the [online documentation](https://illusioneering.github.io/GopherGfx/).

## API by Topic

### Main Application Class
* {@link GfxApp}

### Scene and WebGL Abstraction
* {@link Scene}
* {@link Node2}
* {@link Node3}
* {@link Camera}
* {@link Renderer}

### Geometry
2D:
* {@link Geometry2Factory}
* {@link Line2}
* {@link Mesh2}
* {@link Particles2}

3D:
* {@link Geometry3Factory}
* {@link Line3}
* {@link Mesh3}
* {@link MorphMesh3}

### Color, Materials, Lighting, and Shading
Base:
* {@link Color}
* {@link Texture}
* {@link Text}
* {@link Material2}
* {@link Material3}
* {@link ShaderProgram}

Specific Materials:
* {@link UnlitMaterial}
* {@link WireframeMaterial}
* {@link GouraudMaterial}
* {@link PhongMaterial}
* {@link MorphMaterial}
* {@link BoundingVolumeMaterial}

Lighting:
* {@link LightManager}
* {@link Light}
* {@link AmbientLight}
* {@link DirectionalLight}
* {@link PointLight}

### Graphics Math
Base:
* {@link Vector2}
* {@link Vector3}
* {@link Matrix3}
* {@link Matrix4}
* {@link Quaternion}
* {@link MathUtils}

Additional:
* {@link Ray3}
* {@link Plane3}
* {@link BoundingBox2}
* {@link BoundingBox3}
* {@link BoundingCircle}
* {@link BoundingSphere}
* {@link CurvePath2}
* {@link CurvePath3}
* {@link LinearPath2}
* {@link LinearPath3}

### Interaction
* {@link FirstPersonControls}
* {@link OrbitControls}
* {@link TransformWidget}

### Assets and Loaders
* {@link AssetManager}
* {@link MeshLoader}
* {@link MeshParser}
* {@link MeshWriter}
* {@link TextFileLoader}
* {@link StringParser}
* {@link FileWriter}


## License

This work is licensed under a [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-nc-sa/4.0/).