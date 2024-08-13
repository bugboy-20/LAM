<template>
  <div id="card" v-if="visible">
    <AudioPreview :audio="audio" v-if="!props.audio.metadata" @hide="(_) => {visible = false}"/>
  </div>
</template>

<script setup lang="ts">
// according the vue docs this layer of abstraction is not ok for optimations
import { ref, watch } from 'vue';
import { AudioInternal } from '@/interfaces';
import AudioPreview from '@/components/AudioPreview.vue';
const props = defineProps<{audio: AudioInternal}>()

const visible = ref(true)

watch(() => props.audio, (newValue) => {
  visible.value = true
})
</script>

<style scoped>
  #card {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(0, 84, 233, 0.2);
    border-radius: 0.5rem;

  }
</style>
