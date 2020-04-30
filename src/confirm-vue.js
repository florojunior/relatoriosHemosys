import Vue from 'vue';
import VuetifyConfirm from 'vuetify-confirm';
Vue.use(VuetifyConfirm, {
  buttonTrueText: 'Continuar',
  buttonFalseText: 'Cancelar',
  color: 'teal',
  icon: 'warning',
  title: 'Atenção!',
  width: 350,
  property: '$confirm'
})