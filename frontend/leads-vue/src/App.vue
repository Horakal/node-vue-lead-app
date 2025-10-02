<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const showAdminNav = computed(() => route.path.startsWith('/admin'))
</script>

<template>
  <v-app>
    <v-app-bar app color="primary" dark elevation="2">
      <v-app-bar-nav-icon />
      <v-toolbar-title class="d-flex align-center">
        <v-icon class="me-2">mdi-rocket-launch</v-icon>
        Lead App
      </v-toolbar-title>
      <v-spacer />
      <v-btn text to="/">
        <v-icon left>mdi-home</v-icon>
        Home
      </v-btn>
      <v-btn text to="/admin">
        <v-icon left>mdi-view-dashboard</v-icon>
        Admin
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-if="showAdminNav"
      :permanent="$vuetify.display.smAndUp"
      width="220"
      class="pa-2"
    >
      <v-list nav dense>
        <v-list-item>
          <v-list-item-title class="text-h6">Admin Navigation</v-list-item-title>
        </v-list-item>
        <v-divider />
        <v-list-item link to="/admin">
          <v-list-item-icon>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/leads/1">
          <v-list-item-icon>
            <v-icon>mdi-account-box</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Example Lead</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="d-flex align-center justify-center" style="padding: 0px">
      <v-container>
        <RouterView />
      </v-container>
    </v-main>

    <v-footer app padless color="grey lighten-4">
      <v-row class="mx-4" align="center" justify="space-between">
        <v-col cols="12" sm="6">© 2025 — Lead App</v-col>
        <v-col cols="12" sm="6" class="text-sm-end">Made with Vuetify</v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}
v-main {
  --v-layout-left: 0px !important ;
}
.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }
  .logo {
    margin: 0 2rem 0 0;
  }
  v-container {
    padding: 0px !important ;
  }
  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
