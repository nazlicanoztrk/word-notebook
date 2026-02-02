<script setup>
import { ref } from 'vue';
import { supabase } from '../supabase.js';
import { Notify } from 'quasar';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const loading = ref(false);

const signIn = async () => {
  if (!email.value || !password.value) {
    Notify.create({
      type: 'warning',
      message: 'Please enter email and password',
      position: 'top'
    });
    return;
  }

  loading.value = true;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) throw error;

    Notify.create({
      type: 'positive',
      message: 'Login successful!',
      position: 'top'
    });

    router.push('/');
  } catch (error) {
    console.error('Login error:', error);
    Notify.create({
      type: 'negative',
      message: error.message,
      position: 'top'
    });
  } finally {
    loading.value = false;
  }
};


</script>

<template>
  <div class="login-container">
    <q-card class="login-card">
      <q-card-section class="login-header">
        <div class="text-h4">Welcome</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="signIn" class="q-gutter-md">
          <q-input
            v-model="email"
            filled
            type="email"
            label="Email *"
            hint="Enter your email"
            :rules="[val => !!val || 'Email is required']"
          >
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>

          <q-input
            v-model="password"
            filled
            type="password"
            label="Password *"
            hint="Enter your password"
            :rules="[val => !!val || 'Password is required']"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
          </q-input>

          <div class="q-mt-md">
            <q-btn
              type="submit"
              label="Sign In"
              color="primary"
              class="full-width"
              :loading="loading"
              size="lg"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.login-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
}
</style>