<template>
    <div>
        <el-dialog 
            draggable
            :close-on-press-escape='false'
            :close-on-click-modal="false"
            :show-close="false"
            :model-value="dialogVisible"
            @update:dialogVisible="emitVisibleChange"
            title="高级查询构造器"
            >
            <el-form>
                <el-form-item label="过滤条件匹配">
                    <el-select v-model="advancedQueryParams.superQueryMatchType" placeholder="Select" style="width: 240px">
                       <el-option
                         v-for="item in filterConditions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"
                       />
                    </el-select>
                </el-form-item>
                </el-form>
                <el-form v-for="(item,index) in convertData" :key="index" :model="item">
                <el-form-item>
                    <!-- 左侧下拉列表 -->
                    <el-select v-model="item.field" clearable>
                        <el-option
                            v-for="item in selectOrder"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            ></el-option>
                    </el-select>
                    <!-- 中间下拉列表 -->
                    <el-select v-model="item.rule" style="width: 100px;">
                        <el-option
                            v-for="item in centerSelect"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            ></el-option>
                    </el-select>
                    <!-- 右侧框需要判断 -->
                    <!-- 为日期的情况 -->
                    <el-date-picker
                        v-if="['billDate','effectiveTime','updateTime','createTime'].includes(item.field)"
                        v-model="item.val"
                        type="date"
                        placeholder="请选择日期"
                        style="width: 150px"
                    ></el-date-picker>
                    <!-- 为是否(下拉列表)的情况 -->
                    <el-select 
                        v-else-if="['isEffective','isClosed','isVoided','isRubric','createBy','sysOrgCode','hasRp','supplierId'].includes(item.field)"   
                        v-model="item.val">
                        <el-option
                            v-for="item in yORn"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            ></el-option>
                    </el-select>
                   
                <!-- 为单据阶段情况时 -->
                <el-select v-else-if="item.field === 'billStage'" v-model="item.val"
                     clearable>
                    <el-option
                        v-for="item in stage_optionData"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        ></el-option>
                </el-select>
                 <!-- 核批结果类型 -->
                <el-select
                    v-else-if="item.field === 'approveResultType'" v-model="item.val"
                    >
                    <el-option
                        v-for="item in approveResultType_optionData"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        ></el-option>
                </el-select>
                  <el-input
                        v-else
                        v-model="item.val"
                        placeholder="请输入"
                        style="width: 250px;"
                        clearable
                        ></el-input>
                </el-form-item>

            </el-form>
            
            <template #footer>
                <div class="dialog-footer">
                    <div>
                        <el-button  @click="reset" >重置</el-button>
                        <el-button @click="save">保存查询条件</el-button>
                    </div>
                    <div>
                        <el-button @click="cancel">关闭</el-button>
                        <el-button type="primary" @click="confirmSearch" >
                        查询
                        </el-button>
                    </div>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { ElMessage } from 'element-plus'
import { ref,watch} from 'vue'
import { Calendar } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

import { useAdvancedQueryStore } from '/@/stores/advancedQuery'
const advancedQueryStore  = useAdvancedQueryStore()  


// 定义搜索条件
   
// 过滤条件匹配
const filterConditions = ref([
    {
        label:'AND(所有条件都要求匹配)',
        value:'and'
    },
    {
        label:'OR(任意条件匹配即可)',
        value:'or'
    }
])
// 定义左一下拉列表的数据
const selectOrder = ref([
    {
        label:'单据编号',
        value:'billNo' 
    },
    {
        label:'单据日期',
        value:'billDate'
    },
    {
        label:'单据阶段',
        value:'billStage'
    },
    {
        label:'已生效',
        value:'isEffective'
    },
    {
        label:'已关闭',
        value:'isClosed'
    },
    {
        label:'已作废',
        value:'isVoided'
    },
    {
        label:'红字单据',
        value:'isRubric'
    },
    {
        label:'原单类型',
        value:'srcBillType'
    },
    {
        label:'原单号',
        value:'srcNo'
    },
    {
        label:'备注',
        value:'remark'
    },
    {
        label:'制单时间',
        value:'createTime'
    },
    {
        label:'制单人',   
        value:'createBy'
    },
    {
       label:'制单部门',   
       value:'sysOrgCode' 
    },
    {
        label:'修改时间',
        value:'updateTime'
    },
    {
        label:'修改人',  
        value:'updateBy'
    },
    {
        label:'生效时间',
        value:'effectiveTime'
    },
    {
        label:'核批人',  
        value:'approver'
    },
    {
        label:'核批结果类型',
        value:'approveResultType'
    },
    {
        label:'有来往',
        value:'hasRp'
    },
    {
        label:'供应商',
        value:'supplierId'
    }

])
// 定义中间的下拉列表
const centerSelect = ref([
    {
        label:'等于',
        value:'eq'
    },
    {
        label:'包含',
        value:'like'
    },
    {
        label:'以...开始',
        value:'right_like'
    },
    {
        label:'以...结尾',
        value:'left_like'
    },
    {
        label:'在...中',
        value:'in'   
    },
    {
        label:'不等于',
        value:'ne'
    },
    {
        label:'大于',
        value:'gt'
    },
    {
        label:'大于等于',
        value:'ge'
    },
    {
        label:'小于',
        value:'lt'
    },
    {
        label:'小于等于',
        value:'le'
    }
])
// 定义右侧是/否的选项
const yORn = ref([
    {
        label:'是',
        value:'1'
    },
    {
        label:'否',
        value:'0'
    }
])
// 定义选择单据阶段时，右侧下拉列表数据
const stage_optionData = ref([
    {
        label:'编译中',
        value:'12'
    },
    {
        label:'编译完',
        value:'14'
    },
    {
        label:'核批中',
        value:'22'
    },
    {
       label:'核批撤销',
       value:'23' 
    },
    {
        label:'核批完',
        value:'24'
    },
    {
        label:'执行中',
        value:'32'
    },
    {
        label:'执行止',
        value:'33'
    },
    {
        label:'执行完',
        value:'34'
    }
])
// 定义源单类型
const srcBillType_optionData = ref([
    {
        label:'销售报价',
        value:''
    },
    {
        label:'销售订单',
        value:''
    }
])


// 核批结果类型
const approveResultType_optionData = ref([
    {
        label:'通过',
        value:'1'
    },
    {
        label:'拒绝',
        value:'2'
    }
])



// 高级查询  需要提交的数据之 选择（单据阶段）  单据阶段需要提交6个数据进行URL编码
// 高级查询  提交处理数据   处理后赋值给superQueryParams，然后再提交
const convertData = ref([
    {
    rule:'',//中间的等于号等条件
    type:'',//请输入值的类型
    // dictCode:'',//这个属性是单据阶段进行提交是多出来的
    extendOption: ["Y", "N"],
    val:'',//输入的值
    field:''//左侧下拉列表  您选择的某一列
},

])

// 最终提交的查询参数
const advancedQueryParams = ref({
    _t: Math.floor(new Date().getTime() / 1000),
    superQueryParams:[],   //上面的convertData需要URL转码,然后赋值到这里
    superQueryMatchType:'and',//and或or
    isVoided:0,
    column:'createTime',
    order:'desc',
    field:'id,,,billNo,billDate,subject,srcNo,supplierId_dictText,opDept_dictText,operator_dictText,cost,settleAmt,settledAmt,invoicedAmt,invoiceType_dictText,handler_dictText,billStage_dictText,isEffective_dictText,isClosed_dictText,isVoided_dictText,isAuto_dictText,isRubric_dictText,remark,effectiveTime,approver_dictText,createTime,createBy_dictText,sysOrgCode_dictText,updateTime,updateBy_dictText,action',
    pageNo:1,
    pageSize:10

})

// 接收父组件 dialogVisible的状态
const props = defineProps({
    dialogVisible:Boolean,
})



// 发送子组件的弹窗状态
const emit = defineEmits(['update:dialogVisible'])
function emitVisibleChange(val) {
    emit('update:dialogVisible', val)
}
// 取消按钮
const cancel=()=>{
    emit('update:dialogVisible', false)
}
// 确定按钮
const confirmSearch=async()=>{    
    // 当用户在左侧下拉列表选择 （单据阶段）时，需要在convertData的dictCode赋值为:x_bill_stage
    if(convertData.value.field === 'billStage'){
        convertData.value.dictCode = 'x_bill_stage'
    }else if(convertData.value.field === 'approveResultType'){
        convertData.value.dictCode = 'x_approval_result_type'
    }else if(convertData.value.field === 'supplierId'){
        convertData.value.dictCode = 'bas_supplier,aux_name,id'
    }else if(convertData.value.field === 'isEffective'){
        convertData.value.dictCode = 'yn'
    }else if(convertData.value.field === 'isClosed'){
        convertData.value.dictCode = 'yn'
    }else if(convertData.value.field === 'isVoided'){
        convertData.value.dictCode = 'yn'
    }else if(convertData.value.field === 'isRubric'){
        convertData.value.dictCode = 'yn'
    }else if(convertData.value.field === 'hasRp'){
        convertData.value.dictCode = 'yn'
    }else if(convertData.value.field === 'updateBy'){
        convertData.value.dictCode = 'sys_user,realname,username'
    }else if(convertData.value.field === 'createBy'){
        convertData.value.dictCode = 'sys_user,realname,username'
    }else if(convertData.value.field === 'sysOrgCode'){
        convertData.value.dictCode = 'sys_depart,depart_name,org_code'
    }else if(convertData.value.field === 'approver'){
        convertData.value.dictCode = 'sys_user,realname,username'
    }

    // 当用户选择日期类选项时，需要将默认的时间格式转为YYYY-MM-DD
    if(['billDate','effectiveTime','updateTime','createTime'].includes(convertData.value.field) && convertData.value.val){
        convertData.value.val = dayjs(convertData.value.val).format('YYYY-MM-DD')
    }


    // 提交前，type是输入值的类型，这里判断输入值val的类型再赋值给type
    // 提交前，判断val的类型并赋值给type  如果是日期类格式，就为date
    if(convertData.value.val instanceof Date || (convertData.value.val && dayjs(convertData.value.val).isValid()
    && ['billDate','effectiveTime','updateTime','createTime'].includes(convertData.value.field))){
        convertData.value.type = 'date'
    }else{
        convertData.value.type = typeof convertData.value.val
    }






    // 1.转码操作
    const encodeData = encodeURIComponent(JSON.stringify(convertData.value))
    // 2.转码后赋值给superQueryParams中的superQueryParams，然后再提交
    advancedQueryParams.value.superQueryParams = encodeData
    // 打印测试
    console.log(convertData.value,'convertData转码前');
    
    console.log(advancedQueryParams.value,'advancedQueryParams最终查询参数(转码后)');
    // emit('update:dialogVisible', false)
    
    // 将参数保存到pinia中
    advancedQueryStore.setAdvancedQueryParams(advancedQueryParams.value)
}









</script>
<style setup>
    .titleClass{
        display: flex;
        justify-content: center;
        border-bottom: 1px solid ;
    }
    .demo-tabs > .el-tabs__content {
      padding: 32px;
      color: #6b778c;
      font-size: 32px;
      font-weight: 600;
    }
    .demo-tabs .custom-tabs-label .el-icon {
      vertical-align: middle;
    }
    .demo-tabs .custom-tabs-label span {
      vertical-align: middle;
      margin-left: 4px;
    }
    .dialog-footer{
        display: flex;
        justify-content: space-between;
    }
</style>