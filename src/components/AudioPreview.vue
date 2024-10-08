<template>
  <!--audio controls>
    <source src="/home/diego/Musica/01 - Astronomy Domine.mp3" type="audio/mpeg">
    Your browser does not support the audio element.
  </audio-->
  <IonButton fill="clear" @click="uploadAudio">
    <IonIcon :icon="cloudUploadOutline" ></IonIcon>
  </IonButton>
  <IonButton fill="clear" @click="deleteAudio">
    <IonIcon :icon="trashOutline" ></IonIcon>
  </IonButton>
</template>

<script setup lang="ts">
import { IonButton, IonIcon, } from '@ionic/vue';
import {cloudUploadOutline, trashOutline} from 'ionicons/icons';
import { AudioInternal } from '@/interfaces';
import { deleteAudio as deleteAudioDB } from '@/utils/storage';
import {base64ToFile, sendRequestWithToken} from '@/utils/requests';

const props = defineProps<{audio: AudioInternal}>()
const emit = defineEmits<{(e: 'hide', id: string): void}>()

function downloadAudioFile(file : File) {
  // Create a URL for the File object
  const url = URL.createObjectURL(file);
  
  // Create an anchor element and set the download attribute
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name || 'audio.mp3';  // You can set a default file name if none exists

  // Append the anchor to the body
  document.body.appendChild(a);
  
  // Programmatically click the anchor to trigger the download
  a.click();
  
  // Remove the anchor from the document
  document.body.removeChild(a);
  
  // Revoke the object URL after the download
  URL.revokeObjectURL(url);
}
const uploadAudio = async () => { // TODO
  const data = new FormData()
  const file = base64ToFile(props.audio.audioBase64, `audio.webm`, props.audio.mimeType)
  data.append('file', file)
  data.append('type', props.audio.mimeType)
  console.log('uploading audio')

  const coords = await props.audio.coordinates
  

  //downloadAudioFile(file)
  sendRequestWithToken('POST', `/api/upload?longitude=${coords.longitude}&latitude=${coords.latitude}`, data, [
    {status: 200, callback: async (req,res) => {
      res.json().then((data) => {
        console.log(data)
      })
    }}
  ], async (_, res) => {

    console.log(`error: ${await res.text()}`)
  })
}

const deleteAudio = () => {
  emit('hide', props.audio.hash)
  deleteAudioDB(props.audio.hash)
}
</script>
