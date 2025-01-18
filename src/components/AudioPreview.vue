<template>
  <!--audio controls>
    <source src="/home/diego/Musica/01 - Astronomy Domine.mp3" type="audio/mpeg">
    Your browser does not support the audio element.
  </audio-->
  <IonButton fill="clear" @click="uploadAudio">
    <IonIcon :icon="cloudUploadOutline" ></IonIcon>
  </IonButton>
  <IonButton fill="clear" @click="deleteAudio" :disabled="!uploadedSuccess" >
    <IonIcon :icon="trashOutline" ></IonIcon>
  </IonButton>
  <Message ref="uploadShowMessage" :message="uploadedSuccess ? 'Audio uploaded' : 'Uploading audio'"/>
</template>

<script setup lang="ts">
import { IonButton, IonIcon, } from '@ionic/vue';
import {cloudUploadOutline, trashOutline} from 'ionicons/icons';
import { Audio, AudioInternal } from '@/interfaces';
import { saveAudio } from '@/utils/storage';
import { getUploadedAudioId, sendRequestWithToken} from '@/utils/requests';
import { convertToMp3 } from '@/utils/audio_processing';
import { ref } from 'vue';
import Message from './Message.vue';

const props = defineProps<{audio: AudioInternal}>()
const emit = defineEmits<{(e: 'delete', id: string): void}>()

const uploadedSuccess = ref(false)
const uploadShowMessage = ref<typeof Message | null>(null)

const uploadAudio = async () => { // TODO
  const { promise: uploadSucess, resolve: uploadResolve, reject: uploadReject } = Promise.withResolvers<boolean>()

  const data = new FormData()
  const id = getUploadedAudioId(uploadSucess)
  const [coords,mp3] = await Promise.all([
    await props.audio.coordinates,
    await convertToMp3(props.audio.audioBase64, props.audio.mimeType)
  ])


  data.append('file', mp3)
  data.append('type', 'audio/mp3')
  console.log('uploading audio')

  //downloadAudioFile(file)
  sendRequestWithToken('POST', `/api/upload?longitude=${coords.longitude}&latitude=${coords.latitude}`, data, [
  //sendRequest('POST', '/0x0st/', {'Allow-Origin':'*'}, data, [
    {status: 200, callback: async (_,res) => {
      res.json().then(async (data) => {
        const metadata = data as Audio
        uploadResolve(true)
        const audioUdated = {
          ...props.audio,
          id: await id,
          metadata
        }
        console.log(JSON.stringify(audioUdated))
        await saveAudio(audioUdated)
        uploadedSuccess.value = true
      })
    }}
  ], async (_, res) => {
    console.error(`error: ${await res.text()}`)
    uploadReject(false)
  })

}

const deleteAudio = () => {
  emit('delete', props.audio.hash)
}
</script>
