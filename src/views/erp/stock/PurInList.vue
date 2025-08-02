<template>
    <div class="container">
            <InventoryInput
                @searchInputData='getSearchData'
                @clearSearchData="resetSearchData"
                :inputConfigs="inputConfigs"
                >
                <template #billDate_begin>
                    <el-date-picker
                      v-model="searchData.billDate_begin"
                      type="date"
                      placeholder="请选择开始日期"
                      :default-value="new Date()"
                       format="YYYY-MM-DD"
                    />
                </template>
                <template #billDate_end>
                    <el-date-picker
                      v-model="searchData.billDate_end"
                      type="date"
                      placeholder="请选择结束日期"
                      :default-value="new Date()"
                       format="YYYY-MM-DD"
                    />
                </template>
                <template #subject>
                  <el-select v-model="searchData.subject" placeholder="Select" style="width: 240px">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </template>
                <template #billStage>
                  <el-select v-model="searchData.billStage" placeholder="请选择单据阶段" style="width: 240px">
                    <el-option
                      v-for="item in stageOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </template>

                <template #isEffective>
                  <el-select v-model="searchData.isEffective" placeholder="请选择是否已生效" style="width: 240px">
                    <el-option
                      v-for="item in effectiveOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </template>

                <template #isClosed>
                  <el-select v-model="searchData.isClosed" placeholder="请选择是否已关闭" style="width: 240px">
                    <el-option
                      v-for="item in closedOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </template>
                <template #isVoided>
                  <el-select v-model="searchData.isVoided" placeholder="请选择是否已作废" style="width: 240px">
                    <el-option
                      v-for="item in voidedOptions"
                       @updateParentTable="updateParentTable"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </template>
            </InventoryInput>
            <!-- 新增按钮 导出按钮... -->
            <div>

            </div>
            <InventoryTable
              ref="mytable" 
              :tableData="tableData"
              :tableSetting="tableSetting"
              :tableTotal="tableTotal"
              @updateSize="updateSize" 
              @updateCurrentPage="updateCurrentPage"
              @updateSort="updateSort"
              >
              <!-- 单据编号 -->
            <template #billNo="{ scoped }">
                <el-button
                  type="primary"
                  @click="lookDetail(scoped)"
                  link>
                {{ scoped.billNo}}
                </el-button>
            </template>
            
            <template #tableOperate>
              <div style="display: flex;justify-content: center;">
                <el-button 
                 link
                 size="small"
                 type="primary"
                 @click="editMditem(scoped)"
                >编辑</el-button>
              <el-button
                 link
                 size="small"
                 type="primary"
                 @click="deleteItem(scoped)"
                >更多</el-button>
              </div>
            </template>
            </InventoryTable>
           
            
    </div>
</template>
<script setup>
import { ElNotification } from 'element-plus'
import { dayjs } from 'element-plus'
import { onMounted, ref } from 'vue';
import InventoryInput from '/@/components/Inventorymanagement/Purchaseinventory/InventoryInput.vue';
import InventoryTable from '/@/components/Inventorymanagement/Purchaseinventory/InventoryTable.vue';
// import advancedQuery from '/@/components/Inventorymanagement/Purchaseinventory/advancedQuery.vue';
import { getPurchaseInventory } from '/@/api/InventoryManagement/purchaseInventory/purchaseInventory.js'


// 从pinia中取 advancedQueryParams.value
import { useAdvancedQueryStore } from '/@/stores/advancedQuery'
import { watch } from 'vue';
const advancedQueryStore  = useAdvancedQueryStore()


// 定义input结构
const inputConfigs = [
  { label: '单据编号', placeholder: '请输入单据编号', prop: 'billNo', slotStatus:false},
  { label: '单据日期', placeholder: '请输入开始时间', prop: 'billDate_begin',slotStatus:true},
  {  placeholder: '请输入结束时间', prop: 'billDate_end',slotStatus:true}, 
  { label: '单据主题', placeholder: '请输入单据主题', prop: 'subject', slotStatus:false},
  { label: '供应商', placeholder: '请选择', prop: 'supplier', slotStatus:true},
  { label: '单据阶段', placeholder: '请选择单据阶段', prop: 'billStage', slotStatus:true},
  { label: '已生效', placeholder: '请选择是否已生效', prop: 'isEffective', slotStatus:true},
  { label: '已关闭', placeholder: '请选择是否已关闭', prop: 'isClosed', slotStatus:true},
  { label: '已作废', placeholder: '请选择是否已作废', prop: 'isVoided', slotStatus:true}
]

// 定义单据阶段
const stageOptions = [
  {
    value: 12,
    label: '编译中',
  },
  {
    value: 14,
    label: '编译完',
  },
  {
    value: 22,
    label: '核批中',
  },
  {
    value: 23,
    label: '核批撤销',
  },
  {
    value: 24,
    label: '核批完',
  },
  {
    value: 32,
    label: '执行中',
  },
  {
    value:33,
    label:'执行止'
  },
  {
    value:34,
    label:'执行完'
  }
]
// 定义已生效
const effectiveOptions = ref([
  {
    label:'是',
    value:1
  },
  {
    label:'否',
    value:0
  }
])
// 定义已关闭
const closedOptions = ref([
  {
    label:'是',
    value:1
  },
  {
    label:'否',
    value:0
  }
])
// 定义已作废
const voidedOptions = ref([
   {
    label:'是',
    value:1
  },
  {
    label:'否',
    value:0
  }
])



let tableData = ref([])
const mytable = ref(null)
// 右侧表格总条数、总页数  
let tableTotal = ref(0)
// 定义table结构
const tableSetting = ref([
    {
        label:'单据编号',
        prop:'billNo',
        width:170,
        slotStatus: true,
        isFixed:true,
        isSortTable:true
    },
    {
        label:'单据日期',
        prop:'billDate',
        width:140, 
        isSortTable:true
    },
    {
        label:'单据主题',
        prop:'specification',
        width:140, 
        isSortTable:true
    },
    {
        label:'源单号',
        prop:'srcNo',
        width:160, 
        isSortTable:true
    },
    {
        label:'供应商',
        prop:'supplierId_dictText',
        width:140, 
        isSortTable:true
    },
    {
        label:'业务部门',
        prop:'opDept_dictText',
        width:140, 
        isSortTable:true
    },
    {
        label:'业务员',
        prop:'operator_dictText',
        width:140, 
        isSortTable:true
    },
    {
        label:'入库金额',
        prop:'cost',
        width:140, 
    },
    {
        label:'结算金额',
        prop:'settleAmt',
        width:140, 
    },
    {
        label:'已结算金额',
        prop:'settledAmt',
        width:140, 
    },
    {
        label:'已开票金额',
        prop:'invoicedAmt',
        width:140, 
    },
    {
        label:'发票类型',
        prop:'invoiceType_dictText',
        width:140, 
    },
    {
        label:'入库经办',
        prop:'handler_dictText',
        width:140, 
        isSortTable:true
    },
    {
        label:'单据阶段',
        prop:'billStage_dictText',
        width:140, 
    },
    {
        label:'已生效',
        prop:'isEffective_dictText',
        width:140, 
    },
    {
        label:'已关闭',
        prop:'isClosed_dictText',
        width:140, 
    },
    {
        label:'已作废',
        prop:'isVoided_dictText',
        width:140, 
    },
    {
        label:'自动单据',
        prop:'isAuto_dictText',
        width:140, 
    },
    {
        label:'红字单据',
        prop:'isRubric_dictText',
        width:140, 
    },
    {
        label:'备注',
        prop:'remark',
        width:140, 
    },
    {
        label:'生效时间',
        prop:'effectiveTime',
        width:140, 
    },
    {
        label:'核批人',
        prop:'createBy_dictText',
        width:140, 
    },
    {
        label:'制单时间',
        prop:'billDate',
        width:140, 
    },
    {
        label:'制单部门',
        prop:'sysOrgCode_dictText',
        width:140, 
    },
    {
        label:'修改时间',
        prop:'updateTime',
        width:140, 
    },
    {
        label:'修改人',
        prop:'createBy_dictText',
        width:140, 
    },
    {
        label:'操作',
        prop:'tableOperate',
        width:140, 
        slotStatus: true,
        isFixed:'right'
    }
])
// 获取table所需的参数
const needTableParams = ref({
    // _t:new Date().getTime(),  //这是需要10位时间戳
    _t: Math.floor(new Date().getTime() / 1000),
    isVoided: 0,
    column:'createTime',
    order:'desc',
    pageNo:1,
    pageSize:10,
    field:'id,,,billNo,billDate,subject,srcNo,supplierId_dictText,opDept_dictText,operator_dictText,cost,settleAmt,settledAmt,invoicedAmt,invoiceType_dictText,handler_dictText,billStage_dictText,isEffective_dictText,isClosed_dictText,isVoided_dictText,isAuto_dictText,isRubric_dictText,remark,effectiveTime,approver_dictText,createTime,createBy_dictText,sysOrgCode_dictText,updateTime,updateBy_dictText,action'
})

// 定义要搜索的数据
const searchData = ref({
    billNo: '',
    billDate_begin: '',
    billDate_end: '',
    subject: '',
    supplier: '',   //此项无效
    billStage: '',
    isEffective: '',
    isClosed: '',
    isVoided: '',
    field:'id,,,billNo,billDate,subject,srcNo,supplierId_dictText,opDept_dictText,operator_dictText,cost,settleAmt,settledAmt,invoicedAmt,invoiceType_dictText,handler_dictText,billStage_dictText,isEffective_dictText,isClosed_dictText,isVoided_dictText,isAuto_dictText,isRubric_dictText,remark,effectiveTime,approver_dictText,createTime,createBy_dictText,sysOrgCode_dictText,updateTime,updateBy_dictText,action'

})

// 搜索
const getSearchData=async(data)=>{

    // 处理时间数据--->>>年-月-日
    const begin = searchData.value.billDate_begin
    const end = searchData.value.billDate_end
    const formatBegin = begin ? dayjs(begin).format('YYYY-MM-DD') : ''
    const formatEnd = end ? dayjs(end).format('YYYY-MM-DD') : ''
    searchData.value.billDate_begin = formatBegin
    searchData.value.billDate_end = formatEnd
    searchData.value.billNo = data.billNo
    searchData.value.subject = data.subject
    console.log(data,'子组件要搜索的数据');

    console.log(searchData.value,'父组件搜索的数据');
    // console.log(formatBegin,formatEnd,'日期'); 

    // console.log(await getPurchaseInventory(searchData.value),'搜索出来的数据');
    try {
      let {code,result} = await  getPurchaseInventory(searchData.value)
      if(code == 200){
        ElNotification({
          message:'采购入库数据获取成功',
          type:'success',
          duration: 1000,
        })
        let {countId,current,maxLimit,optimizeCountSql,orders,pages,records,searchCount,size,total} = result
        tableData.value = records
        tableTotal.value = total        
      }else{
        ElNotification({
          type:'error',
        })
      }
    } catch (error) { 
    }
}
// 重置
const resetSearchData=()=>{
    Object.keys(searchData.value).
    forEach(key =>{
      searchData.value[key] = ''
    })
     getTableData()
}
// 排序
const updateSort=({column,order})=>{
    needTableParams.value.column = column
    needTableParams.value.order = order
    console.log(needTableParams.value,'needTableParams');
    
    getTableData()

}

// 获取table数据
const getTableData = async () => {
  // console.log(await getPurchaseInventory(needTableParams.value),'table数据');
  try {
    // countId,current,maxLimit,optimizeCountSql,orders,pages,records,searchCount,size,total
    let {code,result} = await getPurchaseInventory(needTableParams.value)
    if(code == 200){
      ElNotification({
        message:'采购入库数据获取成功',
        type:'success',
        duration: 1000,
      })
      let {countId,current,maxLimit,optimizeCountSql,orders,pages,records,searchCount,size,total} = result
      tableData.value = records
      tableTotal.value = total
    }else{
      ElNotification({
        type:'error',
        message:'采购入库数据获取失败'
      })
    }
  } catch (error) {
    console.log(error,'采购数据获取');
    
  }
}
getTableData()


// 监听 advancedQueryParams.value
watch(()=>advancedQueryStore.advancedQueryParams,async(newVal,oldVal)=>{
  console.log('purInList收到了',newVal);
  
  try {
    // console.log(await getPurchaseInventory(newVal),'高级查询数据');
    let { result,code } = await getPurchaseInventory(newVal)
    let { optimizeCountSql,pages,records,searchCount,size,total } = result
    
  } catch (error) {
    console.log(error,'error'); 
  }
  
},{deep:true})


// 分页器
// 分页器相关
// 页码/条数更新
const updateSize = (size) => {
    console.log(size, 'size更新');
    needTableParams.value.pageSize = size
    // console.log(needTableParams.value,'测试一下');
    // 更新数据
    getTableData()
}
// 页码
const updateCurrentPage = (page) => {
    console.log(page, 'page更新');
    needTableParams.value.pageNo = page
    // 更新数据
    // console.log('打印params',needTableParams.value);
    getTableData()
}

</script>
<style scoped>
.container{
    padding: 16px 24px;
}

</style>