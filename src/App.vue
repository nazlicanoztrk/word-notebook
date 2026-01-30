<script setup>
import Topbar from './components/Topbar.vue';
</script>

<template>
  <header>
    <Topbar />
  </header>

  <main>
    <router-view />
  </main>
</template>

<style>
body {
  margin: 0;
  padding: 0;
}

main {
  min-height: calc(100vh - 60px);
}
</style>
