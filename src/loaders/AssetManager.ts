export class AssetManager
{
    public requestedAssets: string[];
    public loadedAssets: string[];
    public errorAssets: string[];

/**
 * Constructor for the AssetManager class
 * Initializes the requestedAssets, loadedAssets, and errorAssets arrays
 */
    constructor()
    {
        this.requestedAssets = [];
        this.loadedAssets = [];
        this.errorAssets = [];
    }

/**
 * Checks if all requested assets have been loaded
 * 
 * @returns boolean value indicating if all assets are loaded
 */
    allAssetsLoaded(): boolean
    {
        return this.requestedAssets.length == (this.loadedAssets.length + this.errorAssets.length);
    }
}