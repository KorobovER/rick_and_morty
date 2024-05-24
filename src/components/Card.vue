<template>
  <div class="container">
    <section v-for="character in displayedCharacters" :key="character.id">
      <img :src="character.image" :alt="'Image of ' + character.name">
      <div class="info">
        <div class="section">
          <h2>{{ character.name }}</h2>
          <div class="status-char">
            <div :style="{ background: getStatusBg(character.status) }" class="circle"></div>
            <span>Status: {{ character.status }} - Species: {{ character.species }}</span>
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
  <button @click="previousPage" :disabled="currentPage === 1">Previous</button>
  <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
</template>

<script>
import { ref, onMounted, computed } from 'vue';

export default {
  props: {
    characters: { type: Object, required: true },
  },
  setup(props) {
    const firstAppearanceEpisodes = ref({});
    const currentPage = ref(1);
    const itemsPerPage = 6;

    const displayedCharacters = computed(() => {
      const startIndex = (currentPage.value - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return props.characters.data.slice(startIndex, endIndex);
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
      currentPage,
      totalPages,
      previousPage,
      nextPage,
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
button{
  color: black
}
</style>