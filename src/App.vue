<template>
  <v-app>
    <Home/>
    <v-footer
      color="transparent"
      app
    >
      <v-spacer />

      <span class="caption font-weight-thin white--text">Hemoam Soluções em TI - 2019</span>
      <v-spacer />
      <a  href="#/sobreNos" class="caption font-weight-thin white--text">Sobre Nós</a>
    </v-footer>
  </v-app>
</template>

<script>
import Home from '@/views/Home';
export default {
  name: 'App',
  components: {
    Home
  },
  data: () => ({}),
};
</script>

<style>

</style>

