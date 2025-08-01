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
        label:'编码',
        
    }
])



// 高级查询  提交处理数据   处理后赋值给superQueryParams，然后再提交
const convertData = ref({
    rule:'',//中间的等于号等条件
    type:'',//请输入值的类型
    extendOption: ["Y", "N"],
    val:'',//输入的值
    field:''//左侧下拉列表  您选择的某一列
})

// 最终提交的查询参数
const advancedQueryParams = ref({
    _t: Math.floor(new Date().getTime() / 1000),
    superQueryParams:'',
    superQueryMatchType:'',//and或or
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
    // emit('update:dialogVisible', false)
    console.log(advancedQueryParams.value,'advancedQueryParams最终查询参数');
    
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