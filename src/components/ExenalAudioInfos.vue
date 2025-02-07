<template>
  <div>
    <h1>External Audio Infos</h1>
    <p>Here you can see the external audio infos</p>
    <p>{{audioInfos}}</p>
  </div>
</template>

<script setup lang="ts">
import {sendRequestWithToken} from '@/utils/requests';
import {ref} from 'vue';
import { AudioExternal } from '@/interfaces';

const audioInfos = ref<AudioExternal | null>(null);

const props = defineProps<{
  id: number;
}>();



const getAudioInfo = async (id: number) => {

  await sendRequestWithToken('GET',`/api/audio/${id}`,null,[{
    status: 200,
    callback: async (req,res) => {
      res.json().then((data) => {
        audioInfos.value = {
          id: data.id,
          coordinates: {
            latitude: data.latitude,
            longitude: data.longitude
          },
          creator_username: data.creator_username,
          tags: data.tags,
        }

      });
    }}])
  return audioInfos.value;
}

defineExpose({
  getAudioInfo
});
</script>

