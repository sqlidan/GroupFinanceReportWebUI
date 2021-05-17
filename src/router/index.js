import Vue from 'vue';
import Router from 'vue-router';
import {
  orgPage,
  budimport,
  AccountBalanceImport,
  AnalysisReportImport,
  subaccount,
  busdata,
  specialfee,reportquery,
  countryPage
} from 'utils/btnRole'
Vue.use(Router);

/* layout */
import Layout from '../views/layout/Layout';

/**
 * icon : the icon show in the sidebar
 * hidden : if `hidden:true` will not show in the sidebar
 * redirect : if `redirect:noredirect` will no redirct in the levelbar
 * noDropdown : if `noDropdown:true` will has no submenu
 * meta : { role: ['admin'] }  will control the page role
 **/
export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/index').then(m => m.default),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register/index').then(m => m.default),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '用户首页',
    hidden: true,
    children: [
      {
      path: 'dashboard',
      component: () => import('@/views/dashboard/index').then(m => m.default),
      meta: {
        roles: ['Customs.BaseCustomInfo']
      },
    },
    {
      path: 'home',
      component: () => import('@/views/home/index').then(m => m.default),
      meta: {
        roles: ['Pages.Administration.Users']
      },
    },
  ]
  },
  {
    path: '/authredirect',
    component: () => import('@/views/login/authredirect').then(m => m.default),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error/404').then(m => m.default),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401').then(m => m.default),
    hidden: true
  },
  {
    path: '/codeCallback',
    component: () => import('@/views/modules/ssoclient/codeCallback').then(m => m.default),
    hidden: true
  },
  {
    path: '/choosedTenement',
    component: () => import('@/views/permission/choosedTenement/choosedTenementIndex').then(m => m.default),
    hidden: true
  }
]

export const asyncRouterMap = [
  {
    path: '/administration',
    component: Layout,
    redirect: '/administration/index',
    alwaysShow: true,
    meta: {
      title: '基础数据',
      icon: '个人中心',
    },
    children: [
      {
        path: 'organizationUnits',
        component: () => import('@/views/permission/organizationManage/organizationIndex').then(m => m.default),
        name: 'organizationIndex',
        meta: {
          title: '组织机构',
          icon: '个人中心',
          keepAlive: true,
          roles: ['Pages.Administration.OrganizationUnits']
        },
        btn: orgPage
      },
      {
        path: 'Users',
        component: () => import('@/views/permission/user/userManageIndex').then(m => m.default),
        name: 'userManageIndex',
        meta: {
          title: '用户',
          icon: '个人中心',
          keepAlive: true,
          roles: ['Pages.Administration.Users']

        }
      },
        {
        path: 'roles',
        component: () => import('@/views/permission/roles/roleManageIndex').then(m => m.default),
        name: 'roleManageIndex',
        meta: {
          title: '角色',
          icon: '个人中心',
          keepAlive: true,
          roles: ['Pages.Administration.Roles']

        },
       
      },
      {
        path: 'dictionaryManage',
        component: () => import('@/views/publicBase/dictionaryManage/dictionaryIndex').then(m => m.default),
        name: 'dictionaryIndex',
        meta: {
          title: '字典管理',
          icon: '个人中心',
          keepAlive: true,
          roles: ['Customs.Dictionary']
        },
      },
       {
        path: 'AccountsubjectIndex',
        component: () => import('@/views/publicBase/Accountingsubjects/AccountsubjectIndex').then(m => m.default),
        name: 'AccountsubjectIndex',
        meta: {
          title: '会计科目',
          icon: '个人中心',
          keepAlive: true,
          roles: ['Customs.AccountSubject']
          
        },
        btn: subaccount
      },
      // {
      //   path: 'customInfo',
      //   component: () => import('@/views/publicBase/custom/customInfo/customInfoIndex').then(m => m.default),
      //   name: 'customInfoIndex',
      //   keepAlive: true,
      //   meta: {
      //     title: '客户公司资料',
      //     icon: '个人客户',
      //     roles: ['Customs.CustomerInfo']
      //   },
      // },
     
    ]
  },

  
  //数据导入
  {
    path: '/dataimport',
    component: Layout,
    redirect: '/tools/index',
    alwaysShow: true,
    meta: {
      title: '数据导入',
      icon: '个人客户',
    },
    children: [
      {
        path: 'budgetImportIndex',
        component: () => import('@/views/DataImport/Budget/BudgetImportIndex').then(m => m.default),
        name: 'budgetImportIndex',
        meta: {
          title: '预算导入',
          icon: '个人客户',
          keepAlive: true,
          roles: ['Customs.BudgetImport']
        },
        btn: budimport
      },
       {
        path: 'SubjectAssistanceImportIndex',
        component: () => import('@/views/DataImport/SubjectAssistance/SubjectAssistanceImportIndex').then(m => m.default),
        name: 'SubjectAssistanceImportIndex',
        meta: {
          title: '科目辅助余额数据导入',
          icon: '个人客户',
          keepAlive: true,  
          roles: ['Customs.AccountBalanceImport']  
        },
        btn:AccountBalanceImport
      },
     
      {
        path: 'AnalysisReportImportIndex',
        component: () => import('@/views/DataImport/AnalysisReport/AnalysisReportImportIndex').then(m => m.default),
        name: 'AnalysisReportImportIndex',
        meta: {
          title: '合资公司经营分析报表导入',
          icon: '个人客户',
          keepAlive: true,
          roles: ['Customs.AnalysisReportImport']  
        },
        btn: AnalysisReportImport
      },
         
    ]
  },
  //数据维护
  {
    path: '/DataMaintenance',
    component: Layout,
    redirect: '/tools/index',
    alwaysShow: true,
    meta: {
      title: '数据维护',
      icon: '个人客户',
    },
    children: [
      {
        path: 'BusinessDataIndex',
        component: () => import('@/views/DataMaintenance/BusinessData/BusinessDataIndex').then(m => m.default),
        name: 'BusinessDataIndex',
        meta: {
          title: '业务数据维护',
          icon: '个人客户',
          keepAlive: true,
          roles: ['Customs.BusinessData']
        },
        btn: busdata
      },
       {
        path: 'SpecialFeeIndex',
        component: () => import('@/views/DataMaintenance/SpecialFee/SpecialFeeIndex').then(m => m.default),
        name: 'SpecialFeeIndex',
        meta: {
          title: '特殊费用单据维护',
          icon: '个人客户',
          keepAlive: true,  
          roles: ['Customs.SpecialFee']  
        },
        btn:specialfee
      },
     
         
    ]
  },

    //报表查询导出
    {
      path: '/ReportFunction',
      component: Layout,
      redirect: '/tools/index',
      alwaysShow: true,
      meta: {
        title: '报表查询导出',
        icon: '个人客户',
      },
      children: [
        {
          path: 'BudgetReportIndex',
          component: () => import('@/views/ReportFunction/BudgetReport/BudgetReportIndex').then(m => m.default),
          name: 'BudgetReportIndex',
          meta: {
            title: '报表查询',
            icon: '个人客户',
            keepAlive: true,
            roles: ['Customs.ReportExport']  
          },
          btn:reportquery      
        },
       
   
           
      ]
    },
   

]


export default new Router({
  // mode: 'history', //后端支持可开
  // scrollBehavior(to, from, savedPosition) {
  //   if (savedPosition) {
  //     return savedPosition
  //   } else {
  //     if (from.meta.keepAlive) {
  //       from.meta.savedPosition = document.body.scrollTop
  //     }
  //     return { x: 0, y: to.meta.savedPosition || 0 }
  //   }
  // },
  routes: constantRouterMap
});




