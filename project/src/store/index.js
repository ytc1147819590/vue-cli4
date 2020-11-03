import Vue from 'vue'
import Vuex from 'vuex'
import state from './modules/state'
import getters from './modules/getters'
import actions from './modules/actions'
import mutations from './modules/mutations'

import persistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const store = new Vuex.Store({
    state,
    getters,
    actions,
    mutations,

    // 设置为浏览器缓存
    plugins: [persistedState(
        { storage: window.sessionStorage }
    )]
})

export default store;