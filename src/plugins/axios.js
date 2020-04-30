import Vue from 'vue';
import axios from 'axios';
import router from '../router';

axios.defaults.baseURL = 'http://90.0.0.109/api-relatorios/index.php/';

Vue.use({
    install(Vue){
        Vue.prototype.$http = axios;
    }
});


axios.interceptors.request.use(function (config) {
    config.headers['Authorization'] = `Bearer ${localStorage.getItem("token_hemoam")}`;
    config.headers["Access-Control-Allow-Origin", "*"]; 
    config.headers["Access-Control-Allow-Credentials", "true"]; 
    config.headers["Access-Control-Allow-Methods", "*"]; 
    config.headers["Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"];
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

axios.interceptors.response.use( config => {
  //console.log('axios');
  //this.$toast('Sucesso');
    if(config.request.status === 200){
      //alert('Sucesso');
    }  
    return config;
  }, error => {
    if(error.request.status === 401){
      localStorage.setItem("token_hemoam",null);
      router.push({name: 'login'},{});
    }
    if(error.request.status === 500){
      alert('Erro Geral');
    }    
    return Promise.reject(error);
  });

  Vue.use(require('vue-moment'));