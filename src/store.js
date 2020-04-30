import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      token:{},
      userData:{},
      isLogged: false,
      perfil:''
  },
  mutations: {
      setToken(state, token){
        state.token = token;
      },
      setUserData(state, user){
        state.userData = user;
      },
      setLoggedInsetToken(state, isLogged){
        state.isLogged = isLogged;
      },
      setPerfilUsuario(state, perfil){
        state.perfil = perfil;
      }
  },
  getters: {
    getToken: state => {
      return state.token
    },
    getUserData: state => {
      return state.userData
    },
    isLogged: state => {
      return state.isLogged;
    },
    getPerfil: state =>{
      return state.userData.perfil;
    }
  },
  actions: {

  }
})
