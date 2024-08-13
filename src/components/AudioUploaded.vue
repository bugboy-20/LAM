<template>
</template>

<script setup lang="ts">
// has no sense do this before uploading
import { ref, watch } from 'vue';
import { AudioInternal } from '@/interfaces';

const props = defineProps<{audio: AudioInternal}>()
const visible = ref(true)

watch(() => props.audio, (newValue) => {
  visible.value = true
})

const demoAudio = {
  id: 'demo',
  audioBase64: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=',
  mimeType: 'audio/wav',
  duration: 1,
  metadata: {
    bpm: 32,
    danceability: 0.3,
    loudness: 0.6,
    mood: {kek: true},
    genre: {rock: 0.7},
    instruments: {trumpet: 0.3}
  }
}
</script>
