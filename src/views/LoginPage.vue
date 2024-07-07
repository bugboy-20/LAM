<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-button @click="login">Login</ion-button>
      <ion-toast
        :isOpen="loginError"
        message="Login failed. Please try again."
        position="top"
        duration="2000"></ion-toast>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">

import { IonButton, IonPage, IonHeader, IonToolbar, IonContent, IonTitle, IonToast} from '@ionic/vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const loginError = ref(false);

async function singup() {
  await fetch('/api/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'angolo180',
      password: 'Angolo.180',
    }),
  }).then((response) => {
    if (response.ok) {
      console.log( response.json());
    }
    throw new Error('Network response was not ok.');
  }).catch((error) => {
    console.error('There has been a problem with your fetch operation:', error);
  });
  //TODO login after signup
}

async function login() {
  if (loginError.value) {
    return; // prevent multiple clicks
  }
  await fetch(`/api/auth/token`, {
    mode: 'cors',
    method: 'POST',
    body: new URLSearchParams({
      username: 'angylo180',
      password: 'Angolo.180',
    })}).then((response) => {
      console.log('after fetch');
      if(response.status == 400) {
        loginError.value = true;
        setTimeout(() => {
          loginError.value = false;
        }, 2000);
        console.log('status 400');
        //loginError.value = false;
        throw new Error('Network response was not ok.');
      }
      console.log('status 200');
      if(response.status == 200) {
        loginError.value = false;
        console.log(response);
        return router.push('/tabs/');
      }
      console.log(response);
    }).catch((error) => {
      console.error('There has been a problem with your fetch operation:', error);
    });
}
</script>
