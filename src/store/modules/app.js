import Cookies from 'js-cookie';

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus')
    },
    theme: 'default',
    livenewsChannels: Cookies.get('livenewsChannels') || '[]',
    visitedViews: [],
    cachedViews:[],     //页面缓存
    socket: null
  },
  mutations: {
    SETSOCKET: (state,socket)=>{
      state.socket=socket;
    },
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1);
      } else {
        Cookies.set('sidebarStatus', 0);
      }
      state.sidebar.opened = !state.sidebar.opened;
    },
    ADD_VISITED_VIEWS: (state, view) => {
      if (state.visitedViews.some(v => v.path === view.path)) return
      state.visitedViews.push({ title: view.meta.title, name: view.name, path: view.path,fullPath:view.fullPath,query:view.query,aoe:view.params })
      state.cachedViews.push(view.name)
    },
    DEL_VISITED_VIEWS: (state, view) => {
      
      let index
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          index = i
          break
        }
      }
      state.visitedViews.splice(index, 1)
    },
    DEL_CACHED_VIEW:(state,view)=>{
      
      for(const i of state.cachedViews){
          if(i===view.name){
              const index = state.cachedViews.indexOf(i)
              state.cachedViews.splice(index,1)
              break
          }
      }
    },
    CLEAN_VIEW:(state)=>{
      state.visitedViews=[];
      state.cachedViews=[];
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    addVisitedViews: ({ commit }, view) => {
      !!view && commit('ADD_VISITED_VIEWS', view)
    },
    delVisitedViews: ({ commit,dispatch }, view) => {
      commit('DEL_VISITED_VIEWS', view)
      dispatch('delCachedView',view)
    },
    delCachedView({commit,state},view){
      return new Promise(resolve=>{
          commit('DEL_CACHED_VIEW',view)
          resolve([...state.cachedViews])
      })
  },
  }
};

export default app;
