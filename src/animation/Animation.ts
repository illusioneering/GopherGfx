import { Keyframe } from './Keyframe'

export class Animation
{
    public frames: Keyframe[];

    constructor()
    {
        this.frames = [];
    }

    public trimFront(numFrames: number): void
    {
        this.frames.splice(0, numFrames);
    }

    public trimBack(numFrames: number): void
    {
        this.frames.splice(this.frames.length-numFrames, numFrames);
    }

    public prependKeyframe(frame: Keyframe): void
    {
        this.frames.unshift(frame);
    }

    public appendKeyframe(frame: Keyframe): void
    {
        this.frames.push(frame);
    }
    
    public makeLoop(numBlendFrames: number): void
    {
        const tempClip = new Animation();
        for(let i=0; i < numBlendFrames; i++)
        {
            tempClip.prependKeyframe(this.frames.pop()!);
        }

        for(let i=0; i < numBlendFrames; i++)
        {
            const alpha = i / (tempClip.frames.length-1);
            tempClip.frames[i].lerp(this.frames[i], alpha);
            this.frames[i] = tempClip.frames[i];
        }
    }
}