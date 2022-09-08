export class ShaderProgram
{
    private vertexShader: WebGLShader | null;
    private fragmentShader: WebGLShader | null;
    private shaderProgram: WebGLProgram | null;
    private vertexSource: string;
    private fragmentSource: string;

    public initialized: boolean;

    constructor(vertexSource: string, fragmentSource: string)
    {
        this.vertexSource = vertexSource;
        this.fragmentSource = fragmentSource;
        this.vertexShader = null;
        this.fragmentShader = null;
        this.shaderProgram = null;
        this.initialized = false;
    }

    public initialize(gl: WebGL2RenderingContext): void 
    {
        if(this.initialized)
            return;

        this.initialized = true;

        this.vertexShader = this.createVertexShader(gl, this.vertexSource);
        this.fragmentShader = this.createFragmentShader(gl, this.fragmentSource);

        if(this.vertexShader && this.fragmentShader)
            this.shaderProgram = this.createShaderProgram(gl, this.vertexShader, this.fragmentShader); 
    }

    private createVertexShader(gl: WebGL2RenderingContext, source: string): WebGLShader | null 
    {
        const shader = gl.createShader(gl.VERTEX_SHADER);

        if(!shader)
        {
            console.error('Error: unable to create vertex shader');
        }
        else
        {
            gl.shaderSource(shader, source);
            gl.compileShader(shader);

            if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
            {
                 console.error('Error: unable to load vertex shader');
                 console.error(gl.getShaderInfoLog(shader));
            }
        }

        return shader;
    }

    private createFragmentShader(gl: WebGL2RenderingContext, source: string): WebGLShader | null  
    {
        const shader = gl.createShader(gl.FRAGMENT_SHADER);

        if(!shader)
        {
            console.error('Error: unable to create fragment shader');
        }
        else
        {
            gl.shaderSource(shader, source);
            gl.compileShader(shader);

            if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
            {
                 console.error('Error: unable to load fragment shader');
                 console.error(gl.getShaderInfoLog(shader));
            }
        }

        return shader;
    }

    private createShaderProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null
    {
        let program: WebGLShader | null = null;

        if(vertexShader && fragmentShader)
        {
            program = gl.createProgram();

            if(!program)
            {
                console.error("Error: could not create shader program");
                return null;
            }
            

            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);

            if(!gl.getProgramParameter(program, gl.LINK_STATUS))
            {
                console.error("Error: could not link shader program");
                console.error(gl.getProgramInfoLog(program));
                return null;
            }
        }

        return program;
    }

    public getProgram(): WebGLProgram | null
    {
        return this.shaderProgram;
    }

    public getAttribute(gl: WebGL2RenderingContext, attribute: string): number
    {
        if(this.shaderProgram)
            return gl.getAttribLocation(this.shaderProgram, attribute);
        else
            return -1;
    }

    public getUniform(gl: WebGL2RenderingContext, uniform: string): WebGLUniformLocation | null
    {
        
        if(this.shaderProgram)
            return gl.getUniformLocation(this.shaderProgram, uniform);
        else
            return null;
    }
}