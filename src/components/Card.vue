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
const changeLanguageOnly = ref(false);
const shuffleWordsOnly = ref(false);
const fetchWords = async () => {
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
const changeLanguage = computed(()=> 
   wordsData.value.map((d)=>{
    const temp = d.english_word;
    d.english_word = d.turkish_word;
    d.turkish_word = temp;
    return d;
   })
)
const shuffleWords = computed(()=> 
   wordsData.value.sort(() => Math.random() - 0.5)
)
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
        <button 
        class="changeLanguage" 
        :class="{ 'changeLanguage-active': changeLanguageOnly }"
        @click="changeLanguageOnly = !changeLanguageOnly; changeLanguage()"
      >
        <span style="font-size: large;">Change Language</span>                                                         
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m12.87 15.07l-2.54-2.51l.03-.03A17.5 17.5 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35C8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5l3.11 3.11zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2zm-2.62 7l1.62-4.33L19.12 17z"/></svg>
      </button>
      <button 
        class="shuffle" 
        :class="{ 'shuffle-active': shuffleWordsOnly }"
        @click="shuffleWordsOnly = !shuffleWordsOnly; shuffleWords()"
      >
        <span style="font-size: large;">Shuffle</span>                                                         
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22c-1.67 0-3.16-1.5-4.1-4.07c-.07-.2.03-.43.24-.49c.2-.08.42.03.49.23c.81 2.23 2.07 3.56 3.37 3.56c.94 0 1.87-.68 2.62-1.92a.386.386 0 0 1 .66.4C14.38 21.19 13.22 22 12 22m3.91-4.28a.4.4 0 0 1-.11-.02c-.21-.07-.3-.28-.26-.49c.46-1.4.68-3.03.68-4.71c0-3.85-1.25-7.26-3.03-8.36c-.25.36-.69.64-1.19.64c-.76 0-1.39-.62-1.39-1.39S11.24 2 12 2c.77 0 1.4.61 1.41 1.37C15.53 4.5 17 8.21 17 12.5c0 1.75-.25 3.46-.72 4.95c-.05.16-.2.27-.37.27M12 2.77c-.34 0-.62.28-.62.62s.29.61.62.61c.35 0 .64-.27.64-.61s-.29-.62-.64-.62M4.08 18.54c-.77 0-1.4-.63-1.4-1.39c0-.49.26-.93.65-1.18c-.14-2.41 2.35-5.56 6.17-7.75c1.59-.9 3.25-1.55 4.82-1.88c.18-.05.41.08.45.29c.05.21-.08.42-.27.46c-1.5.32-3.09.94-4.6 1.8c-3.44 1.97-5.8 4.79-5.8 6.87c.76.01 1.4.63 1.4 1.39c0 .77-.65 1.39-1.42 1.39m0-2.01c-.34 0-.62.28-.62.62c0 .35.28.62.62.62s.63-.27.63-.62c0-.34-.29-.62-.63-.62m14.42-3.09c-.07 0-.16-.03-.23-.09a.393.393 0 0 1-.04-.55c1.54-1.8 2.07-3.54 1.41-4.66c-.47-.81-1.54-1.26-3.01-1.28c-.22 0-.39-.18-.38-.39c0-.21.18-.37.39-.38c1.75.02 3.06.61 3.67 1.66c.84 1.44.29 3.46-1.49 5.55c-.08.09-.19.14-.32.14m-2 5.46c-2 0-4.56-.74-7-2.13c-1.55-.89-2.93-1.98-4-3.14a.4.4 0 0 1 0-.55c.18-.14.42-.13.57.03c1.01 1.1 2.33 2.14 3.82 2.99c3.31 1.9 6.88 2.53 8.76 1.62c-.08-.17-.15-.37-.15-.57c0-.77.65-1.39 1.42-1.39s1.4.62 1.4 1.39a1.396 1.396 0 0 1-2.15 1.17c-.7.39-1.61.58-2.67.58m3-1.27c.13.08.27.14.42.14a.619.619 0 1 0 0-1.24c-.35 0-.62.28-.62.62c0 .14.05.27.13.38c.04.02.07.06.07.1M4.46 12c-.13 0-.26-.08-.33-.2c-.9-1.55-1.05-2.99-.43-4.06c.84-1.44 2.88-1.98 5.61-1.49c.19.04.35.25.31.45c-.03.21-.23.35-.44.3C6.82 6.59 5 7 4.37 8.13c-.48.82-.33 1.98.43 3.28c.1.19.04.42-.15.53c-.06.03-.12.06-.19.06m7.75 1.4a.92.92 0 0 1-.4-1.8c.5-.1 1 .21 1.1.71c.09.49-.21.98-.7 1.09"/></svg>      </button>
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
.changeLanguage {
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

.changeLanguage:hover {
  transform: scale(1.05);
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}

.changeLanguage-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
}

.changeLanguage-active svg {
  fill: white;
}

.shuffle {
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

.shuffle:hover {
  transform: scale(1.05);
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.shuffle:hover svg {
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