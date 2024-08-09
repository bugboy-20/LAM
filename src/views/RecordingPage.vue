<template>
  <ionPage>
    <ionContent :fullscreen="true">
    X:XX/XX:XX
    <IonButton @click="startRecording()" >
      <ionIcon :icon="micCircleOutline" ></ionIcon>
    </IonButton>
    <IonButton @click="stopRecording()" >
      <ionIcon :icon="micCircleSharp" color="red" ></ionIcon>
    </IonButton>
    </ionContent>
  </ionPage>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonIcon, IonButton } from '@ionic/vue';
import {micCircleOutline, micCircleSharp} from 'ionicons/icons';
import { GenericResponse, RecordingData, VoiceRecorder } from 'cap-voice-rec';
/*
VoiceRecorder.canDeviceVoiceRecord().then((canRecord) => {
  if (canRecord.value) {
    console.log('Device can record');
  } else {
    console.log('Device cannot record');
  }
});*/

const startRecording = async () => {
  console.log('ping')
  VoiceRecorder.hasAudioRecordingPermission().then((result: GenericResponse) => console.log(result.value))
   await VoiceRecorder.startRecording()
    .then((result: GenericResponse) => console.log(result.value))
    .catch(error => console.log(error)) 
  console.log('Recording started');
}

const stopRecording = async () => {
  console.log('ping')
  await VoiceRecorder.stopRecording()
    .then((result: RecordingData) => {
      const b64 = result.value.recordDataBase64;
      const mime = result.value.mimeType;
      const audioRef = new Audio(`data:${mime};base64,${b64}`)
      audioRef.oncanplaythrough = () => audioRef.play()
      audioRef.load()

      console.log(result.value)
    })
    .catch(error => console.log(error))
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
