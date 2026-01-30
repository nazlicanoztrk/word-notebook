<script setup>
import { ref } from 'vue';
import { supabase } from '../supabase.js';
import { Notify } from 'quasar';

const englishword = ref('');
const turkishword = ref('');
const select = ref(false);
const loading = ref(false);
const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  console.log("login", data, error)
}
const onSubmit = async () => {
  loading.value = true;
  
  try {
    const { data, error } = await supabase
      .from('word_table')
      .insert([
        { 
          english_word: englishword.value, 
          turkish_word: turkishword.value,
          select: select.value
        }

      ])
      .select();
    console.log('Inserted data:', data);
    if (error) throw error;

    Notify.create({
      type: 'positive',
      message: 'Kelime başarıyla eklendi!',
      position: 'top'
    });

    englishword.value = '';
    turkishword.value = '';

  } catch (error) {
    console.error('Error:', error);
    Notify.create({
      type: 'negative',
      message: 'Hata: ' + error.message,
      position: 'top'
    });
  } finally {
    loading.value = false;
  }
};

</script>
<template>
  <div class="q-pa-md" style="max-width: 400px">

    <q-form
      @submit="onSubmit"
      class="q-gutter-md"
    >
      <q-input
        filled
        v-model="englishword"
        label="English word *"
        hint="Type the English word"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      />

      <q-input
        filled
        v-model="turkishword"
        label="Turkish word *"
        hint="Type the Turkish word"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'Please type your Turkish word',
          val => val.length > 0 || 'Please type a real Turkish word'
        ]"
      />
       <q-toggle v-model="select" label="Favorime Ekle" />

      <div>
        <q-btn 
          label="Submit" 
          type="submit" 
          color="primary"
          :loading="loading"
          :disable="loading"
        />
      </div>
    </q-form>

  </div>
</template>