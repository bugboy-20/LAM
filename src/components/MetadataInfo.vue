<template >
  <div id="metaInfo">
    <div id="metaLine" v-for="line in metadataAndIcon" >
      <div v-if="typeof(line.data) === 'object'"><IonAccordionGroup >
        <IonAccordion>
          <IonItem slot="header">
            <IonLabel><b>{{line.name}}</b></IonLabel>
          </IonItem>
          <template v-for="(value, key) in line.data" >
            <div slot="content"><b class="stat">{{key}}</b>{{value}}%</div>
          </template>
        </IonAccordion>
        </IonAccordionGroup></div>
      <template v-else>
        <p><b>{{line.name}}</b></p>
        <p>{{line.data}}</p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Audio } from '@/interfaces';
import {IonAccordionGroup, IonAccordion, IonLabel} from '@ionic/vue';

const props = defineProps<{metadata: Audio}>()
console.log(`metadata: ${props.metadata}`)

const metadataAndIcon = [
  { name: "bpm", data: props.metadata.bpm },
  { name: "danceability", data: props.metadata.danceability },
  { name: "loudness", data: props.metadata.loudness },
  { name: "mood", data: props.metadata.mood },
  { name: "genre", data: props.metadata.genre },
  { name: "instruments", data: props.metadata.instrument }
].map((item) => {
  if ( typeof item.data === 'number') {
    item.data = Math.round(item.data * 100) / 100; // 2 decimals
  } else if ( typeof item.data === 'object') {
    // Handle the object case
    const entries = Object.entries(item.data) as [string, number][];
    const top5Entries = entries
        .filter(([_, value]) => typeof value === 'number') // Ensure values are numbers
        .sort((a, b) => b[1] - a[1]) // Sort descending by value
        .slice(0, 5) // Take the top 5 entries
        .map(([key, value]) => [key, Math.round(value * 100)]); // Round the values to 2 decimals
    console.log(item.data)
    console.log(Object.fromEntries(top5Entries))
    item.data = Object.fromEntries(top5Entries);
  }
  return item;
})

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
.stat {
  font-weight: normal;
  font-style: italic;
  padding-right: 0.5em;
}
b {
  font-size: 1.1em;
  padding-right: 0.5em;
}

</style>
