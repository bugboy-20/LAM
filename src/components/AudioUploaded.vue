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
import {sendRequestWithToken} from '@/utils/requests';
import { trashOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons'
const emit = defineEmits<{
  showMoreInfo: [audio: Audio]
  delete: [id: string]
}>()

const props = defineProps<{audio: AudioInternal}>()
const visible = ref(true)
const hideStatus = ref(props.audio.metadata?.hidden || false)

const toggleMoreInfo = () => {
  const metadata = props.audio.metadata
  if (!metadata) return // should not happen
  console.log('showing more info: emitting event')
  emit('showMoreInfo', metadata)
}

watch(() => props.audio, () => {
  visible.value = true
})

const deleteAudio = () => { // TODO better to use a dialog
  emit('delete', props.audio.hash)
  sendRequestWithToken('DELETE', `/api/audio/${props.audio.id}`, null, [
    {status: 200, callback: async () => {
      console.log(`audio ${props.audio.id} eliminato`);
    }}
  ]);

}

const hideAudio = () => {
  hideStatus.value = !hideStatus.value
  let op = hideStatus.value ? 'hide' : 'show'
  sendRequestWithToken('GET', `/api/audio/my/${props.audio.id}/${op}`, {}, [
    {status: 200, callback: async (req,res) => {
      res.text().then((data) => {
        console.log(`audio ${props.audio.id} ${op}ped, response: ${data}`);
      })
    }}
  ])

}

</script>
