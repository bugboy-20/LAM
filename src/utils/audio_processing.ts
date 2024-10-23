import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
//import ffmpeg from "cordova-plugin-ffmpeg";

// Agnostic function to convert any audio file to MP3
async function convertToMp3(base64audio: string, mimeType: string) {//: Promise<File> {

  const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm'
  const ffmpeg = new FFmpeg();
  console.log("base64audio", base64audio);
  const file = base64ToUint8Array(base64audio);
  const mime = mimeType.split('/')[1];
  console.log("mime", mime);
  
  //if(!ffmpeg.loaded) // maybe FFmpeg it's a singleton, TODO: check this
  console.log("loading FFmpeg...");
  await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript')
  })
  .then(() => { console.log('FFmpeg loaded!') })
  .catch((err) => { console.error('errore di caricamento' + err) });


  ffmpeg.on("progress", ({ progress, time }) => {
    console.log(`Processing: ${progress}% done`);
    console.log(`Processing time: ${time} seconds`);
  })
  
  console.log("loading file...");

  // Write the audio file to FFmpeg's virtual filesystem
  await ffmpeg.writeFile('input.' + mime, file).then(() => { console.log('File written!') });
  // ffmpeg -i input.webm output.mp3
  await ffmpeg.exec(["-i", "input." + mime, "output.mp3"]);
  // Read the output MP3 file
  const mp3Data = await ffmpeg.readFile('output.mp3');

  return (URL.createObjectURL(new Blob([(mp3Data as Uint8Array).buffer], { type: 'audio/mp3' })))
  

  // return mp3File
 // return unit8ArrayToFile(await mp3Data, 'output.mp3', 'audio/mpeg');
}


function base64ToUint8Array(base64String: string): Uint8Array {
  // Remove the base64 prefix if present (e.g., "data:audio/wav;base64,")
  const byteString = atob(base64String.split(",")[1] || base64String);
  
  // Create a buffer to hold the binary data
  const buffer = new ArrayBuffer(byteString.length);
  const uintArray = new Uint8Array(buffer);

  // Assign each byte to the Uint8Array
  for (let i = 0; i < byteString.length; i++) {
    uintArray[i] = byteString.charCodeAt(i);
  }

  return uintArray;
}

function unit8ArrayToFile(uintArray: Uint8Array, filename: string, mimeType: string): File {
  // Create a Blob from the Uint8Array
  const blob = new Blob([uintArray], { type: mimeType });
  // Convert Blob to a File
  return new File([blob], filename, { type: mimeType });
}

function base64ToFile(base64String: string, filename: string, mimeType: string): File {
  const uintArray = base64ToUint8Array(base64String);
  return unit8ArrayToFile(uintArray, filename, mimeType);
}



export { base64ToUint8Array, base64ToFile, convertToMp3, unit8ArrayToFile };
