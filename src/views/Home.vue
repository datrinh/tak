<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <Game msg="Welcome to Your Vue.js + TypeScript App"/>
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
