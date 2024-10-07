<template>
  <IonButton fill="clear" @click="toggleMoreInfo" >
    A
  </IonButton>
  <IonButton fill="clear" @click="hideAudio">
    <IonIcon :icon="hideStatus ? eyeOffOutline : eyeOutline"></IonIcon>
  </IonButton>
  <IonButton fill="clear" @click="deleteAudio">
    <IonIcon :icon="trashOutline" ></IonIcon>
  </IonButton>

</template>

<script setup lang="ts">
// has no sense do this before uploading
import { ref, watch } from 'vue';
import { Audio, AudioInternal } from '@/interfaces';
import { IonButton, IonIcon } from '@ionic/vue';
import { deleteAudio as deleteAudioDB } from '@/utils/storage';
import {sendRequestWithToken} from '@/utils/requests';
import { trashOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons'
const emit = defineEmits<{
  showMoreInfo: [audio: Audio]
  hide: [id: string]
}>()

const props = defineProps<{audio: AudioInternal}>()
const visible = ref(true)
const hideStatus = ref(false)

const toggleMoreInfo = () => {
  const metadata = props.audio.metadata
  if (!metadata) return // should not happen
  console.log('showing more info: emitting event')
  emit('showMoreInfo', metadata)
}

watch(() => props.audio, () => {
  visible.value = true
})

const deleteAudio = () => {
  emit('hide', props.audio.hash)
  deleteAudioDB(props.audio.hash)
  sendRequestWithToken('DELETE', `/audio/my/${props.audio.id}`, {}, [ //TODO
  ])
}

const hideAudio = () => {
  hideStatus.value = !hideStatus.value
  sendRequestWithToken('GET', `/audio/my/${props.audio.id}/hide`, {}, [ //TODO
  ])

}

</script>
