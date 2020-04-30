import Vue from 'vue'
import Router from 'vue-router'
import Inicial from './components/application/Inicial'
import Transfusoes from './components/application/Transfusoes'
import Descartados from './components/application/Descartados'
import Distribuidos from './components/application/Distribuidos'
import Estoque from './components/application/Estoque'
import DoadorOuroPrata from './components/application/DoadorOuroPrata'
import Faturamento from './components/application/Faturamento'




Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'inicial',
      component: Inicial
    },
    {
      path: '/transfusoes',
      name: 'transfusoes',
      component: Transfusoes
    },
    {
      path: '/descartados',
      name: 'descartados',
      component: Descartados
    },
    {
      path: '/faturamento',
      name: 'faturamento',
      component: Faturamento
    },
    {
      path: '/distribuidos',
      name: 'distribuidos',
      component: Distribuidos
    },
    {
      path: '/doadorouro',
      name: 'doadorouro',
      component: DoadorOuroPrata
    },
    {
      path: '/estoque',
      name: 'estoque',
      component: Estoque
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ './views/Login.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  next();
})

export default router;