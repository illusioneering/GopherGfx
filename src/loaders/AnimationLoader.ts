import { GfxApp } from '../core/GfxApp'
import { Skeleton } from '../animation/Skeleton'
import { Animation } from '../animation/Animation'
import { AnimationParser } from './AnimationParser';

export class AnimationLoader
{
    /**
     * Loads an ASF file
     * 
     * @param filename - The relative path to the Acclaim skeleton file
     * @param skeleton - The Skeleton object to load the data (optional)
     * @param callback - An optional callback that is called when the file has been loaded
     * @returns A Skeleton object containing the data loaded from the file
     */  
    static loadASF(filename: string, skeleton: Skeleton | null, callback: ((loadedSkeleton: Skeleton) => void) | null = null): Skeleton
    {
        if(skeleton == null)
        {
            skeleton = new Skeleton();
        }

        GfxApp.getInstance().assetManager.requestedAssets.push(filename);

        fetch(filename).then((response: Response) => {
            if(!response.ok)
                throw new Error();
            return response.blob();
        })
        .then((data: Blob) => {
            data.text().then((text: string) => {

                AnimationParser.parseASF(text, skeleton as Skeleton);
                if(callback)
                {
                    callback(skeleton as Skeleton);
                }
                GfxApp.getInstance().assetManager.loadedAssets.push(filename);

            });
        })
        .catch(() => {
            GfxApp.getInstance().assetManager.errorAssets.push(filename);
            console.error('Unable to load ASF file: ' + filename);
        });

        return skeleton;
    }

    /**
     * Loads an AMC file
     * 
     * @param filename - The relative path to the Acclaim mocap file
     * @param skeleton - The object that defines the skeleton structure
     * @param callback - An optional callback that is called when the file has been loaded
     * @returns An Animation object containing the data loaded from the file
     */  
    static loadAMC(filename: string, skeleton: Skeleton, callback: ((loadedAnimation: Animation) => void) | null = null): Animation
    {
        GfxApp.getInstance().assetManager.requestedAssets.push(filename);

        const animation = new Animation();

        fetch(filename).then((response: Response) => {
            if(!response.ok)
                throw new Error();
            return response.blob();
        })
        .then((data: Blob) => {
            data.text().then((text: string) => {

                AnimationParser.parseAMC(text, skeleton, animation);
                if(callback)
                {
                    callback(animation);
                }
                GfxApp.getInstance().assetManager.loadedAssets.push(filename);

            });
        })
        .catch(() => {
            GfxApp.getInstance().assetManager.errorAssets.push(filename);
            console.error('Unable to load AMC file: ' + filename);
        });

        return animation;
    }
}