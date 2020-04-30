<template>
    <div class="d-flex flex-column flex-grow-1 justify-center align-content-center">
        <Menu v-if="!hide"></Menu>
        <Header v-if="!hide"></Header>
            <div class="content d-flex flex-grow-1 justify-center align-content-center">
                <router-view></router-view>
            </div>
    </div>
</template>

<script>
import Header from '@/components/template/Footer';
import Footer from '@/components/template/Footer';
import Menu from '@/components/template/Menu';

export default {
    created(){
    },
    components: { 
        Header, Footer, Menu
    },
    computed: {
        hide () {
            return this.$route.path == '/login' || this.$route.path == '/cadastrar-senha' || this.$route.path == '/cadastrar-senha/' || this.$route.path == '/resetar-senha/' || this.$route.path == '/resetar-senha'; 
        }
    }
}
</script>

<style>

</style>
