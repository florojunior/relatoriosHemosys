<template>
    <v-content >
      <v-container
        fill-height
      >
      </v-container>   
    </v-content>
</template>

<script>
export default {
  created: function(){
    this.$http.get('/verifica-autenticacao').then(res => {
    });
  },
  data: () => ({

  }),
  methods:{
  }
}
</script>

<style>

</style>
