<template>
  Ciao
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

</script>
