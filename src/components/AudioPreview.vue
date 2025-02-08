<template>
  <!--audio controls>
    <source src="/home/diego/Musica/01 - Astronomy Domine.mp3" type="audio/mpeg">
    Your browser does not support the audio element.
  </audio-->
  <IonButton fill="clear" @click="uploadAudio" v-if="connectionType != 'none'">
  <IonIcon :icon="cloudUploadOutline" ></IonIcon></IonButton >
  <IonButton fill="clear" id="no-wifi-alert" v-else><IonIcon :icon="cloudUploadOutline" ></IonIcon></IonButton>
  <IonButton fill="clear" @click="deleteAudio" :disabled="!uploadedSuccess" >
    <IonIcon :icon="trashOutline" ></IonIcon>
  </IonButton>
  <Message ref="uploadShowMessage" :message="uploadedSuccess ? 'Audio uploaded' : 'Uploading audio'"/>
  <IonAlert trigger="no-wifi-alert" header="Sono sei connesso ad un wifi" :buttons="alertButtons" >
  </IonAlert>

</template>

<script setup lang="ts">
import { IonAlert, IonButton, IonIcon, } from '@ionic/vue';
import {cloudUploadOutline, trashOutline} from 'ionicons/icons';
import { Audio, AudioInternal } from '@/interfaces';
import { saveAudio } from '@/utils/storage';
import { getUploadedAudioId, sendRequestWithToken} from '@/utils/requests';
import { convertToMp3 } from '@/utils/audio_processing';
import { onMounted, ref } from 'vue';
import { ConnectionStatus, ConnectionType, Network } from '@capacitor/network';
import Message from './Message.vue';
import variables from '@/variables.json';
const props = defineProps<{audio: AudioInternal}>()
const emit = defineEmits<{(e: 'delete', id: string): void,(e: 'upload', id: AudioInternal): void}>()

const uploadedSuccess = ref(false)
const uploadShowMessage = ref<typeof Message | null>(null)
const connectionType = ref<ConnectionType>('unknown')

const alertButtons = [
  { text: 'Continua',
    handler: () => {uploadAudio()} },
  { text: 'Attendi WiFi',
    role: 'enqueue',
    cssClass: 'secondary',
    handler: () => {
      console.log('Cancel clicked');
    }
  }
]

const uploadAudio = async () => {
  
  console.log('uploading audio...')

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
  sendRequestWithToken('POST', `${variables.apiURL}/upload?longitude=${coords.longitude}&latitude=${coords.latitude}`, data, [
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
        emit('upload', audioUdated)
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

onMounted(async () => {
  connectionType.value = await Network.getStatus().then((status : ConnectionStatus) => status.connectionType)
  console.log('Connection type:', connectionType.value)
  Network.addListener('networkStatusChange', async (status) => {
    connectionType.value = status.connectionType
    console.log('Network status changed', status)
  })
})
</script>
