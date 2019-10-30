import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getters'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {},
  state: {
    authorityMenuList: [],
    authorityActionList: [],
  },
  mutations: {
    updateState(state, payload){
      state = {
        ...state,
        ...payload,
      }
    },
    getDataFormLocalStorage(state){
      state = {
        authorityMenuList: JSON.parse(localStorage.authorityMenuList),
        authorityActionList: JSON.parse(localStorage.authorityActionList),
        useAuthority: window.defaultConfig.useAuthority,
      }
    }
  },
  actions: {

  },
  getters
})
