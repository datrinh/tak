<template>
  <div class="flex flex-col">
    <div class="flex" v-for="(row, y) in board" :key="row">
      <a
        class="flex w-20 h-20 border cursor-pointer"
        v-for="(field, x) in row"
        :key="field"
        @click="$emit('clicked-field', { field, x, y })"
      >
        {{ field }}
      </a>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import { Board } from '@/composables/board';

export default defineComponent({
  props: {
    board: Array as () => Board,
  },
  setup() {
    return {};
  },
});
</script>
