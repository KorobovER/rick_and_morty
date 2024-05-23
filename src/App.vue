<template>
  <div class="container">
    <Card :characters="characters"></Card>
  </div>
</template>

<script>
import { reactive, onMounted } from 'vue';
import Card from './components/Card.vue';

export default {
  components: {
    Card
  },
  setup() {
    const characters = reactive({
      data: []
    });

    onMounted(() => {
      fetch('https://rickandmortyapi.com/api/character')
        .then((res) => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then((data) => {
          characters.data = data.results;
        })
        .catch((error) => {
          console.error('Произошла ошибка при запросе:', error);
        });
    });

    return {
      characters
    };
  }
};
</script>

<style>
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 98%;
  margin: auto;
}
</style>