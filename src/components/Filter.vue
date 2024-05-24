<template>
  <div>
    <input type="text" v-model="nameFilter" placeholder="Имя">
    <select v-model="statusFilter">
      <option value="">Все</option>
      <option value="Alive">Живой</option>
      <option value="Dead">Мертвый</option>
      <option value="unknown">Неизвестно</option>
    </select>
    <button @click="emitFilters">Применить</button>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup(props, { emit }) { // Доступ к emit через контекст
    const nameFilter = ref('');
    const statusFilter = ref('');

    const emitFilters = () => {
      // Передаем фильтры родителю
      emit('applyFilters', {
        name: nameFilter.value,
        status: statusFilter.value,
      });
    };

    return {
      nameFilter,
      statusFilter,
      emitFilters,
    };
  },
};
</script>