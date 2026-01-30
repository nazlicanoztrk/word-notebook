<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../supabase.js';
import { Notify } from 'quasar';

const wordsData = ref([]);
const loading = ref(false);
const itemsPerPage = ref(10);
const columns = [
  {
    name: 'english_word',
    required: true,
    label: 'English Word',
    align: 'left',
    field: 'english_word',
    sortable: true
  },
    {
    name: 'english_description',
    required: true,
    label: 'English Description',
    align: 'left',
    field: 'english_description',
    sortable: true
  },
  { name: 'turkish_word', align: 'center', label: 'Turkish Word', field: 'turkish_word', sortable: true },
    {
    name: 'turkish_description',
    required: true,
    label: 'Turkish Description',
    align: 'left',
    field: 'turkish_description',
    sortable: true
  },
]

const fetchWords = async () => {
  loading.value = true;
  try {
    const { data, error } = await supabase
      .from('word_table')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    wordsData.value = data || [];
    console.log('Kelimeler:', wordsData.value);
  } catch (error) {
    console.error('Error fetching words:', error);
    Notify.create({
      type: 'negative',
      message: 'Hata: ' + error.message,
      position: 'top'
    });
  } finally {
    loading.value = false;
  }
};

const initialPagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 10
});

onMounted(() => {
  fetchWords();
});
</script>

<template>
  <div class="q-pa-md">
    <q-table
      flat bordered
      v-model:pagination="initialPagination"
      title="Words"
      :rows="wordsData"
      :columns="columns"
      row-key="id"
      binary-state-sort
      :loading="loading"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="english_word" :props="props">
            {{ props.row.english_word }}
            <q-popup-edit v-model="props.row.english_word" v-slot="scope">
              <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
            </q-popup-edit>
          </q-td>
           <q-td key="english_description" :props="props">
            {{ props.row.english_description }}
            <q-popup-edit v-model="props.row.english_description" v-slot="scope">
              <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
            </q-popup-edit>
          </q-td>
          <q-td key="turkish_word" :props="props">
            {{ props.row.turkish_word }}
            <q-popup-edit v-model="props.row.turkish_word" v-slot="scope">
              <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
            </q-popup-edit>
          </q-td>
           <q-td key="turkish_description" :props="props">
            {{ props.row.turkish_description }}
            <q-popup-edit v-model="props.row.turkish_description" v-slot="scope">
              <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
            </q-popup-edit>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
