<template>
  <AudioTimestamp :duration="maxDuration" ref="timestamp"/>
  <IonButton @click="buttonFunction" fill="clear">
    <IonIcon :icon="buttonIcon" ></IonIcon>
  </IonButton>
</template>

<script setup lang="ts">
import { IonIcon, IonButton } from '@ionic/vue';
import { micCircleOutline, stopCircleOutline } from 'ionicons/icons';
import { GenericResponse, RecordingData, VoiceRecorder } from 'cap-voice-rec';
import { ref, watch } from 'vue';
import { AudioInternal } from '@/interfaces';
import AudioTimestamp from '@/components/AudioTimestamp.vue';
const emit = defineEmits<{
  recordedAudio: [audio: AudioInternal] // named tuple syntax
}>()

const startRecording = async () => VoiceRecorder.startRecording()
    .then((result: GenericResponse) => {
      recording.value = true
      timestamp.value?.play()
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
      let audio: AudioInternal = {
        id: '', //TODO: use hash
        audioBase64: result.value.recordDataBase64,
        mimeType: result.value.mimeType,
        createdAt: new Date(),
        updatedAt: null,
        duration: result.value.msDuration,
        metadata: null
      }
      emit('recordedAudio', audio)
      timestamp.value?.stop(0)
      console.log('stopped recording')
    })
    .catch(error => console.error(error))

const recording = ref(false)
const buttonIcon = ref(micCircleOutline)
const buttonFunction = ref(startRecording)
const maxDuration = 1 * 60 * 1000 // 1 minute
const duration = ref(0)
const timestamp = ref<typeof AudioTimestamp | null>(null)
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
