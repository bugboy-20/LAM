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
const router = useRouter();
const loginError = ref< typeof Message | null>(null);
const errorMessage = ref('Invalid username or passworddd AAAA');
const username = ref('angolo180');
const password = ref('Angolo.180');

async function login() {
  if (loginError.value?.isShown) {
    return; // prevent multiple clicks
  }
  await fetch(`/api/auth/token`, {
    mode: 'cors',
    method: 'POST',
    body: new URLSearchParams({
      username: username.value,
      password: password.value,
    })}).then((response) => {
      console.log('after fetch');
      if(response.status == 400) {
        errorMessage.value = 'Invalid username or password sgrra';
        console.log('status 400');
        //loginError.value = false;
        throw new Error('Network response was not ok.');
      }
      console.log('status 200');
      if(response.status == 200) {
        console.log(response);
        return response.json();
      }
      console.log(response);
    }).then((json) => {
      console.log(json);
      const token = json.client_secret;
      if (!token) {
        throw new Error('No token found in response.');
      }
      return router.push(`/tabs/?token=${token}`); // TODO: secure this
    }).catch((error) => {
      console.error('There has been a problem with your fetch operation:', error);
    })
    .catch((error) => {
      console.error('There has been a problem with your fetch operation:', error);
    });
}
</script>
