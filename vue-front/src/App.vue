<template>
  <v-app>
    <vertical-nav-menu></vertical-nav-menu>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import VerticalNavMenu from './components/vertical-nav-menu/VerticalNavMenu.vue'

export default Vue.extend({
  // components: VerticalNavMenu,
  name: 'App',

  data: () => ({
    //
  }),
  // setup() {
  //   const isDrawerOpen = null

  //   return {
  //     isDrawerOpen
  //   }
  // }
})
</script>
