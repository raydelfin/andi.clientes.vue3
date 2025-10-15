<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-menu-button></ion-menu-button>
      </ion-buttons>
      <ion-title>{{ title }}</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="btnMiPerfil()">
          <ion-avatar style="width: 28px; height: 28px;">
            <ion-img :src="avatarSrc" />
          </ion-avatar>
        </ion-button>
        <ion-button>
          <!-- Notificaciones -->
          <div v-if="verIcoNotif">
            <ion-badge>
              <ion-icon :icon="notifications"></ion-icon>
            </ion-badge>
          </div>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
</template>

<script setup lang="ts">
  import { 
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, 
    IonMenuButton, IonPopover, IonContent, IonList, IonItem, IonAvatar,
    IonBadge
  } from '@ionic/vue'
  import { defineProps, ref, computed, onMounted } from 'vue'
  import { 
    notifications
  } from 'ionicons/icons'
 import { useI18n } from 'vue-i18n'
 import { useRouter } from 'vue-router'

  const { t, locale } = useI18n()
  const router = useRouter()
  const verAvatar = ref(true)
  const verIcoNotif = ref(true)
  const interfaz = ref('')
  const avatarSrc = ref('/img/avatar.png')
// ----------------------------------------------------
// PROPS (Propiedades que recibirá el componente)
// ----------------------------------------------------
const props = defineProps({
  title: {
    type: String,
    default: 'ANDI CLIENTES'
  }
})
// ----------------------------------------------------
// FUNCIONES DE ACCIÓN
// ----------------------------------------------------
onMounted(() => {
    avatarSrc.value = localStorage.getItem('urlImg')
  })
const btnMiPerfil = () => {
  router.push('/app/MiPerfil')
}
</script>