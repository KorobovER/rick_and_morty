<template>
  <div class="container">
    <section v-for="character in filteredCharacters" :key="character.id">
      <img :src="character.image" :alt="'Image of ' + character.name">
      <div class="info">
        <div class="section">
          <h2>{{ character.name }}</h2>
          <div class="status-char">
            <div :style="{ background: getStatusBg(character.status) }" class="circle"></div>
            <span>Status: {{ character.status }} - {{ character.species }}</span>
          </div>
        </div>
        <div class="section">
          <span class="text-gray">Last known location:</span>
          <p>{{ character.location.name }}</p>
        </div>
        <div class="section">
          <span class="text-gray">First seen in:</span>
          <p>{{ firstAppearanceEpisodes[character.id] }}</p>
        </div>
      </div>
    </section>
  </div>
  <div class="filter-pagination">
    <Filter @applyFilters="handleFilters" />
    <Pagination :currentPage="currentPage" :totalPages="totalPages" @previousPage="previousPage" @nextPage="nextPage" />
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue';
import Filter from './Filter.vue'; // Импортируем компонент фильтрации
import Pagination from './Pagination.vue'; // Импортируем компонент пагинации

export default {
  components: {
    Filter,
    Pagination,
  },
  props: {
    characters: { type: Object, required: true },
  },
  setup(props) {
    const firstAppearanceEpisodes = ref({});
    const currentPage = ref(1);
    const itemsPerPage = 6;
    const nameFilter = ref('');
    const statusFilter = ref('');

    const displayedCharacters = computed(() => {
      const startIndex = (currentPage.value - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return props.characters.data.slice(startIndex, endIndex);
    });

    const filteredCharacters = computed(() => {
      return displayedCharacters.value.filter((character) => {
        return (
          (!nameFilter.value || character.name.toLowerCase().includes(nameFilter.value.toLowerCase())) &&
          (!statusFilter.value || character.status === statusFilter.value)
        );
      });
    });

    const totalPages = computed(() => {
      return Math.ceil(props.characters.data.length / itemsPerPage);
    });

    function getStatusBg(status) {
      return status === 'Alive' ? 'green' : status === 'Dead' ? 'red' : 'gray';
    }

    function previousPage() {
      currentPage.value--;
    }

    function nextPage() {
      currentPage.value++;
    }

    const handleFilters = (filters) => {
      nameFilter.value = filters.name;
      statusFilter.value = filters.status;
    };

    onMounted(() => {
      props.characters.data.forEach((character) => {
        fetch(character.episode[0])
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((episodeData) => {
            firstAppearanceEpisodes.value[character.id] = episodeData.name;
          })
          .catch((error) => {
            console.error('Проблема с fetch операцией:', error);
            firstAppearanceEpisodes.value[character.id] = 'Unknown';
          });
      });
    });

    return {
      firstAppearanceEpisodes,
      getStatusBg,
      displayedCharacters,
      filteredCharacters,
      currentPage,
      totalPages,
      previousPage,
      nextPage,
      handleFilters,
    };
  },
};
</script>



<style scoped>
section {
  display: flex;
  width: 550px;
  height: 220px;
  background: rgb(60, 62, 68);
  margin: 0.75rem;
  border-radius: 25px;
}
img{
  border-radius: 25px 0 0 25px ;
}
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 98%;
  margin: auto;
}
.info {
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
}
.section{
    display: flex;
    flex-direction: column;
    flex: 1 1 0%;

}
.status-char{
    display: flex;
    align-items: center;

}
.circle{
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 10px;
}

</style>