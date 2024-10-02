<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Login</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
    <IonInput label="Username" placeholder="Username" v-model="username"></IonInput>
    <IonInput label="Password" placeholder="Password" type="password" v-model="password">
      <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
    </IonInput>

      <IonCheckbox label-placement="end" >Remeber me</IonCheckbox><br>
      <IonButton @click="login">Login</IonButton>
      <p>
        Don't have an account? Singup 
       <IonNavLink router-link="/signup" >here</IonNavLink>
      </p>
      <Message ref="loginError" :message="errorMessage"></Message>
    </IonContent>
  </IonPage>
</template>
<script setup lang="ts">

import { 
  IonButton,
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonTitle,
  IonInput,
  IonCheckbox,
  IonNavLink,
  IonInputPasswordToggle
} from '@ionic/vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import Message from '@/components/Message.vue';
import {logUserIn} from '@/utils/requests';
const router = useRouter();
const loginError = ref< typeof Message | null>(null);
const errorMessage = ref('Invalid username or passworddd AAAA');
const username = ref('angolo180');
const password = ref('Angolo.180');

async function login() {
  logUserIn(username.value, password.value).then(() => {
    router.push(`/tabs`);
  }).catch((error) => {
    console.log(`passo per il catch: ${error}`);
    errorMessage.value = error instanceof Error ? error.message : JSON.stringify(error);
    loginError.value?.show();
  });
}
</script>
