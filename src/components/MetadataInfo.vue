<template >
  <div id="metaInfo">
    <div id="metaLine" v-for="e in metadataAndIcon" >
      <p>{{e.icon}}</p>
      <p>{{e.data}}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Audio } from '@/interfaces';

const props = defineProps<{metadata: Audio}>()
console.log(`metadata: ${props.metadata}`)

const metadataAndIcon = [
  { icon: "bpm", data: props.metadata.bpm },
  { icon: "danceability", data: props.metadata.danceability },
  { icon: "loudness", data: props.metadata.loudness },
  { icon: "mood", data: props.metadata.mood },
  { icon: "genre", data: props.metadata.genre },
  { icon: "instruments", data: props.metadata.instruments }
]

</script>

<style scoped>
#metaLine {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid whitesmoke;
}
#metaInfo {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
}

</style>
