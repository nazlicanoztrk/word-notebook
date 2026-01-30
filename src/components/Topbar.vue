<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateTo = (routeName) => {
  router.push({ name: routeName })
}
</script>

<template>
  <div class="topbar w-full">
    <q-bar class="bg-black text-white">
      <q-btn flat @click="navigateTo('Words')">
        N
      </q-btn>
      <q-btn flat @click="navigateTo('Cards')">
        Cards
      </q-btn>
       <q-btn flat @click="navigateTo('Test')">
        TEST
      </q-btn>
      <q-btn flat @click="navigateTo('Words')">
        Words
      </q-btn>
      <q-btn flat @click="navigateTo('WordsSettings')">
        Edit Words
      </q-btn>
    </q-bar>
  </div>
</template>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 100;
}

.q-btn {
  color: white;
}

.q-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>