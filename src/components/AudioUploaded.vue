<template>
  <IonButton fill="clear" @click="moreInfoVisible=!moreInfoVisible" >
    A
  </IonButton>

  <div><!-- v-if="moreInfoVisible"-->
    {{ props.audio.metadata.bpm }}
    {{ props.audio.metadata.danceability }}
    {{ props.audio.metadata.loudness }}
    {{ props.audio.metadata.mood }}
    {{ props.audio.metadata.genre }}
    {{ props.audio.metadata.instruments }}
  </div>
</template>

<script setup lang="ts">
// has no sense do this before uploading
import { ref, watch } from 'vue';
import { AudioInternal } from '@/interfaces';
import { IonButton, IonIcon, } from '@ionic/vue';

const props = defineProps<{audio: AudioInternal}>()
const visible = ref(true)
const moreInfoVisible = ref(false)

watch(() => props.audio, (newValue) => {
  visible.value = true
})

</script>
