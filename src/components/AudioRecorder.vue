<template>
  {{ formattedTime }}/{{ maxDuration }}
  <IonButton @click="buttonFunction" fill="clear">
    <IonIcon :icon="buttonIcon" ></IonIcon>
  </IonButton>
</template>

<script setup lang="ts">
import { IonIcon, IonButton } from '@ionic/vue';
import { micCircleOutline, stopCircleOutline } from 'ionicons/icons';
import { GenericResponse, RecordingData, VoiceRecorder } from 'cap-voice-rec';
import { ref, watch, computed } from 'vue';

const startRecording = async () => VoiceRecorder.startRecording()
    .then((result: GenericResponse) => {
      recording.value = true
      startTimer()
    })
    .catch(error => console.error(error))


const stopRecording = async () => VoiceRecorder.stopRecording()
    .then((result: RecordingData) => {
      recording.value = false
      /*
      const b64 = result.value.recordDataBase64;
      const mime = result.value.mimeType;
      const audioRef = new Audio(`data:${mime};base64,${b64}`)
      audioRef.oncanplaythrough = () => audioRef.play()
      audioRef.load()
      */
      duration.value = 0
      console.log(result.value)
    })
    .catch(error => console.error(error))

const recording = ref(false)
const buttonIcon = ref(micCircleOutline)
const buttonFunction = ref(startRecording)
const maxDuration = '1:00'
const duration = ref(0)

watch(recording, (newValue) => {
  buttonIcon.value = newValue ? stopCircleOutline : micCircleOutline
  buttonFunction.value = newValue ? stopRecording : startRecording
})

const formattedTime = computed(() => {
      const minutes = Math.floor(duration.value / 60);
      const seconds = duration.value % 60;
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  });

const startTimer = () => {
  const interval = setInterval(() => {
    duration.value++
    if (duration.value >= 60 || !recording.value) {
      clearInterval(interval)
    }
  }, 1000) //TODO 1 second is too much, he doens't look very rective
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
