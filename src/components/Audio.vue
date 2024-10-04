<template>
  <div id="card" v-if="visible">
    <div id="base-info">
      <IonButton fill="clear" @click="playFunction">
        <IonIcon :icon="playIcon" ></IonIcon>
      </IonButton>
      <AudioTimestamp :duration="props.audio.duration" ref="timestamp"/>
      <AudioPreview :audio="audio" v-if="!props.audio.metadata" @hide="(_) => {visible = false}"/>
      <AudioUploaded :audio="audio" v-else @hide="() => {visible = false}" @showMoreInfo="toggleMoreInfo" />
    </div>
    <MetadataInfo :metadata="metadata" v-if="moreInfoVisible && metadata"/>
  </div>
</template>

<script setup lang="ts">
// according the vue docs this layer of abstraction is not ok for optimations
import { ref, watch } from 'vue';
import { AudioInternal } from '@/interfaces';
import AudioPreview from '@/components/AudioPreview.vue';
import AudioUploaded from './AudioUploaded.vue';
import AudioTimestamp from '@/components/AudioTimestamp.vue';
import MetadataInfo from '@/components/MetadataInfo.vue';
import { IonButton, IonIcon } from '@ionic/vue';
import {playCircleOutline, pauseCircleOutline} from 'ionicons/icons';

const props = defineProps<{audio: AudioInternal}>()

const visible = ref(true)
const moreInfoVisible = ref(false)
const isPlaying = ref(false)
let audioRef : HTMLAudioElement
const timestamp = ref<typeof AudioTimestamp | null>(null)
const metadata = ref(props.audio.metadata)

watch(() => props.audio, (_) => {
  visible.value = true
})

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


const playIcon = ref(playCircleOutline)
const playFunction = ref(playAudio)

watch(isPlaying, (newValue) => {
  playIcon.value = newValue ? pauseCircleOutline : playCircleOutline
  playFunction.value = newValue ? pauseAudio : playAudio
})

console.log(`icon: ${playIcon.value ? 'pause' : 'play'}`)

const toggleMoreInfo = () => {
  console.log('toggling more info')
  moreInfoVisible.value = !moreInfoVisible.value
}
</script>

<style scoped>
  #card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: rgba(0, 84, 233, 0.2);
    margin: 0.5rem;
    border-radius: 0.5rem;

  }
  #base-info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  #metadata-info {
  }
</style>
