<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../supabase.js';
import { Notify } from 'quasar';

const slide = ref(0);
const loading = ref(false);
const wordsData = ref([]);

const fetchWords = async () => {
  loading.value = true;
  try {
    const { data, error } = await supabase
      .from('word_table')
      .select('*')
      .eq('select', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    wordsData.value = data || [];
    console.log('Favorite words:', wordsData.value);
    
    if (wordsData.value.length > 0) {
      slide.value = 0;
    }
  } catch (error) {
    console.error('Error fetching words:', error);
    Notify.create({
      type: 'negative',
      message: 'Error: ' + error.message,
      position: 'top'
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchWords();
});
</script>

<template>
  <div class="q-pa-md">
    <div v-if="loading" class="loading-container">
      <q-spinner color="primary" size="50px" />
    </div>

    <div v-else class="q-gutter-md">
      <q-carousel
        v-model="slide"
        transition-prev="scale"
        transition-next="scale"
        swipeable
        animated
        control-color="white"
        navigation
        
        arrows
        height="300px"
        class="bg-light-300 text-white  rounded-borders carousel-container"
      > 
        <q-carousel-slide 
          v-for="(word, index) in wordsData" 
          :key="word.id"
          :name="index" 
          class="carousel-slide-content"
        >
          <div class="flip-box">
            <div class="flip-box-inner">
              <div class="flip-box-front">
                <q-icon name="translate" size="50px" class="q-mb-md" />
                <div class="text-h4">{{ word.english_word }}</div>
                <div class="text-caption q-mt-md">{{ word.english_description }}</div>
              </div>
              <div class="flip-box-back">
                <q-icon name="school" size="50px" class="q-mb-md" />
                <div class="text-h4">{{ word.turkish_word }}</div>
                <div class="text-caption q-mt-md">{{ word.turkish_description }}</div>
              </div>
            </div>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>
  </div>
</template>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.no-words {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #999;
}

.no-words p {
  margin-top: 16px;
  font-size: 18px;
}



.carousel-slide-content {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}

.flip-box {
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.flip-box-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

.flip-box:hover .flip-box-inner {
  transform: rotateY(180deg);
}

.flip-box-front,
.flip-box-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.flip-box-front {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.flip-box-back {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  transform: rotateY(180deg);
}

.flip-box-front .text-h4,
.flip-box-back .text-h4 {
  word-break: break-word;
  max-width: 100%;
  font-weight: bold;
}

@media (max-width: 768px) {
  .flip-box {
    width: 300px;
    height: 200px;
  }
  
  .flip-box-front .text-h4,
  .flip-box-back .text-h4 {
    font-size: 1.5rem;
  }
}
</style>