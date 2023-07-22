export class FileWriter
{
    static saveAscii(filename: string, text: string) 
    {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
    
        element.style.display = 'none';
        document.body.appendChild(element);
    
        element.click();
    
        document.body.removeChild(element);
    }

    static saveBinary(filename: string, data: ArrayBuffer) 
    {
        const blob = new Blob([data], {type: "application/octet-stream"});
        const url = URL.createObjectURL(blob);

        const element = document.createElement('a');
        element.setAttribute('href', url);
        element.setAttribute('download', filename);
    
        element.style.display = 'none';
        document.body.appendChild(element);
    
        element.click();
    
        document.body.removeChild(element);

        // Release the reference to the blob
        URL.revokeObjectURL(url);
    }
}