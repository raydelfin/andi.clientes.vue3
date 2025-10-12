<script setup lang="ts"></script>

<template>
  <!--
  <ion-app>
    <ion-router-outlet> 
      <router-view />
    </ion-router-outlet> 
  </ion-app>
  -->
  <ion-split-pane content-id="main-content">
    <ion-menu content-id="main-content" type="overlay">
      <ion-header>
        <ion-toolbar>
          <ion-title>Menú</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-list id="inbox-list">
          <ion-item button lines="none" router-link="/home" router-direction="root">
            <ion-icon :icon="homeOutline"></ion-icon>
            <ion-label>Inicio</ion-label>
          </ion-item>
          <ion-item button lines="none" router-link="/settings" router-direction="forward">
            <ion-icon :icon="settingsOutline"></ion-icon>
            <ion-label>Configuración</ion-label>
          </ion-item>
          </ion-list>
      </ion-content>
    </ion-menu>

    <ion-router-outlet> 
      <router-view />
    </ion-router-outlet> 

  </ion-split-pane>
</template>

<style scoped></style>
