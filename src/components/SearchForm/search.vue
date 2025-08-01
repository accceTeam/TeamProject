<template>
  <div class="search-form-container">
    <el-form :model="searchForm" ref="searchFormRef" :inline="true" label-width="80px">
      <!-- 第一行 - 始终显示 -->
      <div class="search-row">
        <el-form-item label="单据编号:">
          <el-input v-model="searchForm.billNo" placeholder="请输入" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="单据日期:">
          <el-date-picker
            v-model="searchForm.billDate"
            type="date"
            placeholder="请选择开始日期"
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item>
          <span>-</span>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="searchForm.billDateEnd"
            type="date"
            placeholder="请选择结束日期"
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="单据主题:">
          <el-input v-model="searchForm.billSubject" placeholder="请输入" clearable style="width: 200px" />
        </el-form-item>
        
        <!-- 未展开时显示的按钮 -->
        <el-form-item v-show="!isExpanded">
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button @click="onReset">重置</el-button>
          <el-button type="text" @click="toggleExpand">
            展开
            <el-icon>
              <ele-ArrowDown />
            </el-icon>
          </el-button>
        </el-form-item>
        
        <!-- 展开时只显示展开按钮 -->
       
      </div>

      <!-- 第二行 - 可展开收起 -->
      <div class="search-row" v-show="isExpanded">
        <el-form-item label="发票类型:">
          <el-select v-model="searchForm.businessType" placeholder="请选择发票类型" style="width: 200px">
            <el-option label="请选择" value="" />
            <el-option label="不开票" value="no_invoice" />
            <el-option label="普通发票" value="normal_invoice" />
            <el-option label="专用发票" value="special_invoice" />
            <el-option label="专用增值税发票" value="vat_invoice" />
            <el-option label="收据" value="receipt" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="业务员:">
          <el-input v-model="searchForm.salesman" placeholder="请输入" clearable style="width: 150px" />
        </el-form-item>
        <el-form-item label="开票日期:">
          <el-date-picker
            v-model="searchForm.invoiceDate"
            type="date"
            placeholder="请选择开始日期"
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item>
          <span>-</span>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="searchForm.invoiceDateEnd"
            type="date"
            placeholder="请选择结束日期"
            style="width: 150px"
          />
        </el-form-item>
      </div>

      <!-- 第三行 - 可展开收起 -->
      <div class="search-row" v-show="isExpanded">
        <el-form-item label="客户:">
          <el-input v-model="searchForm.customer" placeholder="请选择" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="单据阶段">
          <el-select v-model="searchForm.currency" placeholder="请选择" style="width: 120px">
            <el-option label="编制中" value="In_preparation" />
            <el-option label="编制完" value="Completed_preparation" />
            <el-option label="核批中" value="Under_approval" />
            <el-option label="核批撤销" value="Revocation_Approval" />
            <el-option label="核批完" value="Approved" />
            <el-option label="执行中" value="In_progress" />
            <el-option label="执行止" value="Execution_Stop" />
            <el-option label="执行完" value="Completed_execution" />
          </el-select>
        </el-form-item>
        <el-form-item label="已生效:">
          <el-select v-model="searchForm.isEffective" placeholder="" style="width: 100px">
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="已关闭:">
          <el-select v-model="searchForm.isClosed" placeholder="" style="width: 100px">
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="已作废:">
          <el-select v-model="searchForm.isVoided" placeholder="" style="width: 100px">
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
      </div>

      <!-- 展开时的操作按钮行 -->
      <div class="search-row" v-show="isExpanded">
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button @click="onReset">重置</el-button>
          <el-button type="text" @click="toggleExpand">
            收起
            <el-icon>
              <ele-ArrowUp />
            </el-icon>
          </el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script setup name="SearchForm">
import { ref, reactive, nextTick } from 'vue'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['search', 'reset'])

// 定义变量
const searchFormRef = ref()
const isExpanded = ref(false)

const searchForm = reactive({
  billNo: '',
  billDate: '',
  billDateEnd: '',
  billSubject: '',
  businessType: '',
  salesman: '',
  invoiceDate: '',
  invoiceDateEnd: '',
  customer: '',
  currency: '',
  isEffective: '',
  isClosed: '',
  isVoided: ''
})

// 展开收起切换
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

// 重置表单
const onReset = () => {
  // 重置所有字段到初始状态
  searchForm.billNo = ''
  searchForm.billDate = null
  searchForm.billDateEnd = null
  searchForm.billSubject = ''
  searchForm.businessType = ''
  searchForm.salesman = ''
  searchForm.invoiceDate = null
  searchForm.invoiceDateEnd = null
  searchForm.customer = ''
  searchForm.currency = ''
  searchForm.isEffective = ''
  searchForm.isClosed = ''
  searchForm.isVoided = ''
  
  // 重置表单验证状态
  if (searchFormRef.value) {
    searchFormRef.value.resetFields()
    searchFormRef.value.clearValidate()
  }
  
  emit('reset')
}

// 查询
const onSearch = () => {
  emit('search', searchForm)
}
</script>

<style scoped>
.search-form-container {
  background: #fff;
  padding: 20px;
  margin-bottom: 20px;
}

.search-row {
  margin-bottom: 10px;
}

.search-row .el-form-item {
  margin-right: 20px;
  margin-bottom: 10px;
}
</style>


