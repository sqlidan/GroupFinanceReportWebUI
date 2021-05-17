import {asyncRouterMap,constantRouterMap} from 'src/router'
import {deepClone} from 'utils'
import path from 'path'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}


function routeDispose(routeList,layer,firstLayerItem) {
  layer++
  routeList.forEach(item => {
    if(item.children && item.children.length >0){
      if(layer===2){   //有3级菜单
        //修改3级菜单中的path,把二级菜单中的path归并到三级菜单的path中去
        item.children.forEach(item1 => {
          item1.path = item.path + '/' + item1.path//path.resolve(item.path, item1.path)
         /// item1.path = item.path.substring(1,item.path.length)
        })

        //把3级菜单添加到2级菜单中
        firstLayerItem.children =([...firstLayerItem.children,...item.children])
        delete item.children
      }
      if(layer===1){ 
        //有2级菜单
        routeDispose(item.children,layer,item)
      }
        
    }
      
  })
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles  获取的用户拥有权限
 */
function filterAsyncRouter(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    allRoutes: [],    //!深复制路由表中的asyncRouterMap变量，注意component中的import异步加载被深复制后会有问题()。
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    },
    SET_ALLROUTERS: (state, routers) => {
      state.allRoutes = routers;
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        // let accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        // let routeParse = deepClone(accessedRouters)
        // routeDispose(routeParse,0)
        // console.log(routeParse)
        // console.log(accessedRouters)
        // commit('SET_ROUTERS', accessedRouters)
        // resolve(routeParse)
        
        let routeParse = deepClone(asyncRouterMap)
        let routeParse1 = deepClone(asyncRouterMap)
        let accessedRouters = filterAsyncRouter(routeParse, roles)
        
        
        routeDispose(asyncRouterMap,0)
        commit('SET_ROUTERS', accessedRouters)
        commit('SET_ALLROUTERS',routeParse1)
        resolve(asyncRouterMap)

        // routeDispose(asyncRouterMap,0)
        // commit('SET_ROUTERS', accessedRouters)
 
        // resolve(asyncRouterMap) 
      })
    }
  }
};

export default permission;
