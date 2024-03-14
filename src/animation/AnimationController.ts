import { Skeleton } from './Skeleton'
import { Animation } from './Animation'
import { Keyframe } from './Keyframe';
import { Vector3 } from '../math/Vector3';
import { Node3 } from "../core/Node3";
import { Bone } from "./Bone";

export class AnimationController
{
    public fps: number;
    public useAbsolutePosition: boolean;
    public skeleton: Skeleton;

    private animation: Animation | null;
    
    private currentTime: number;
    private currentPose: Keyframe;
    
    private overlayQueue: Animation[];
    private overlayTransitionFrames: number[];
    private overlayTime: number;
    private overlayPose: Keyframe;

    constructor(skeleton: Skeleton, fps = 60, useAbsolutePosition = true)
    {
        this.skeleton = skeleton;
        this.fps = fps;
        this.useAbsolutePosition = useAbsolutePosition;

        this.animation = null;

        this.currentTime = 0;
        this.currentPose = new Keyframe();
        
        this.overlayQueue = [];
        this.overlayTransitionFrames = [];
        this.overlayTime = 0;  
        this.overlayPose = new Keyframe();
    }

    play(animation: Animation): void
    {
        this.stop();
        this.animation = animation;
        this.currentPose = this.animation.frames[0];
    }

    stop(): void
    {
        this.animation = null;
        this.currentTime = 0;

        this.overlayQueue = [];
        this.overlayTransitionFrames = [];
        this.overlayTime = 0;
    }

    overlay(animation: Animation, transitionFrames: number): void
    {
        this.overlayQueue.push(animation);
        this.overlayTransitionFrames.push(transitionFrames);
    }

    update(deltaTime: number): void
    {
        // If the motion queue is empty, then do nothing
        if(!this.animation)
            return;

        // Advance the time
        this.currentTime += deltaTime;

        // Set the next frame number
        let currentFrame = Math.floor(this.currentTime * this.fps);

        if(currentFrame >= this.animation.frames.length)
        {
            currentFrame = 0;
            this.currentTime = 0;   
            this.currentPose = this.animation.frames[0];
        }

        let overlayFrame = 0;

        // Advance the overlay clip if there is one
        if(this.overlayQueue.length > 0)
        {
            this.overlayTime += deltaTime;

            overlayFrame = Math.floor(this.overlayTime * this.fps);

            if(overlayFrame >= this.overlayQueue[0].frames.length)
            {
                this.overlayQueue.shift();
                this.overlayTransitionFrames.shift();
                this.overlayTime = 0;
                overlayFrame = 0;
            }
        }

        const pose = this.computePose(currentFrame, overlayFrame);
        this.applyPose(pose);
    }

    public getQueueCount(): number
    {
        return this.overlayQueue.length;
    }

    public applyPose(pose: Keyframe): void
    {
        // Reset the skeleton to its base rotation
        this.skeleton.rotation.copy(this.skeleton.rootRotation)

        // Apply the root rotation for this pose
        this.skeleton.rotation.multiply(pose.rootRotation);

        // Only apply the translation if we are using absolute positions
        if(this.useAbsolutePosition)
        {
            this.skeleton.position.copy(this.skeleton.rootPosition);
            this.skeleton.position.add(pose.rootPosition);
        }

        // Recursively update the bones based on the current pose
        this.skeleton.children.forEach((child: Node3) => {
            if(child instanceof Bone)
                child.updatePose(pose);
        });
    }

    private computePose(currentFrame: number, overlayFrame: number): Keyframe
    {
        // If there is an active overlay track
        if(this.overlayQueue.length > 0)
        {
            // Start out with the unmodified overlay pose
            const overlayPose = this.overlayQueue[0].frames[overlayFrame].clone();

            let alpha = 0;

            // Fade in the overlay
            if(overlayFrame < this.overlayTransitionFrames[0])
            {
                alpha = 1 - overlayFrame / this.overlayTransitionFrames[0];
                overlayPose.lerp(this.animation!.frames[currentFrame], alpha);
            }
            // Fade out the overlay
            else if (overlayFrame > this.overlayQueue[0].frames.length - this.overlayTransitionFrames[0])
            {
                alpha = 1 - (this.overlayQueue[0].frames.length - overlayFrame) / this.overlayTransitionFrames[0];
                overlayPose.lerp(this.animation!.frames[currentFrame], alpha);
            }

            if(!this.useAbsolutePosition)
            {
                const relativeOverlayPosition = Vector3.copy(this.overlayQueue[0].frames[overlayFrame].rootPosition);
                relativeOverlayPosition.subtract(this.overlayPose.rootPosition);

                const relativePosition = Vector3.copy(this.animation!.frames[currentFrame].rootPosition);
                relativePosition.subtract(this.currentPose.rootPosition);

                relativeOverlayPosition.lerp(relativeOverlayPosition, relativePosition, alpha);
                this.skeleton.position.add(relativeOverlayPosition);

                this.overlayPose = this.overlayQueue[0].frames[overlayFrame];
                this.currentPose = this.animation!.frames[currentFrame];
            }
            
            return overlayPose;
        }
        // Motion is entirely from the base track
        else
        {
            if(!this.useAbsolutePosition)
            {
                const relativePosition = Vector3.copy(this.animation!.frames[currentFrame].rootPosition);
                relativePosition.subtract(this.currentPose.rootPosition);
                this.skeleton.position.add(relativePosition);
                this.currentPose = this.animation!.frames[currentFrame];
            }

            return this.animation!.frames[currentFrame];
        }
    }
}