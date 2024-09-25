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

const props = defineProps<{audio: AudioInternal}>()
const emit = defineEmits<{(e: 'hide', id: string): void}>()

console.log(props.audio) //TODO does the audio as been already saved in the database?

const uploadAudio = () => { // TODO
  console.log('uploading audio')
}

const deleteAudio = () => {
  emit('hide', props.audio.id)
}
</script>
