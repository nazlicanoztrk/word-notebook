<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../supabase.js';
import { Notify } from 'quasar';

const wordsData = ref([]);
const loading = ref(false);

const columns = [
  {
    name: 'english_word',
    required: true,
    label: 'English Word',
    align: 'left',
    field: 'english_word',
    sortable: true
  },
  { name: 'turkish_word', align: 'center', label: 'Turkish Word', field: 'turkish_word', sortable: true },
  { name: 'select', align: 'center', label: 'Select', field: 'select' },
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

const toggleSelect = async (row) => {
  try {
    const newSelectValue = !row.select;
    const { data, error } = await supabase
      .from('word_table')
      .update({ select: newSelectValue })
      .eq('id', row.id)
      .select();
    if (error) throw error;

    row.select = newSelectValue;
    Notify.create({
      type: 'positive',
      message: newSelectValue ? 'Selected ✓' : 'Selection removed',
      position: 'top',
      timeout: 1000
    });
  } catch (error) {
    console.error('Error updating select:', error);
    Notify.create({
      type: 'negative',
      message: 'Error: ' + error.message,
      position: 'top'
    });
  }
};

onMounted(() => {
  fetchWords();
});
</script>
<template>
  <div class="q-pa-md word-table">
    <q-table
      flat bordered
      title="Words Table"
      :rows="wordsData"
      :columns="columns"
      row-key="id"
      :loading="loading"
    >
      <template v-slot:body-cell-select="props">
        <q-td :props="props">
          <q-checkbox
            :model-value="props.row.select"
            @update:model-value="toggleSelect(props.row)"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>