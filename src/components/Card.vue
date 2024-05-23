<template>
    
  <section v-for="character in characters.data" :key="character.id">
    <img :src="character.image" :alt="'Image of ' + character.name">
    <div class="info">
        <div class="section">
            <h2>{{ character.name }}</h2>
            <div class="status-char"> <div :style="{ background: getStatusBg(character.status) }" class="circle"></div> <span>Status: {{ character.status }} - Species: {{ character.species }}</span></div>
        </div>
        <div class="section">
            <span class="text-gray">Last known location:</span>
            <p>{{ character.location.name }}</p>
        </div>
        <div class="section">
            <span class="text-gray">First seen in:</span>
            <p>{{ firstAppearanceEpisodes[character.id]}}</p>
        </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  props: {
    characters: { type: Object, required: true },
  },
  setup(props) {
    const firstAppearanceEpisodes = ref({});
    
    function getStatusBg(status) {
      return status === 'Alive' ? 'green' : status === 'Dead' ? 'red' : 'gray';
    } // Создаем объект для хранения данных о первых эпизодах

    onMounted(() => {
      props.characters.data.forEach((character) => {
        fetch(character.episode[0]) // Получаем URL первого эпизода для каждого персонажа
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((episodeData) => {
            // Сохраняем название первого эпизода в объекте firstAppearanceEpisodes
            firstAppearanceEpisodes.value[character.id] = episodeData.name;
            console.log(firstAppearanceEpisodes[character.id]);
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