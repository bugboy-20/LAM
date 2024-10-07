<template >
  <div id="metaInfo">
    <div id="metaLine" v-for="line in metadataAndIcon" >
      <IonAccordionGroup v-if="typeof(line.data) === 'object'">
        <IonAccordion>
          <IonItem slot="header">
            <IonLabel>{{line.name}}</IonLabel>
          </IonItem>
          <template v-for="(value, key) in line.data" >
            <div slot="content">{{key}} {{value}}</div>
          </template>
        </IonAccordion>
      </IonAccordionGroup>
      <template v-else>
        <p>{{line.name}}</p>
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
  { name: "instruments", data: props.metadata.instruments }
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
