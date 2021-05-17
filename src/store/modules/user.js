import {Decrypt,Encrypt} from '@/utils/crypto'
import {loginByEmail,logout,getInfo} from 'api/login';
import {setCookie,getCookie,delCookie,clearAllCookie} from 'utils/cookie';
const user = {
  state: {
    user: '',
    status: '',
    id: getCookie('Abp.UserId'),
    code: '',
    gsWorkNo: '',      //公司工号
    jtWorkNo: '',      //集团工号
    token: getCookie('Abp.AuthToken'), 
    tenantId:getCookie('Abp.TenantId'),     //租户
    permission:JSON.parse(localStorage.getItem('permission')),  //权限码
    name: '',
    deptId: '',
    deptName: '',
    avatar: '',
    introduction: '',
    roles: [],
    menus: undefined,
    eleemnts: undefined,
    permissionMenus: undefined,
    setting: {
      articlePlatform: []
    },
    systemUser: getCookie('Abp.SystemUser')
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code;
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_ID: (state, id) => {
      state.id = id;
    },
    SET_GSWORKNO: (state, gsWorkNo) => {
      state.gsWorkNo = gsWorkNo;
    },
    SET_JTWORKNO: (state, jtWorkNo) => {
      state.jtWorkNo = jtWorkNo;
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction;
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting;
    },
    SET_STATUS: (state, status) => {
      state.status = status;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_DEPTID: (state, deptId) => {
      state.deptId = deptId;
    },
    SET_DEPTNANE: (state, deptName) => {
      state.deptName = deptName;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus;
    },
    SET_ELEMENTS: (state, elements) => {
      state.elements = elements;
    },
    LOGIN_SUCCESS: () => {
      console.log('login success')
    },
    LOGOUT_USER: state => {
      state.user = '';
    },
    SET_PERMISSION_MENUS: (state, permissionMenus) => {
      state.permissionMenus = permissionMenus;
    },
    SET_PERMISSION: (state, permission) => {
      state.permission = permission;
    },
    SET_TENANTID: (state, tenantId) => {
      state.tenantId = tenantId
    },
  },

  actions: {
    // 邮箱登录
    LoginByEmail({
      commit
    }, userInfo) {
      userInfo.userName = userInfo.userNameOrEmailAddress.trim();
      userInfo.password = userInfo.password.trim();
      
      return new Promise((resolve, reject) => {
        loginByEmail(userInfo).then(res => {
          
          if(res.success) {
            commit('SET_TOKEN', '');
            commit('SET_ROLES', []);
            commit('SET_MENUS', undefined);
            commit('SET_ELEMENTS', undefined);
            //removeToken();
            
            setCookie('Abp.AuthToken',res.result.accessToken)
            //setToken(res.result.accessToken);

            commit('SET_TOKEN', res.result.accessToken);
          }
          resolve(res);
        }).catch(error => {
          reject(error);
        });
      });
    },

    //登陆(单点)
    setUser({commit}, userInfo) {
      commit('SET_GSWORKNO',userInfo.gsWorkNo)
      commit('SET_JTWORKNO',userInfo.jtWorkNo)
      commit('SET_ID',userInfo.userId)
      commit('SET_NAME',userInfo.name)

    },

    // 获取用户信息
    GetInfo({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response;
          localStorage.setItem("permission",JSON.stringify(Object.keys(data.result.auth.grantedPermissions)));
          commit('SET_PERMISSION',Object.keys(data.result.auth.grantedPermissions))
          commit('SET_ID', data.id);
          commit('SET_ROLES', 'admin');
          commit('SET_NAME', data.name);
          commit('SET_DEPTID', data.deptId);
          commit('SET_DEPTNANE', data.deptName);
          commit('SET_TENANTID',data.result.session.tenantId)
          commit('SET_AVATAR', 'https://www.gravatar.com/avatar/2714bbb24bb92e796927dd705d769fdb?s=180&d=identicon');
          commit('SET_INTRODUCTION', data.description);
          //commit('SET_MENUS', data.menus);
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 第三方验证登录
    LoginByThirdparty({
      commit,
      state
    }, code) {
      return new Promise((resolve, reject) => {
        commit('SET_CODE', code);
        loginByThirdparty(state.status, state.email, state.code).then(response => {
          //commit('SET_TOKEN', response.data.token);
          //setToken(response.data.token);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // // 登出
    // LogOut({
    //   commit,
    //   state
    // }) {
    //   return new Promise((resolve, reject) => {
    //     logout(state.token).then(() => {
    //       commit('SET_TOKEN', '');
    //       commit('SET_ROLES', []);
    //       commit('SET_MENUS', undefined);
    //       commit('SET_ELEMENTS', undefined);
    //       commit('SET_PERMISSION_MENUS', undefined);
    //       removeToken();
    //       //删除租户cookie
    //       delCookie('tenantId')
    //       resolve();
    //     }).catch(error => {
    //       reject(error);
    //     });
    //   });
    // },

    // 前端 登出
    FedLogOut({
      commit
    }) {
      return new Promise(resolve => {
        
        //删除租户cookie
        //delCookie('tenantId')
        //清除localStorage
        localStorage.clear();
        //清除用户cookie
        //removeToken();
        
        delCookie('Abp.AuthToken')
        delCookie('Abp.TenantId')
        //console.log('bbb',getCookie('Abp.AuthToken'))
        //clearAllCookie()


        commit('SET_TOKEN', '');
        commit('SET_MENUS', undefined);
        commit('SET_ELEMENTS', undefined);
        commit('SET_PERMISSION_MENUS', undefined);
        
        resolve();
      });
    },

    // 动态修改权限
    ChangeRole({
      commit
    }, role) {
      return new Promise(resolve => {
        commit('SET_ROLES', [role]);
        commit('SET_TOKEN', role);
        //setToken(role);
        resolve();
      })
    }
  }
};

export default user;
