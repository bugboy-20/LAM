<template>
  <IonButton fill="clear" @click="toggleMoreInfo" >
    A
  </IonButton>
</template>

<script setup lang="ts">
// has no sense do this before uploading
import { ref, watch } from 'vue';
import { Audio, AudioInternal } from '@/interfaces';
import { IonButton } from '@ionic/vue';

const emit = defineEmits<{ showMoreInfo: [audio: Audio] }>()

const props = defineProps<{audio: AudioInternal}>()
const visible = ref(true)

const toggleMoreInfo = () => {
  const metadata = props.audio.metadata
  if (!metadata) return // should not happen
  console.log('showing more info: emitting event')
  emit('showMoreInfo', metadata)
}

watch(() => props.audio, () => {
  visible.value = true
})

</script>
