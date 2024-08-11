<template>
  <div id="card">
      <!--audio controls>
        <source src="/home/diego/Musica/01 - Astronomy Domine.mp3" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio-->
      <IonButton fill="clear" @click="playFunction">
        <IonIcon :icon="playIcon" ></IonIcon>
      </IonButton>
      {{ millisToMinutesAndSeconds( currentTime )}} / {{  millisToMinutesAndSeconds( props.audio.duration) }}
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
import {ref, watch} from 'vue';

const isPlaying = ref(false)
const props = defineProps<{audio: AudioInternal}>()
const currentTime = ref(0)
let audioRef : HTMLAudioElement

console.log(props.audio)

const playAudio = () => {
  const b64 = props.audio.audioBase64;
  const mime = props.audio.mimeType;
  audioRef = new Audio(`data:${mime};base64,${b64}`)
  audioRef.oncanplaythrough = () => audioRef.play()
  audioRef.load()
  audioRef.onended = () => isPlaying.value = false
  isPlaying.value = true
}
const pauseAudio = () => {
  audioRef.pause()
  isPlaying.value = false
}

const uploadAudio = () => {
  console.log('uploading audio')
}

const deleteAudio = () => {
  console.log('deleting audio')
}

const playIcon = ref(playCircleOutline)
const playFunction = ref(playAudio)

watch(isPlaying, (newValue) => {
  playIcon.value = newValue ? pauseCircleOutline : playCircleOutline
  playFunction.value = newValue ? pauseAudio : playAudio
})

const millisToMinutesAndSeconds = (millis: number) => {
  let minutes = Math.floor(millis / 60000);
  let seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (parseInt(seconds) < 10 ? '0' : '') + seconds;
}
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
