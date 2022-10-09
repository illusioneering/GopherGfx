import { GfxApp } from '../core/GfxApp';

export class TextFile
{
    data: string;

    constructor()
    {
        this.data = '';
    }
}

export class TextFileLoader
{
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