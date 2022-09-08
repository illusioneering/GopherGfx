export class AssetManager
{
    public requestedAssets: string[];
    public loadedAssets: string[];
    public errorAssets: string[];

    constructor()
    {
        this.requestedAssets = [];
        this.loadedAssets = [];
        this.errorAssets = [];
    }

    allAssetsLoaded(): boolean
    {
        return this.requestedAssets.length == (this.loadedAssets.length + this.errorAssets.length);
    }
}