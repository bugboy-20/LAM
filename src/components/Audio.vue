<template>
  <div id="card">
      <!--audio controls>
        <source src="/home/diego/Musica/01 - Astronomy Domine.mp3" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio-->
      <IonButton fill="clear" @click="playFunction">
        <IonIcon :icon="playIcon" ></IonIcon>
      </IonButton>
      <AudioTimestamp :duration="props.audio.duration" ref="timestamp"/>
      <IonButton fill="clear" @click="uploadAudio">
        <IonIcon :icon="cloudUploadOutline" ></IonIcon>
      </IonButton>
      <IonButton fill="clear" @click="deleteAudio">
        <IonIcon :icon="trashOutline" ></IonIcon>
      </IonButton>
  </div>
</template>

<script setup lang="ts">
import { IonButton, IonIcon } from '@ionic/vue';
import {cloudUploadOutline, pauseCircleOutline, playCircleOutline, trashOutline} from 'ionicons/icons';
import { AudioInternal } from '@/interfaces';
import AudioTimestamp from '@/components/AudioTimestamp.vue';
import {ref, watch} from 'vue';

const isPlaying = ref(false)
const props = defineProps<{audio: AudioInternal}>()
let audioRef : HTMLAudioElement

console.log(props.audio)

const timestamp = ref<typeof AudioTimestamp | null>(null)

const playAudio = () => {
  const b64 = props.audio.audioBase64;
  const mime = props.audio.mimeType;
  audioRef = new Audio(`data:${mime};base64,${b64}`)
  audioRef.oncanplaythrough = () => audioRef.play()
  audioRef.load()
  audioRef.onended = () => { isPlaying.value = false; timestamp.value?.stop(props.audio.duration) }
  isPlaying.value = true
  timestamp.value?.play()
}
const pauseAudio = () => {
  audioRef.pause()
  isPlaying.value = false
  timestamp.value?.pause()
}

const uploadAudio = () => { // TODO
  console.log('uploading audio')
}

const deleteAudio = () => { // TODO
  console.log('deleting audio')
}

const playIcon = ref(playCircleOutline)
const playFunction = ref(playAudio)

watch(isPlaying, (newValue) => {
  playIcon.value = newValue ? pauseCircleOutline : playCircleOutline
  playFunction.value = newValue ? pauseAudio : playAudio
})

</script>
<style scoped>
  #card {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(0, 84, 233, 0.2);
    border-radius: 0.5rem;

  }
</style>
