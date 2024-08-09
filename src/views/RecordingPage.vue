<template>
  <IonPage>
    <IonContent :fullscreen="true">
      X:XX/XX:XX
      <IonButton @click="buttonFunction" >
        <IonIcon :icon="buttonIcon" ></IonIcon>
      </IonButton>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonIcon, IonButton } from '@ionic/vue';
import { micCircleOutline, stopCircleOutline } from 'ionicons/icons';
import { GenericResponse, RecordingData, VoiceRecorder } from 'cap-voice-rec';
import { ref, watch } from 'vue';

const startRecording = async () => VoiceRecorder.startRecording()
    .then((result: GenericResponse) => {
      recording.value = true
      console.log(buttonIcon)
      console.log(result.value)
    })
    .catch(error => console.log(error))


const stopRecording = async () => VoiceRecorder.stopRecording()
    .then((result: RecordingData) => {
      recording.value = false
      console.log(buttonIcon)
      const b64 = result.value.recordDataBase64;
      const mime = result.value.mimeType;
      const audioRef = new Audio(`data:${mime};base64,${b64}`)
      audioRef.oncanplaythrough = () => audioRef.play()
      audioRef.load()

      console.log(result.value)
    })
    .catch(error => console.log(error))

const recording = ref(false)
const buttonIcon = ref(micCircleOutline)
const buttonFunction = ref(startRecording)

watch(recording, (newValue) => {
  buttonIcon.value = newValue ? stopCircleOutline : micCircleOutline
  buttonFunction.value = newValue ? stopRecording : startRecording
})
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
