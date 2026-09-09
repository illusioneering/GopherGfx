import { GfxApp } from '../core/GfxApp';

export class TextFile
{
    data: string;

/**
 * Creates a new instance of the TextFile class
 */
    constructor()
    {
        this.data = '';
    }
}

export class TextFileLoader
{
/**
 * Loads a text file located at the specified filename asynchronously
 * 
 * @param filename - The path to the text file to be loaded
 * @param callback - An optional callback function to be invoked when the file is loaded
 * @returns The TextFile object that will contain the loaded file's data. Note, it will 
 * only contain the data AFTER the asynchronous loading is complete.
 */
    static load(filename: string, callback: ((loadedFile: TextFile) => void) | null = null): TextFile
    {
        GfxApp.getInstance().assetManager.requestedAssets.push(filename);

        const textFile = new TextFile();

        fetch(filename).then((response: Response) => {
            if(!response.ok)
                throw new Error();
            return response.blob();
        })
        .then((data: Blob) => {
            data.text().then((text: string) => {
                textFile.data = text;
                if(callback)
                {
                    callback(textFile);
                }
                GfxApp.getInstance().assetManager.loadedAssets.push(filename);
            });
        })
        .catch(() => {
            GfxApp.getInstance().assetManager.errorAssets.push(filename);
            console.error('Unable to download file: ' + filename);
        });

        return textFile;
    }
}