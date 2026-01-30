<script setup>
import { ref, onMounted, computed } from 'vue';
import { supabase } from '../supabase.js';
import { Notify } from 'quasar';

const loading = ref(false);
const wordsData = ref([]);
const filter = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(16);
const favoriteOnly = ref(false);
 
const fetchWords = async () => {
    console.log('favori', favoriteOnly.value)
  loading.value = true;
  try {
    const { data, error } = await supabase
      .from('word_table')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (favoriteOnly.value) {
      wordsData.value = data.filter(word => word.select) || [];
    } else {
    wordsData.value = data || [];
    }
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

const toggleSelect = async (word) => {
  try {
    const newSelectValue = !word.select;
    
    const { error } = await supabase
      .from('word_table')
      .update({ select: newSelectValue })
      .eq('id', word.id);
    
    if (error) throw error;

    word.select = newSelectValue;
    
    Notify.create({
      type: 'positive',
      message: newSelectValue ? 'Selected ✓' : 'Selection removed',
      position: 'top',
      timeout: 1000
    });
    
    await fetchWords();
  } catch (error) {
    console.error('Error updating select:', error);
    Notify.create({
      type: 'negative',
      message: 'Error: ' + error.message,
      position: 'top'
    });
  }
};

const filteredWords = computed(() => {
  if (!filter.value) return wordsData.value;
  
  const searchTerm = filter.value.toLowerCase();
  return wordsData.value.filter(word => 
    word.english_word?.toLowerCase().includes(searchTerm) ||
    word.turkish_word?.toLowerCase().includes(searchTerm)
  );
});

const totalPages = computed(() => 
  Math.ceil(filteredWords.value.length / itemsPerPage.value)
);

const paginatedWords = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredWords.value.slice(start, end);
});

const changePage = (page) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const favoritesCount = computed(() => 
  wordsData.value.filter(word => word.select === true).length
);

onMounted(() => {
  fetchWords();
});
</script>
<template>
  <div class="container">
    <div class="search-container">
      <q-input 
        v-model="filter" 
        outlined
        dense
        placeholder="Search words..."
        class="search-input"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
        <template v-slot:append v-if="filter">
          <q-icon 
            name="close" 
            @click="filter = ''" 
            class="cursor-pointer"
          />
        </template>
      </q-input>
      <button 
        class="favorite" 
        :class="{ 'favorite-active': favoriteOnly }"
        @click="favoriteOnly = !favoriteOnly; fetchWords()"
      >
        <span style="font-size: large;">Favorites</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="currentColor" d="M7 22h2v2H7zm4 2h2v-2h-2zm4 0h2v-2h-2zm7-14.76l-7.19-.62L12 2L9.19 8.62L2 9.24l5.45 4.73L5.82 21L12 17.27L18.18 21l-1.64-7.03z" />
        </svg>
      </button>
      <div class="items-per-page">
        <span>Show:</span>
        <q-select
          v-model="itemsPerPage"
          :options="[8, 16, 24, 32, 40]"
          dense
          outlined
          style="width: 80px; margin-left: 8px;"
          @update:model-value="currentPage = 1"
        />
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <q-spinner color="primary" size="50px" />
    </div>

    <div v-else class="flip-container">
      <div 
        v-for="word in paginatedWords" 
        :key="word.id" 
        class="flip-box"
      >
        <div class="checkbox-wrapper">
          <q-checkbox
            :model-value="word.select"
            @click="toggleSelect(word)"
            color="primary"
            size="sm"
          />
        </div>
        
        <div class="flip-box-inner">
          <div class="flip-box-front">
            <h2>{{ word.english_word }}</h2>
          </div>
          <div class="flip-box-back">
            <h2>{{ word.turkish_word }}</h2>
          </div>
        </div>
      </div>
    </div>

    <div v-if="totalPages > 1" class="pagination">
      <q-pagination
        v-model="currentPage"
        :max="totalPages"
        :max-pages="20"
        direction-links
        boundary-links
        color="primary"
        @update:model-value="changePage"
      />
      

    </div>
  </div>
</template>
<style scoped>
.q-checkbox__bg.absolute {
    color: white;
}
.favorite {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  padding: 15px;
  border-radius: 1rem;
  border: 2px solid transparent;
  background-color: white;
  transition: all 0.3s ease;
}

.favorite:hover {
  transform: scale(1.05);
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}

.favorite-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
}

.favorite-active svg {
  fill: white;
}

.container {
  text-align: center;
  width: 100%;
  padding: 20px;
}

.search-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 250px;
  max-width: 500px;
}

.items-per-page {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.flip-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.flip-box {
  background-color: transparent;
  height: 200px;
  perspective: 1000px;
  cursor: pointer;
  position: relative;
}

.checkbox-wrapper {
  position: absolute;
  right: 0px;
  z-index: 10;
  background: transparent;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.flip-box-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.flip-box:hover .flip-box-inner {
  transform: rotateY(180deg);
}

.flip-box-front, .flip-box-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.flip-box-front {
  background: linear-gradient(135deg, #667eea 0%, #331452 100%);
  color: white;
}

.flip-box-back {
  background: linear-gradient(135deg, #f093fb 0%, #7a202c 100%);
  color: white;
  transform: rotateY(180deg);
}

.language-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.flip-box h2 {
  font-size: 1.5rem;
  margin: 0;
  word-break: break-word;
  font-weight: 700;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: #999;
}

.no-results p {
  margin-top: 16px;
  font-size: 18px;
}

.pagination {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-top: 40px;
}

.pagination-info {
  font-size: 14px;
  color: #666;
}

@media (max-width: 768px) {
  .flip-container {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 20px;
  }
  
  .flip-box {
    height: 150px;
  }
  
  .flip-box h2 {
    font-size: 1.2rem;
  }
  
  .search-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input {
    max-width: 100%;
  }
}
</style>