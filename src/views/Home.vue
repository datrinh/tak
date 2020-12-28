<template>
  <div>
    <Game />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Game from '@/components/Game.vue';

export default defineComponent({
  name: 'Home',
  components: {
    Game,
  },
});
</script>
