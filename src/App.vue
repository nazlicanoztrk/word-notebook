<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from './supabase.js';
import Topbar from './components/Topbar.vue';

const router = useRouter();
const user = ref(null);
const loading = ref(true);

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  console.log('first', session)
  user.value = session?.user ?? null;
  loading.value = false;

  if (!user.value) {
    router.push('/login');
  }

  supabase.auth.onAuthStateChange((event, session) => {
    console.log('event, session', event, session)
    user.value = session?.user ?? null;
    
    if (event === 'SIGNED_OUT') {
      router.push('/login');
    } else if (!user.value && router.currentRoute.value.path !== '/login') {
      router.push('/login');
    }
  });
});
</script>

<template>
  <div v-if="loading" class="loading-screen">
    <q-spinner color="primary" size="50px" />
  </div>
  
  <div v-else>
    <header v-if="user">
      <Topbar />
    </header>

    <main>
      <router-view />
    </main>
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
}

main {
  min-height: calc(100vh - 60px);
}

.loading-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
