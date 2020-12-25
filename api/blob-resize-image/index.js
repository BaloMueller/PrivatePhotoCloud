const stream = require('stream');
const Jimp = require('jimp');

const {
  BlobServiceClient,
  BlockBlobClient,
  ContainerClient,
  StorageSharedKeyCredential
} = require("@azure/storage-blob");

const { AbortController } = require("@azure/abort-controller");

const ONE_MEGABYTE = 1024 * 1024;
const ONE_MINUTE = 60 * 1000;
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };

const containerName = process.env.BLOB_CONTAINER_NAME;
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accessKey = process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY;

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accessKey);

const serviceHost = `https://${accountName}.blob.core.windows.net`;
const blobServiceClient = new BlobServiceClient(serviceHost, sharedKeyCredential);

module.exports = async (context, eventGridEvent, inputBlob) => {  
  const aborter = AbortController.timeout(2 * ONE_MINUTE);
  const widthInPixels = 600;
  const heightInPixels = 600;
  //const contentType = context.bindingData.data.contentType;
  const blobUrl = context.bindingData.blobTrigger;
  const blobPath = blobUrl.slice(blobUrl.indexOf("/")+1, blobUrl.lastIndexOf("/"));
  const blobName = blobUrl.slice(blobUrl.lastIndexOf("/")+1);

  // Don't process .gallery files
  if(blobPath.indexOf(".gallery") > -1) {
    context.done();
    return;
  }

  // Convert Image
  const image = await Jimp.read(context.bindings.myBlob);
  const thumbnail = image.scaleToFit(widthInPixels, heightInPixels);
  const thumbnailBuffer = await thumbnail.getBufferAsync(Jimp.AUTO);
  const readStream = stream.PassThrough();
  readStream.end(thumbnailBuffer);

  const containerClient = blobServiceClient.getContainerClient(containerName)
  const blockBlobClient = containerClient.getBlockBlobClient(blobPath + "/.gallery/" + blobName);
  try {
    blockBlobClient.uploadStream(readStream, uploadOptions.bufferSize, 3, 
      {
        abortSignal: aborter, 
        metadata: {
          contentType: context.bindings.myBlob.contentType
        }
      });
  } catch (err) {
    context.log(err.message);
  } finally {
    context.done();
  }
};