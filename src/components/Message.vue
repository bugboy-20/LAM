<template>
<IonToast
  :isOpen="isShown"
  :message="message"
  position="top"
  duration="2000"></IonToast>
</template>
<script setup lang="ts">
//this component can be used vvia show method or directly changing the message prop
import { ref, watch, Ref } from 'vue';
import { IonToast } from '@ionic/vue';
const isShown = ref(false);
const props = withDefaults(defineProps<{
  message: string
}>(), {
  message: '<Empty message>'
});
const message = ref(props.message);

watch(() => props.message, (newValue) => {
  message.value = newValue;
  show();
});

const show = (m?: string ) => {
  if (isShown.value) { // prevent spam, but show later if different message
    if (m === message.value) {
      return;
    } else {
      setTimeout(() => {
        show(m);
      }, 2000);
      return;
    }
  }
  if (m) {
    message.value = m;
  } else {
    message.value = props.message;
  }
  isShown.value = true;
  setTimeout(() => {
    isShown.value = false;
  }, 2000);
}

defineExpose({
  show,
  isShown // maybe could be abused
})
</script>
