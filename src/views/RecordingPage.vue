<template>
  <ionPage>
    <ionContent :fullscreen="true">
    X:XX/XX:XX
    <IonButton>
      <ionIcon :icon="micCircleOutline" @click="startRecording"></ionIcon>
    </IonButton>
    </ionContent>
  </ionPage>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonIcon, IonButton } from '@ionic/vue';
import {micCircleOutline, micCircleSharp} from 'ionicons/icons';

const startRecording = () => {
  console.log('Recording started');
}
</script>

<style scoped>
ion-content {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
ion-icon {
  font-size: 50vw;
}
</style>
