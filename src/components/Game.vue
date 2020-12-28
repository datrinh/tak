<template>
  <div class="flex">
    <Board :board="board" @clicked-field="onClickField" />
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue';
import { Stone, useBoard } from '@/composables/board';
import Board from '@/components/Board.vue';

interface FieldEvent {
  field: Stone[];
  x: number;
  y: number;
}

export default defineComponent({
  components: { Board },
  setup() {
    const { createBoard, placeNewStone } = useBoard();
    const board = ref(createBoard());

    const onClickField = (ev: FieldEvent) => {
      board.value = placeNewStone(board.value, { ...ev }, 'FLAT');
    };

    return {
      board,
      onClickField,
    };
  },
});
</script>
