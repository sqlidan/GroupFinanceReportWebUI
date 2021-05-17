<template>
  <div class="app-container budgetreport" >
    <el-form size="mini" @submit.native.prevent label-width="70px">
      <el-row>
        <el-col :span="5">
          <el-form-item label="公司：" prop="" style="position: relative">
            <tree-select
              ref="chooseEquNode"
              @on-treeShow-change="ontreeShowChange"
              :choosedEquipmentNode="choosedTreeNode"
              style="width: 100%"
            ></tree-select>
            <div class="editOrgComp-row-tree" v-show="treeComp.show">
              <tree
                ref="treeComp"
                :pCheckStrictly="true"
                :radio="true"
                :pTreeDefaultProps="treeComp.treeConfig"
                :pTreeData="treeComp.data"
                :pChoosedNode="treeComp.choosedTreeNodeId"
                @on-nodeChange="onNodeClick"
                @on-outside-click="onClickOutSide"
              ></tree>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="部门归属：" prop="" label-width="90px">
            <el-select
              v-model="selectdep"
              placeholder="请选择部门"
              style="width: 100%"
              multiple
              collapse-tags
              clearable
              filterable
            >
              <el-option
                v-for="item in deptreeComp.data"
                :key="item.nodeId"
                :label="item.nodeName"
                :value="item.nodeName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item
            label="所属时间："
            prop="budyear"
            style="position: relative"
            label-width="90px"
          >
            <el-date-picker
              v-model="budyear"
              type="month"
              placeholder="所属时间"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="预算类别：" prop="BudgetType" label-width="90px">
            <el-select
              v-model="selectbud"
              placeholder="预算类别"
              clearable
              filterable
              multiple
              collapse-tags
            >
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.displayText"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item label="是否查询特殊费用：" label-width="150px">
            <el-select
              v-model="search.Special"
              placeholder="是否查询特殊费用"
              clearable
              filterable
            >
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <el-form-item label="是否查询所有部门：" label-width="150px">
            <el-select
              v-model="search.AllDep"
              placeholder="是否查询所有部门"
              clearable
              filterable
            >
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="是否查询所有报表：" label-width="150px">
            <el-select
              v-model="search.AllReport"
              placeholder="是否查询所有报表"
              clearable
              filterable
            >
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item label prop label-width="10px">
            <el-button type="primary" size="mini" @click="getTableList()"
              >搜索</el-button
            >
          
            <el-button type="primary" size="mini" @click="Importdata()" :loading="bthloading" v-if="checkBtnPeimission(reportquery.export.permission)">导出</el-button> 
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-tabs v-model="tabActiveName" type="card">
      <el-tab-pane
        v-for="(item, index) in TableDataList"
        :key="index"
        :label="item.sheetName"
        :name="'budget' + index"
      >
      <div style="overflow:scroll;width:100%;height:680px" :id="'out-table-'+index">
        <table border="1" cellspacing="0" style="table-layout: fixed;" class="tableset">
        <tbody>
          <tr class="title" >
            <td :colspan="item.isjust ===true?'42':'44'" :style="'width:'+(600*12+1300)+'px;padding-left:20px'" >
              {{ item.titlename +item.Year+ "年度经营情况表" }}
            </td>
          </tr>
          <tr class="title">
            <td  style="width:100%;padding-left:20px" :colspan="item.isjust ===true?'42':'44'">{{ "编制单位：" + item.titlename }}</td>
          </tr>
          <tr class="title">
            <td rowspan="2" align='center' style="width:100px"><span>行号</span></td>
            <td colspan="2" rowspan="2" style="width:400px" align='center'><span>项目</span></td>
            <td :colspan="item.isjust === true ? '3' : '5'" align='center' style="width:800px">
              <span>{{item.isjust ===true?'本年累计数':' 全年情况'}}</span>
              </td>
            <td colspan="3" align='center' ><span>1月</span></td>
            <td colspan="3" align='center' ><span>2月</span></td>
            <td colspan="3" align='center'><span>3月</span></td>
            <td colspan="3" align='center' ><span>4月</span></td>
            <td colspan="3" align='center' ><span>5月</span></td>
            <td colspan="3" align='center'><span>6月</span></td>
            <td colspan="3" align='center' ><span>7月</span></td>
            <td colspan="3" align='center' ><span>8月</span></td>
            <td colspan="3" align='center' ><span>9月</span></td>
            <td colspan="3" align='center' ><span>10月</span></td>
            <td colspan="3" align='center' ><span>11月</span></td>
            <td colspan="3" align='center' ><span>12月</span></td>
          </tr>
          <tr  class="title">
            <td     align='center'><span>{{item.isjust ===true?'全年实际数':' 全年预算合计'}}</span></td>
            <td     align='center'><span>{{item.isjust ===true?'调整项':' 实际完成合计'}}</span></td>
            <td     align='center'><span>{{item.isjust ===true?'调整后实际数':' 完成预算进度%'}}</span></td>
            <td     align='center' v-if="item.isjust !==true"><span>累计预算数</span></td>
            <td     align='center' v-if="item.isjust !==true"><span>累计预算完成%</span></td>		

            <td     align='center'><span>{{item.isjust ===true?'当月实际数':' 当月预算数'}}</span></td>
            <td     align='center'><span>{{item.isjust ===true?'调整项':' 当月实际数'}}</span></td>
            <td     align='center'><span>{{item.isjust ===true?'调整后实际数':' 预算完成%'}}</span></td>

            <td     align='center'><span>{{item.isjust ===true?'当月实际数':' 当月预算数'}}</span></td>
            <td     align='center'><span>{{item.isjust ===true?'调整项':' 当月实际数'}}</span></td>
            <td     align='center'><span>{{item.isjust ===true?'调整后实际数':' 预算完成%'}}</span></td>

            <td     align='center'><span>{{item.isjust ===true?'当月实际数':' 当月预算数'}}</span></td>
            <td     align='center'><span>{{item.isjust ===true?'调整项':' 当月实际数'}}</span></td>
             <td     align='center'><span>{{item.isjust ===true?'调整后实际数':' 预算完成%'}}</span></td>

            <td     align='center'><span>{{item.isjust ===true?'当月实际数':' 当月预算数'}}</span></td>
            <td     align='center'><span>{{item.isjust ===true?'调整项':' 当月实际数'}}</span></td>
            <td     align='center'><span>{{item.isjust ===true?'调整后实际数':' 预算完成%'}}</span></td>

            <td     align='center'><span>{{item.isjust ===true?'当月实际数':' 当月预算数'}}</span></td>
            <td     align='center'><span>{{item.isjust ===true?'调整项':' 当月实际数'}}</span></td>
            <td     align='center'><span>{{item.isjust ===true?'调整后实际数':' 预算完成%'}}</span></td>

            <td     align='center'><span>{{item.isjust ===true?'当月实际数':' 当月预算数'}}</span></td>
            <td     align='center'><span>{{item.isjust ===true?'调整项':' 当月实际数'}}</span></td>
             <td     align='center'><span>{{item.isjust ===true?'调整后实际数':' 预算完成%'}}</span></td>

            <td     align='center'><span>{{item.isjust ===true?'当月实际数':' 当月预算数'}}</span></td>
            <td     align='center'><span>{{item.isjust ===true?'调整项':' 当月实际数'}}</span></td>
             <td     align='center'><span>{{item.isjust ===true?'调整后实际数':' 预算完成%'}}</span></td>

            <td     align='center'><span>{{item.isjust ===true?'当月实际数':' 当月预算数'}}</span></td>
            <td     align='center'><span>{{item.isjust ===true?'调整项':' 当月实际数'}}</span></td>
            <td     align='center'><span>{{item.isjust ===true?'调整后实际数':' 预算完成%'}}</span></td>

            <td     align='center'><span>{{item.isjust ===true?'当月实际数':' 当月预算数'}}</span></td>
            <td     align='center'><span>{{item.isjust ===true?'调整项':' 当月实际数'}}</span></td>
            <td     align='center'><span>{{item.isjust ===true?'调整后实际数':' 预算完成%'}}</span></td>

            <td     align='center'><span>{{item.isjust ===true?'当月实际数':' 当月预算数'}}</span></td>
            <td     align='center'><span>{{item.isjust ===true?'调整项':' 当月实际数'}}</span></td>
            <td     align='center'><span>{{item.isjust ===true?'调整后实际数':' 预算完成%'}}</span></td>

            <td     align='center'><span>{{item.isjust ===true?'当月实际数':' 当月预算数'}}</span></td>
            <td     align='center'><span>{{item.isjust ===true?'调整项':' 当月实际数'}}</span></td>
            <td     align='center'><span>{{item.isjust ===true?'调整后实际数':' 预算完成%'}}</span></td>

            <td     align='center'><span>{{item.isjust ===true?'当月实际数':' 当月预算数'}}</span></td>
            <td     align='center'><span>{{item.isjust ===true?'调整项':' 当月实际数'}}</span></td>
             <td     align='center'><span>{{item.isjust ===true?'调整后实际数':' 预算完成%'}}</span></td>
          </tr>
          <tr v-for="(ele, inx) in item.data" :key="index + '-' + inx" :style="(inx%2)===0?'background: rgb(241, 246, 253);':''">
            <td  align='center' class="dataclass"  >{{ ele.linNO }}</td>
            <td  align='center' :rowspan="ele.rowspaln" v-if="ele.parentprojectName !== ''"  class="dataclass">
              {{ ele.parentprojectName }}
            </td>
            <td class="dataclass"   align='center' :colspan="(ele.parentprojectName === '' && ele.rowspaln===0) ? '2' : '1'" style="width: 120px">
              {{ ele.projectName }}
            </td>
            <td align='center' class="dataclass" >{{ ele.fullYearBudget }}</td>
            <td align='center' class="dataclass" >{{ ele.fullYearActual }}</td>
            <td align='center' class="dataclass" >{{ ele.fullYearBudgetSchedule }}</td>
            <td align='center' class="dataclass" v-if="item.isjust !==true">{{ ele.fullYearCumulativeBudget }}</td>
            <td align='center' class="dataclass"  v-if="item.isjust !==true">{{ ele.fullYearCumulativeBC }}</td>

            <td align='center' class="dataclass" >{{ ele.januaryBudget }}</td>
            <td align='center' class="dataclass" >{{ ele.januaryAcctual }}</td>
            <td align='center' class="dataclass" >{{ ele.januaryBudgetCompletedl }}</td>

            <td align='center' class="dataclass" >{{ ele.februaryBudget }}</td>
            <td align='center' class="dataclass" >{{ ele.februaryAcctual }}</td>
            <td align='center' class="dataclass" >{{ ele.februaryBudgetCompletedl }}</td>

            <td align='center' class="dataclass" >{{ ele.marchBudget }}</td>
            <td align='center' class="dataclass" >{{ ele.marchAcctual }}</td>
            <td align='center' class="dataclass" >{{ ele.marchBudgetCompletedl }}</td>

            <td align='center' class="dataclass" >{{ ele.aprilBudget }}</td>
            <td align='center' class="dataclass" >{{ ele.aprilAcctual }}</td>
            <td align='center' class="dataclass" >{{ ele.aprilBudgetCompletedl }}</td>

            <td align='center' class="dataclass" >{{ ele.mayBudget }}</td>
            <td align='center' class="dataclass" >{{ ele.mayAcctual }}</td>
            <td align='center' class="dataclass" >{{ ele.mayBudgetCompletedl }}</td>

            <td align='center' class="dataclass" >{{ ele.juneBudget }}</td>
            <td align='center' class="dataclass" >{{ ele.juneAcctual }}</td>
            <td align='center' class="dataclass" >{{ ele.juneBudgetCompletedl }}</td>

            <td align='center' class="dataclass" >{{ ele.julyBudget }}</td>
            <td align='center' class="dataclass" >{{ ele.JulyAcctual }}</td>
            <td align='center' class="dataclass" >{{ ele.julyBudgetCompletedl }}</td>

            <td align='center' class="dataclass" >{{ ele.augustBudget }}</td>
            <td align='center' class="dataclass" >{{ ele.augustAcctual }}</td>
            <td align='center' class="dataclass" >{{ ele.augustBudgetCompletedl }}</td>

            <td align='center' class="dataclass" >{{ ele.septemberBudget }}</td>
            <td align='center' class="dataclass" >{{ ele.septemberAcctual }}</td>
            <td align='center' class="dataclass" >{{ ele.septemberBudgetCompletedl }}</td>

            <td align='center' class="dataclass" >{{ ele.octoberBudget }}</td>
            <td align='center'  class="dataclass" >{{ ele.octoberAcctual }}</td>
            <td align='center'  class="dataclass" >{{ ele.octoberBudgetCompletedl }}</td>

            <td align='center' class="dataclass" >{{ ele.novemberBudget }}</td>
            <td align='center' class="dataclass" >{{ ele.novemberAcctual }}</td>
            <td align='center' class="dataclass" >{{ ele.novemberBudgetCompletedl }}</td>

            <td align='center' class="dataclass" >{{ ele.decemberBudget }}</td>
            <td align='center' class="dataclass" >{{ ele.decemberAcctual }}</td>
            <td align='center' class="dataclass" >{{ ele.decemberBudgetCompletedl }}</td>
          </tr>
        </tbody>
        </table>
      <!-- </div>
       <div style="overflow:scroll;width:100%;height:680px" :id="'out-table-'+index"> -->
        <table border="1" cellspacing="0" style="table-layout: fixed;" class="tableset" v-if="item.juststData.length>0">
        <tbody>       
          <tr class="title">
            <td align='center' style="width:100px"></td>
            <td colspan="2" style="width:400px" align='center'><span>一、特殊事项</span></td>
            <td  align='center' style="width:300px"><span>对应科目</span></td>
             <td  align='center' style="width:300px"><span>累计</span></td>
            <td colspan="3" align='center' ><span>1月</span></td>
            <td colspan="3" align='center' ><span>2月</span></td>
            <td colspan="3" align='center'><span>3月</span></td>
            <td colspan="3" align='center' ><span>4月</span></td>
            <td colspan="3" align='center' ><span>5月</span></td>
            <td colspan="3" align='center'><span>6月</span></td>
            <td colspan="3" align='center' ><span>7月</span></td>
            <td colspan="3" align='center' ><span>8月</span></td>
            <td colspan="3" align='center' ><span>9月</span></td>
            <td colspan="3" align='center' ><span>10月</span></td>
            <td colspan="3" align='center' ><span>11月</span></td>
            <td colspan="3" align='center' ><span>12月</span></td>
          </tr>
         
          <tr v-for="(ele, inx) in item.juststData" :key="index + '-' + inx" :style="(inx%2)===0?'background: rgb(241, 246, 253);':''">
            <td  align='center' class="dataclass"  ></td>
            <td  align='center'   class="dataclass">
              {{ ele.parentprojectName }}
            </td>
            <td class="dataclass"   align='center' >
              {{ ele.projectName }}
            </td>
            <td align='center' class="dataclass" >{{ ele.fullYearBudget }}</td>
            
            <td align='center' class="dataclass" >{{ ele.januaryBudget }}</td>
        
            <td align='center' class="dataclass" >{{ ele.februaryBudget }}</td>           

            <td align='center' class="dataclass" >{{ ele.marchBudget }}</td>
            
            <td align='center' class="dataclass" >{{ ele.aprilBudget }}</td>           

            <td align='center' class="dataclass" >{{ ele.mayBudget }}</td>
        
            <td align='center' class="dataclass" >{{ ele.juneBudget }}</td>           

            <td align='center' class="dataclass" >{{ ele.julyBudget }}</td>
           
            <td align='center' class="dataclass" >{{ ele.augustBudget }}</td>
       
            <td align='center' class="dataclass" >{{ ele.septemberBudget }}</td>
          
            <td align='center' class="dataclass" >{{ ele.octoberBudget }}</td>
      
            <td align='center' class="dataclass" >{{ ele.novemberBudget }}</td>
        
            <td align='center' class="dataclass" >{{ ele.decemberBudget }}</td>
            
          </tr>
        </tbody>
        </table>
      </div>
        <!-- <el-table
            :cell-class-name="tableRowClassName"
                v-loading="table.loading"
                :data="TableDataList[index].data"
                :row-key = "getRowKeys"
                border
                stripe
                highlight-current-row
                fit
                height="calc(100% - 130px)"
                style="width: 100%"
                ref="table"
                @sort-change="sortChange"
                @selection-change="onSelectChange"
            >
            
               <el-table-column
                align="center"
                prop="company"
                label="行号"
                show-overflow-tooltip
                sortable="custom"
                 width="200"
                >        
                </el-table-column>
                  <el-table-column
                align="center"
                prop="dept"
                label="部门归属"
                show-overflow-tooltip
                 sortable="custom"
                  width="150"
                >        
                </el-table-column>
                <el-table-column
                align="center"
                prop="nccdept"
                label="部门"
                show-overflow-tooltip
                 sortable="custom"
                  width="150"
                >        
                </el-table-column>
                <el-table-column
                align="center"
                prop="budgettypename"
                label="预算类别"
                show-overflow-tooltip
                 sortable="custom"
                  width="120"
                >        
                </el-table-column>
                <el-table-column
                align="center"
                prop="year"
                label="年份"
                show-overflow-tooltip
                 sortable="custom"
                  width="100"
                >        
                </el-table-column>
                <el-table-column
                align="center"
                prop="linNO"
                label="行号"
                show-overflow-tooltip
                 sortable="custom"
                  width="100"
                >        
                </el-table-column>
            
                <el-table-column
                align="center"
                prop="parentProjectName"
                label="父级项目"
                show-overflow-tooltip
                sortable="custom"
                width="150"
                >        
                </el-table-column>
                <el-table-column
                align="center"
                prop="projectName"
                label="项目"
                show-overflow-tooltip
                sortable="custom"
                width="150"
                >              
                </el-table-column>
               
                <el-table-column
                align="center"
                prop="annualTotal"              
                show-overflow-tooltip
                label="全年预算"
                width="110"
                sortable="custom"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="january"    
                show-overflow-tooltip
                label="1月预算"
                 width="100"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="february"    
                show-overflow-tooltip
                label="2月预算"
                 width="100"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="march"
                sortable="3月预算"
                show-overflow-tooltip
                label="3月预算"
                 width="100"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="april"          
                show-overflow-tooltip
                label="4月预算"
                 width="100"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="may"     
                show-overflow-tooltip
                label="5月预算"
                 width="100"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="june"         
                show-overflow-tooltip
                label="6月预算"
                 width="100"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="july"         
                show-overflow-tooltip
                label="7月预算"
                 width="100"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="august"         
                show-overflow-tooltip
                label="8月预算"
                 width="100"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="september"         
                show-overflow-tooltip
                label="9月预算"
                 width="100"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="october"        
                show-overflow-tooltip
                label="10月预算"
                 width="100"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="november"        
                show-overflow-tooltip
                label="11月预算"
                 width="100"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="december"        
                show-overflow-tooltip
                label="12月预算"
                 width="100"
                ></el-table-column>    
           
     
            </el-table> -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style lang="scss">
.budgetreport {
  height: 100%;
  .chsEqp {
    width: 100%;
    .textPromt {
      float: left;
    }
    .chsEqp-select {
      height: 26px;
      line-height: 24px;
    }
    i {
      float: right;
      margin-top: 6px;
    }
  }
  .editOrgComp-row-tree {
    position: absolute;
    top: 40px;
    left: 70px;
    background-color: #fff;
    z-index: 10;
    padding: 0;
    margin: 0;
    width: 300px;
    height: 450px;
    clear: both;
  }
  .tableset{
    width:100%; 
    height:100%;
    padding: 5,5; 
    
      
    .title {
       background: rgb(225, 228, 235);
       font-weight: bold;
      } 
      line-height: 40px;
      font-size: 16px;
     
     
  }
}
</style>
<script>
import { tableMixin } from "mixin/commTable";
import treeSelect from "components/treeSelect/treeSelect";
import tree from "components/tree/tree";
import { getOrganizatonTreeNoUsers, GetDepList } from "api/user/organization";
import { getDicListByDitType } from "api/publicBase/dictionaryMng";
import { InquireProfitStatement,ExportFile } from "api/ReportFunction/BudgetReport";
import { warnMsg, htmlMsg } from "utils/messageBox";
import { checkBtnPeimission, reportquery } from "utils/btnRole";
import xlsx from 'xlsx'
import XLSX2 from 'xlsx'
 
 import XLSX from "xlsx-style"
import xlsxStyle from 'xlsxStyle'


export default {
  name: "BudgetReportIndex",
  components: { treeSelect, tree },
  mixins: [tableMixin],
  data() {
    return {
      reportquery,
      titlename:"",
      tabActiveName:"budget0",
      TableDataList: [], //表格数据,显示导入数据
      budyear: new Date(),
      bthloading: false,
      selectdep: [], //选择部门所属
      selectbud: [], //选择预算类别
      search: {
        Code: "",
        DepName: "",
        BudgetType: "",
        Special: false,
        AllDep: false,
        AllReport: false,
      },
      typeList: [], //预算类别
      ImportComp: {
        show: false,
      },
      EditBudgetComp: {
        show: false,
      },
      treeComp: {
        show: false,
        data: [],
        choosedTreeNodeId: [], //回显树节点ID
      },
      deptreeComp: {
        data: [],
      },
      choosedTreeNode: [],
    };
  },
  methods: {
    checkBtnPeimission,
    getRowKeys(row) {
      return row.id;
    },
    //添加查询combox
    setComBox() {
      getDicListByDitType({
        BaseKeyValueTypeCode: "BUDGETTYPE",
        Code: "",
        Name: "",
      }).then((res) => {
        this.typeList = res.result.comboxs;
      });
    },
    //获取组织树
    getOrganizationTree() {
      //{IsShowdep:true}
      getOrganizatonTreeNoUsers().then((res) => {
        if (res.success) this.treeComp.data = res.result;
        if (res.result.length > 0) {
          this.onNodeClick([res.result[0]]);
          this.treeComp.choosedTreeNodeId = [res.result[0].nodeId];
        }
      });
    },
    //根据公司获取部门
    getdeplist() {
      this.selectdep = [];
      this.deptreeComp.data = [];
      GetDepList({ code: this.search.Code }).then((res) => {
        if (res.success) this.deptreeComp.data = res.result;
      });
    },
    //树数据回调事件
    onNodeClick(clickNode //choosedNodeID
    ) {
      this.search.Code = clickNode.length > 0 ? clickNode[0].nodeUUid : "";
      this.choosedTreeNode = clickNode;
      this.titlename=clickNode.length > 0 ? clickNode[0].nodeName : "";
      this.getdeplist();
    },
    //
    onClickOutSide() {
      if (this.treeComp.show == true) {
        this.treeComp.show = false;
        this.$refs.chooseEquNode.iconChange();
      }
    },
    //单击树选择框控件
    ontreeShowChange(val) {
      this.treeComp.show = val;
    },
    //获取列表
    getTableList() {
      if (
        this.search.Code === "" ||
        this.search.Code === null ||
        this.search.Code === undefined
      ) {
        warnMsg("请选择公司");
        return;
      }
      let data = this.search;
      if (
        this.budyear !== "" &&
        this.budyear !== null &&
        this.budyear !== undefined
      ) {
        data.Year = this.budyear.getFullYear();
        data.Month = this.budyear.getMonth() + 1;
      } else {
        warnMsg("请选择所属时间");
        return;
      }
      if (this.selectdep.length > 0) {
        var dep = this.selectdep.toString();
        data.DepName =";"+ dep.replace(/,/g, ";")+";";
      } else {
        data.DepName = "";
      }
      if (this.selectbud.length > 0) {
        var bud = this.selectbud.toString();
        data.BudgetType = bud.replace(/,/g, ";");
      } else {
        data.BudgetType = "";
      }
      //  var showmsg=JSON.stringify(data);
      //  htmlMsg(showmsg.toString(),{type: "warning", duration: 0, showClose: true});
       this.TableDataList=[];
      this.table.loading = true;
      InquireProfitStatement(data)
        .then((res) => {
          if (res.success) {
            this.table.loading = false;
            
            var arr=[];
            
             res.result.forEach(item => {
                 let sheetdata=item;
                 sheetdata.titlename=this.titlename;
                 sheetdata.Year= this.budyear.getFullYear();
                 if(item.sheetName.includes("调整"))
                 {
                     sheetdata.isjust=true;
                 }
                 else
                 {
                     sheetdata.isjust=false;
                 }
                 var rows=0;
                 var parentname="";
                 var ishb=false;
                 //记录
                 var startindex=-1;
                 sheetdata.data.forEach((ele,index)=>{
                     
                     if(ele.projectName.includes('/'))
                     {
                         var namelist=ele.projectName.split('/');
                         
                        //    ele.projectName=namelist[1];
                        //    ele.parentprojectName=namelist[0];

                            if(parentname===namelist[0])
                            {
                               rows++;
                               ele.parentprojectName="";
                               ele.rowspaln=1;
                               ele.projectName=namelist[1];
                        
                            }
                            else{
                                if(startindex>-1 &&  ishb===true)
                                {
                                     sheetdata.data[startindex].rowspaln=rows;

                                }
                                ishb=true;
                                rows=1;
                                startindex=index;
                                ele.projectName=namelist[1];
                                ele.parentprojectName=namelist[0];
                                parentname=namelist[0];
                            }
                     }
                     else{
                          if(ishb===true)
                            {
                                sheetdata.data[startindex].rowspaln=rows;
                            }
                          ishb=false;
                          rows=0;
                          parentname="";
                          ele.parentprojectName="";
                          ele.rowspaln=0;
                          startindex=-1;
                     }
                   

                   

                 })
                if(ishb===true)
                    {
                        sheetdata.data[startindex].rowspaln=rows;
                    }
                 arr.push(sheetdata);
             });;
             this.TableDataList=arr;
          
          }
        })
        .catch((err) => {
          this.table.loading = false;
        });
    },
    Importdata()
    {
      if(this.TableDataList.length<1){
        warnMsg("当前无导出数据");
        return;
      }
      this.bthloading=true;
      let data={
        data:this.TableDataList
      };
      ExportFile(data).then(res=>{
        if(res.success){
           this.bthloading=false;
            //window.open(res.result);
             if (res.result.indexOf("http") > -1) {
              window.location.href = res.result;
              this.excelLoading = false;
            } else {
              warnMsg(res.result);
            }
        }

      }).catch(err=>{
         this.bthloading=false;
      })

      //  const wb = {
      //    SheetNames:[],
      //    Sheets:[],

      //  };
     


      //   //   this.TableDataList.forEach((item,index)=>{
      //   //      wb.SheetNames.push(item.sheetName);
      //   //     //let lnws= XLSX.sh
           
      //   //     // var html = "<html><head><meta charset='utf-8' /></head><body>"
      //   //     //           + document.getElementById('out-table-'+index).outerHTML + "</body></html>";
      //   //       var html =  document.getElementById('out-table-'+index).outerHTML;

      //   //  //   let lnws=XLSX2.utils.table_to_sheet(html);
      //   //      let lnws=XLSX2.utils.table_to_sheet(document.getElementById('out-table-'+index));
      //   //       //列宽
      //   //     // lnws['!cols'] = siteColWidth(item.data)

      //   //     // var column=item.isjust===true?39:40;
      //   //     // var closlist=[
      //   //     //   {wch: 100}, // A列
      //   //     //   {wch: 200}, 
      //   //     //   {wch: 200}
      //   //     //   ];
      //   //     //  for (var i=0;i<column;i++)
      //   //     //  {
      //   //     //    var setcloum={
      //   //     //      wch: 200
      //   //     //    }
      //   //     //    closlist.push(setcloum);
      //   //     //  }
      //   //     // lnws['!cols'] = closlist;
      //   //     wb.Sheets[item.sheetName]=lnws;
             
         
      //   //   })               
      //   //  var workbookOut  = XLSX.write(wb, {
      //   //     bookType: 'xlsx',
      //   //     bookSST: false,
      //   //     type: 'binary'
      //   //   });



      //   //   var fileName ="报表导出"
      //   //     //下载
      //   //   this.saveAs(
      //   //     new Blob([this.s2ab(workbookOut)], 
      //   //     {
      //   //       type: 'application/octet-stream'
      //   //     }), 
      //   //     `${fileName}.xlsx`
      //   //   )

      //  this.TableDataList.forEach((item,index)=>{
      //        wb.SheetNames.push(item.sheetName);
            
      //        let lnws=XLSX2.utils.table_to_sheet(document.getElementById('out-table-'+index));
      //       // XLSX.
      //       wb.Sheets[item.sheetName]=lnws;
             
         
      //     })               
      //    var workbookOut  = XLSX.write(wb, {
      //       bookType: 'xlsx',
      //       bookSST: false,
      //       type: 'binary'
      //     });
      //   var fileName ="报表导出"
      //       //下载
      //     this.saveAs(
      //       new Blob([this.s2ab(workbookOut)], 
      //       {
      //         type: 'application/octet-stream'
      //       }), 
      //       `${fileName}.xlsx`
      //     )



      //   //   var alltable=[];
      //   //   this.TableDataList.forEach((item,index)=>{
      //   //      wb.SheetNames.push(item.sheetName);
          
             
      //   //      var html = "<html><head><meta charset='utf-8' /></head><body>"
      //   //              + document.getElementById('out-table-'+index).outerHTML + "</body></html>";
      //   //     //  wb.Sheets[item.sheetName]=html;
      //   //     alltable.push(html);
         
      //   //   })               
       
      //   //    var fileName ="报表导出"
         
         
      //   // //  var htnl= "<html><head><meta charset='utf-8' /></head><body>"
      //   // //              + document.getElementById('out-table-0').outerHTML + "</body></html>";
      //   // // 实例化一个Blob对象，其构造函数的第一个参数是包含文件内容的数组，第二个参数是包含文件类型属性的对象
      //   // var blob = new Blob(alltable, { type: "application/vnd.ms-excel" });
      //   //  this.saveAs(blob, 
      //   //     `${fileName}.xlsx`
      //   //   )
      

     
    },
     s2ab(s) {
      if (typeof ArrayBuffer !== 'undefined') {
          var buf = new ArrayBuffer(s.length);
          var view = new Uint8Array(buf);
          for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
          return buf;
      } else {
          var buf = new Array(s.length);
          for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
          return buf;
      }
    },
     saveAs(obj, fileName) {
        var tmpa = document.createElement("a");
        tmpa.download = fileName || "下载";
        tmpa.href = URL.createObjectURL(obj);
        tmpa.click();
        setTimeout(function () {
            URL.revokeObjectURL(obj);
        }, 100);
      }
  },
  created() {
    this.setComBox();
    this.getOrganizationTree();
  },
};
</script>