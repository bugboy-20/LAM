<template>
  <IonPage>
    <IonContent :fullscreen="true">
    <div id="recordPage">
      <AudioRecorder @recordedAudio="(r : AudioInternal) => {recAudio=r}" />
      <Audio v-if="recAudio" :audio="recAudio"/>
    </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import AudioRecorder from '@/components/AudioRecorder.vue';
import Audio from '@/components/Audio.vue';
import { AudioInternal } from '@/interfaces';
import { ref } from 'vue';

let recAudio = ref<AudioInternal | null>(null)
</script>

<style scoped>
#recordPage {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 100%;
}
ion-content {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
</style>
