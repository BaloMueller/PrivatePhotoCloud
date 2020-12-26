import { generateAccountSASQueryParameters } from "@azure/storage-blob";
import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const { BlobServiceClient } = require("@azure/storage-blob");

const main: AzureFunction = async function (context: Context, req: HttpRequest) {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const containerName = process.env.BLOB_CONTAINER_NAME;
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    
    // create a new instance of blogServiceClient from the Azure Storage SDK
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    
    // create a new instance of the containerClient from the Azure Storage SDK
    const containerClient = await blobServiceClient.getContainerClient(containerName);

    let prefix = req.query['q'] ?? "";
    prefix = decodeURIComponent(prefix);
    
    const blobs = [];
    const groups = [];
    
    // list all objects in the storage container
    const response = containerClient.listBlobsByHierarchy("/", 
    {
        prefix: prefix,
        includeMetadata: true,
    });

    for await (const item of response) {
        if (item.kind === "prefix") {
            if(!item.name.endsWith(".gallery/")) {
                groups.push(item.name);
            }
        } else {
            blobs.push(item);
        }
    }
    
    // order the blobs by date descending
    blobs.sort((a, b) => {
        return new Date(b.properties.lastModified).getTime() - new Date(a.properties.lastModified).getTime();
    });
    
    // loop over all objects in the container to create an array of new objects
    // that contains the name, caption, video URL and creation date
    const updates = blobs.map((blob) => {
        const filename = blob.name.slice(prefix.length);
        return {
            name: filename,
            asset: `https://${accountName}.blob.core.windows.net/${containerName}/${encodeURIComponent(blob.name)}`,
            url: `http://localhost:7071/api/redirect/${encodeURIComponent(blob.name)}`,
            thumbnail: `http://localhost:7071/api/redirect/${encodeURIComponent(prefix + ".gallery/" + filename)}`,
            contentType: blob.properties.contentType,
            created: blob.properties.createdOn
        }
    });
    
    context.res = {
        headers: { "Content-Type": "application/json" },
        body: {
            groups: groups,
            items: updates
        }
    };
};

module.exports = main;