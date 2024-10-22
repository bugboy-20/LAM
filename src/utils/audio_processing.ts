import { FFmpeg } from "@ffmpeg/ffmpeg";

// Agnostic function to convert any audio file to MP3
async function convertToMp3(base64audio: string, mimeType: string) {//: Promise<File> {

  const ffmpeg = new FFmpeg();
  const file = base64ToUint8Array(base64audio);
  const mime = mimeType.split('/')[1];
  
  //if(!ffmpeg.loaded) // maybe FFmpeg it's a singleton, TODO: check this
  await ffmpeg.load().then(() => { console.log('FFmpeg loaded!') });


  ffmpeg.on("progress", ({ progress, time }) => {
    console.log(`Processing: ${progress}% done`);
    console.log(`Processing time: ${time} seconds`);
  })
  

  // Write the audio file to FFmpeg's virtual filesystem
  ffmpeg.writeFile('input.' + mime, file).then(() => { console.log('File written!') });
  // ffmpeg -i input.webm output.mp3
  await ffmpeg.exec(["-i", "input." + mime, "output.mp3"]);
  // Read the output MP3 file
  const mp3Data = ffmpeg.readFile('output.mp3');

  
  console.log('mp3Data', mp3Data);

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
