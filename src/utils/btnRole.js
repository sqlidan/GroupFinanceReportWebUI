import store from 'store/index'

//按钮验证
export function checkBtnPeimission(peimission) {
    return store.getters.permission.some(item => item === peimission)
}


export class Permission {
    //组织机构页面
    static orgPage = {
        addOrg: { name: '新增公司', permission: 'Pages.Administration.OrganizationUnits.Create' },
        updateOrg: { name: '编辑公司', permission: 'Pages.Administration.OrganizationUnits.Create' },
        deleteOrg: { name: '删除公司', permission: 'Pages.Administration.OrganizationUnits.Delete' },
        addUser: { name: '新增用户', permission: 'Pages.Administration.OrganizationUnits.AddUsers' }
    }
    //关区页面
    static DistrictPage = {
        addDistrict: { name: '添加', permission: 'Pages.Administration.BaseCustomDistrict.Create' },
        deleteDistrict: { name: '删除', permission: 'Pages.Administration.BaseCustomDistrict.Delete' },
        batchDeleteDistrict: { name: '批量删除', permission: 'Pages.Administration.BaseCustomDistrict.BatchDelete' },
        updateDistrict: { name: '修改', permission: 'Pages.Administration.BaseCustomDistrict.Update' }
    }

}

//组织机构页面
export const orgPage = {
    addOrg: { name: '新增公司', permission: 'Pages.Administration.OrganizationUnits.Create' },
    updateOrg: { name: '编辑公司', permission: 'Pages.Administration.OrganizationUnits.Create' },
    deleteOrg: { name: '删除公司', permission: 'Pages.Administration.OrganizationUnits.Delete' },
    addUser: { name: '新增用户', permission: 'Pages.Administration.OrganizationUnits.AddUsers' }
   
}
//会计科目
export const subaccount = {
    add: { name: '新增', permission: 'Customs.AccountSubject.Create' },
    update: { name: '编辑', permission: 'Customs.AccountSubject.Edit' },
    delete: { name: '删除', permission: 'Customs.AccountSubject.Delete' },
   
}

//预算导入
export const budimport = {
    Createbud: { name: '导入', permission: 'Customs.BudgetImport.Create' },
    Editbud: { name: '编辑', permission: 'Customs.BudgetImport.Edit' },
    Deletebud: { name: '删除', permission: 'Customs.BudgetImport.Delete' },
    Submitbud: { name: '提交', permission: 'Customs.BudgetImport.Submit' },
    CancelSubmitbud: { name: '取消提交', permission: 'Customs.BudgetImport.CancelSubmit' },
    AgreeCancelSubmitbud: { name: '同意取消提交', permission: 'Customs.BudgetImport.AgreeCancelSubmit' },
}

//科目辅助约数数据导入
export const AccountBalanceImport = {
    import: { name: '导入', permission: 'Customs.AccountBalanceImport.import' },
    Createbud: { name: '新增', permission: 'Customs.AccountBalanceImport.Create' },
    Editbud: { name: '编辑', permission: 'Customs.AccountBalanceImport.Edit' },
    Deletebud: { name: '删除', permission: 'Customs.AccountBalanceImport.Delete' },
    Submitbud: { name: '提交', permission: 'Customs.AccountBalanceImport.Submit' },
    CancelSubmitbud: { name: '取消提交', permission: 'Customs.AccountBalanceImport.CancelSubmit' },
    AgreeCancelSubmitbud: { name: '同意取消提交', permission: 'Customs.AccountBalanceImport.AgreeCancelSubmit' },
}

//合资公司经营报表导入
export const AnalysisReportImport = {
    Createbud: { name: '导入', permission: 'Customs.AnalysisReportImport.Create' },
    Editbud: { name: '编辑', permission: 'Customs.AnalysisReportImport.Edit' },
    Deletebud: { name: '删除', permission: 'Customs.AnalysisReportImport.Delete' },
   
}

//业务数据维护
export const busdata = {
    add: { name: '新增', permission: 'Customs.BusinessData.Create' },
    update: { name: '编辑', permission: 'Customs.BusinessData.Edit' },
    delete: { name: '删除', permission: 'Customs.BusinessData.Delete' },
}

//特殊费用维护
export const specialfee = {
    add: { name: '新增', permission: 'Customs.SpecialFee.Create' },
    update: { name: '编辑', permission: 'Customs.SpecialFee.Edit' },
    delete: { name: '删除', permission: 'Customs.SpecialFee.Delete' },
}

//报表查询
export const reportquery = {
    export: { name: '导出', permission: 'Customs.ReportExport.Export' },
   
}