<template>
    <!-- <Menu></Menu> -->
    <!--  <Header></Header> -->
    <Content  class="d-flex flex-grow-1"></Content>
    <!--  <Footer></Footer>-->
</template>

<script>

import Header from '@/components/template/Footer';
import Content from '@/components/template/Content';
import Footer from '@/components/template/Footer';
import Menu from '@/components/template/Menu';

export default {
  data: () => (
    {
      isLogged: false
    }
  ),
  created: function(){
    this.isLogged = (localStorage.getItem("token_hemoam") !== 'null');
  },
  components: { 
    Header, Content, Footer, Menu
  },
};
</script>
