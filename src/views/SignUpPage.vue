<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Sign Up</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <IonInput placeholder="Username"></IonInput>
      <IonInput placeholder="Password"></IonInput>
      <IonButton onClick={signup}>Sign Up</IonButton>
      <p>
        Already have an account? 
        <IonNavLink routerLink="/login">Login</IonNavLink>
      </p>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { IonButton, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonNavLink } from '@ionic/vue';

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


</script>
