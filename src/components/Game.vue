<template>
  <div>
    {{ board }}
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import { useBoard } from '@/composables/board';

export default defineComponent({
  setup() {
    const { createBoard } = useBoard();
    const board = createBoard();

    return {
      board,
    };
  },
});
</script>

<style scoped lang='postcss'>

</style>
