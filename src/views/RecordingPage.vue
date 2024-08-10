<template>
  <IonPage>
    <IonContent :fullscreen="true">
    <div id="recordPage">
      <AudioRecorder />
      <Audio />
    </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import AudioRecorder from '@/components/AudioRecorder.vue';
import Audio from '@/components/Audio.vue';
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
