<template>
  <div class="cost-rad layout-pd">
    <el-card shadow="hover">
      <!-- 搜索表单组件 -->
      <RubricSearchForm @search="onSearch" @reset="onReset" />

      <!-- 操作工具栏组件 -->
      <ToolBar :selectedCount="selectedCount" :columnConfig="columnConfig" @new="onNew" @export="onExport"
        @import="onImport" @custom-list="onCustomList" />

      <!-- 表格组件 -->
      <TableComponent :data="tableData" :loading="loading" :pagination="pagination" :columnConfig="columnConfig"
        @selection-change="onSelectionChange" @edit="onEdit" @view="onView" @delete="onDelete" @close="onClose"
        @void="onVoid" @print="onPrint" @page-change="onPageChange" @sort-change="onSortChange" />
    </el-card>
 
    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" :width="isFullscreen ? '100%' : '80%'"
      :fullscreen="isFullscreen" :close-on-click-modal="false" :close-on-press-escape="false"
      :show-close="false" class="rubric-invoice-dialog">
              <template #header="{ close, titleId, titleClass }">
          <div class="dialog-header">
            <span :id="titleId" :class="titleClass">销售发票(红冲)登记-新增</span>
            <div class="dialog-controls">
              <el-button type="text" @click="toggleFullscreen" class="fullscreen-btn">
                <el-icon>
                  <FullScreen v-if="!isFullscreen" />
                  <Aim v-else />
                </el-icon>
              </el-button>
              <el-button type="text" class="setting-btn">
                <el-icon>
                  <Setting />
                </el-icon>
              </el-button>
              <el-button type="text" @click="closeDialog" class="close-btn">
                <el-icon>
                  <Close />
                </el-icon>
              </el-button>
            </div>
          </div>
        </template>

              <div class="dialog-content">
          <!-- 表单内容 -->
          <el-form ref="formRef" :model="formData" :rules="formRules" label-width="90px" class="invoice-form">
            <!-- 第一行 -->
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="单据编号" prop="billNo" required>
                  <el-input v-model="formData.billNo" placeholder="自动生成" readonly />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="单据日期" prop="billDate" required>
                  <el-date-picker v-model="formData.billDate" type="date" placeholder="请选择日期" format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <div class="status-checkboxes">
                  <el-checkbox v-model="formData.isEffective" disabled>已生效</el-checkbox>
                  <el-checkbox v-model="formData.isClosed" disabled>已关闭</el-checkbox>
                  <div class="void-checkbox">
                    <el-checkbox v-model="formData.isVoided" disabled>已作废</el-checkbox>
                    <el-button type="text" class="dropdown-btn" @click="handleVoidDropdown">
                      <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
                    </el-button>
                  </div>
                </div>
              </el-col>
            </el-row>

            <!-- 第二行 -->
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="单据主题" prop="subject">
                  <el-input v-model="formData.subject" placeholder="请输入" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="客户" prop="customerId">
                  <el-select v-model="formData.customerId" placeholder="请选择" style="width: 100%">
                    <el-option label="客户A" value="1" />
                    <el-option label="客户B" value="2" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="蓝字单据" prop="blueBillId" required>
                  <el-select v-model="formData.blueBillId" placeholder="请选择" style="width: 100%">
                    <el-option label="单据A" value="1" />
                    <el-option label="单据B" value="2" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 第三行 -->
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="发票类型" prop="invoiceType">
                  <el-select v-model="formData.invoiceType" placeholder="请选择" style="width: 100%">
                    <el-option label="增值税专用发票" value="1" />
                    <el-option label="增值税普通发票" value="2" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="蓝字发票号" prop="blueInvoiceNo">
                  <el-input v-model="formData.blueInvoiceNo" placeholder="请输入" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="发票号" prop="invoiceNo" required>
                  <el-input v-model="formData.invoiceNo" placeholder="请输入" />
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 第四行 -->
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="开票日期" prop="invoiceDate">
                  <el-date-picker v-model="formData.invoiceDate" type="date" placeholder="请选择日期" format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

        <!-- 明细表格 -->
        <div class="detail-section">
          <div class="detail-header">
            <el-tabs v-model="activeTab" class="detail-tabs">
              <el-tab-pane label="蓝单明细" name="blue"></el-tab-pane>
              <el-tab-pane label="明细" name="detail"></el-tab-pane>
            </el-tabs>
            <div class="custom-columns">
              <el-icon>
                <Setting />
              </el-icon>
              <span>自定义列</span>
            </div>
          </div>

          <el-table :data="detailData" border style="width: 100%" class="detail-table">
            <el-table-column type="selection" width="55" />
            <el-table-column type="index" label="#" width="60" />
            <el-table-column prop="sourceEntryNo" label="源分录号" width="120" />
            <el-table-column prop="material" label="物料" width="120" />
            <el-table-column prop="specification" label="规格型号" width="120" />
            <el-table-column prop="taxRate" label="税率%" width="80" />
            <el-table-column prop="unit" label="单位" width="80" />
            <el-table-column prop="invoiceQuantity" label="开票数量" width="100" />
            <el-table-column prop="invoiceAmount" label="开票金额" width="100" />
            <el-table-column prop="remark" label="备注" width="120" />
            <el-table-column prop="custom" label="自定义" width="100" />
          </el-table>

                     <!-- 合计行 -->
           <div class="summary-row">
             <span class="summary-label">合计</span>
             <span class="summary-quantity">{{ totalQuantity.toFixed(2) }}</span>
             <span class="summary-amount">{{ totalAmount.toFixed(2) }}</span>
           </div>
        </div>

        <!-- 备注和附件 -->
        <div class="bottom-section">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="备注">
                <el-input v-model="formData.remark" type="textarea" :rows="3" placeholder="请输入备注" />
              </el-form-item>
            </el-col>
                          <el-col :span="12">
                <el-form-item label="附件">
                  <el-button type="primary" plain>
                    <el-icon>
                      <Upload />
                    </el-icon>
                    附件
                  </el-button>
                </el-form-item>
              </el-col>
          </el-row>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="saveForm">保存</el-button>
          <el-button type="primary" @click="submitForm">提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { getRubricSalInvoice210List, getFillRule } from '/@/api/Sall/RubricSalInvoice210List'
import RubricSearchForm from '/@/components/SearchForm/RubricSearchForm.vue'
import ToolBar from '/@/components/SearchForm/toolbar.vue'
import TableComponent from '/@/components/SearchForm/table.vue'
import { FullScreen, Aim, Close, Setting, Upload, ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 定义数据
const tableData = ref([])
const selectedCount = ref(0)
const loading = ref(false)

// 分页信息
const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
})

// 列配置
const columnConfig = ref([
  { prop: 'index', label: '#', visible: true },
  { prop: 'billNo', label: '单据编号', visible: true },
  { prop: 'billDate', label: '单据日期', visible: true },
  { prop: 'subject', label: '单据主题', visible: true },
  { prop: 'srcNo', label: '源单号', visible: true },
  { prop: 'customerId_dictText', label: '客户', visible: true },
  { prop: 'invoiceType_dictText', label: '发票类型', visible: true },
  { prop: 'blueInvoiceNo', label: '蓝字发票号', visible: true },
  { prop: 'invoiceNo', label: '发票号', visible: true },
  { prop: 'invoiceDate', label: '开票日期', visible: true },
  { prop: 'amt', label: '金额', visible: true },
  { prop: 'billStage_dictText', label: '单据阶段', visible: true },
  { prop: 'isEffective', label: '已生效', visible: true },
  { prop: 'isClosed', label: '已关闭', visible: true },
  { prop: 'isVoided', label: '已作废', visible: true },
  { prop: 'isAuto', label: '自动单据', visible: true },
  { prop: 'eroBillType', label: '红字单据', visible: true },
  { prop: 'remark', label: '备注', visible: true },
  { prop: 'effectiveTime', label: '生效时间', visible: true },
  { prop: 'approver_dictText', label: '核批人', visible: true },
  { prop: 'createTime', label: '制单时间', visible: true },
  { prop: 'createBy_dictText', label: '制单人', visible: true },
  { prop: 'sysOrgCode', label: '制单部门', visible: true },
  { prop: 'updateTime', label: '修改时间', visible: true },
  { prop: 'updateBy_dictText', label: '修改人', visible: true },
  { prop: 'operation', label: '操作', visible: true }
])

// 搜索参数
const searchParams = reactive({
  pageNum: 1,
  pageSize: 20
})

// 对话框相关数据
const dialogVisible = ref(false)
const isFullscreen = ref(false)
const dialogTitle = ref('销售发票(红冲)登记-新增')
const formRef = ref(null)
const activeTab = ref('blue')

// 表单数据
const formData = reactive({
  billNo: '',
  billDate: '',
  subject: '',
  invoiceType: '',
  customerId: '',
  invoiceDate: '',
  blueInvoiceNo: '',
  blueBillId: '',
  invoiceNo: '',
  isEffective: false,
  isClosed: false,
  isVoided: false,
  remark: ''
})

// 表单验证规则
const formRules = {
  billDate: [
    { required: true, message: '请选择单据日期', trigger: 'change' }
  ],
  blueBillId: [
    { required: true, message: '请选择蓝字单据', trigger: 'change' }
  ],
  invoiceNo: [
    { required: true, message: '请输入发票号', trigger: 'blur' }
  ]
}

// 明细数据
const detailData = ref([])

// 计算合计
const totalQuantity = computed(() => {
  return detailData.value.reduce((sum, item) => sum + (Number(item.invoiceQuantity) || 0), 0)
})

const totalAmount = computed(() => {
  return detailData.value.reduce((sum, item) => sum + (Number(item.invoiceAmount) || 0), 0)
})

// 获取列表数据
const getTableData = async () => {
  try {
    loading.value = true
    const response = await getRubricSalInvoice210List(searchParams)
    console.log('API响应:', response)

    if (response && response.success) {
      if (response.result && Array.isArray(response.result.records)) {
        tableData.value = response.result.records
        pagination.total = response.result.total || 0
      } else if (Array.isArray(response.result)) {
        tableData.value = response.result
        pagination.total = response.result.length
      }
    } else if (Array.isArray(response)) {
      tableData.value = response
      pagination.total = response.length
    } else if (response && response.data) {
      tableData.value = response.data
      pagination.total = response.total || response.data.length
    } else {
      tableData.value = []
      pagination.total = 0
    }

    console.log('处理后的表格数据:', tableData.value)
  } catch (error) {
    console.error('获取数据失败:', error)
    tableData.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}

// 选择变化处理
const onSelectionChange = (selection) => {
  selectedCount.value = selection.length
}

// 编辑处理
const onEdit = (row) => {
  console.log('编辑:', row)
}

// 查看处理
const onView = (row) => {
  console.log('查看:', row)
}

// 删除处理
const onDelete = (row) => {
  console.log('删除:', row)
}

// 关闭处理
const onClose = (row) => {
  console.log('关闭:', row)
}

// 作废处理
const onVoid = (row) => {
  console.log('作废:', row)
}

// 打印处理
const onPrint = (row) => {
  console.log('打印:', row)
}

// 分页处理
const onPageChange = ({ page, size }) => {
  searchParams.pageNum = page
  searchParams.pageSize = size
  getTableData()
}

// 排序处理
const onSortChange = ({ prop, order }) => {
  searchParams.sortField = prop
  searchParams.sortOrder = order
  getTableData()
}

// 自定义列表处理
const onCustomList = (command, data) => {
  console.log('自定义列表操作:', command, data)
  switch (command) {
    case 'column-setting':
      if (data && Array.isArray(data)) {
        columnConfig.value = JSON.parse(JSON.stringify(data))
        console.log('更新列配置:', columnConfig.value)
      }
      break
    case 'export-config':
      break
    case 'filter-setting':
      break
  }
}

// 搜索处理
const onSearch = (params) => {
  Object.assign(searchParams, params)
  searchParams.pageNum = 1
  getTableData()
}

// 重置处理
const onReset = () => {
  Object.keys(searchParams).forEach(key => {
    if (key !== 'pageNum' && key !== 'pageSize') {
      delete searchParams[key]
    }
  })
  searchParams.pageNum = 1
  getTableData()
}

// 新增处理
const onNew = async () => {
  console.log('新增发票')
  dialogVisible.value = true
  isFullscreen.value = false

  // 重置表单数据
  Object.keys(formData).forEach(key => {
    if (key === 'isEffective' || key === 'isClosed' || key === 'isVoided') {
      formData[key] = false
    } else {
      formData[key] = ''
    }
  })

  // 设置默认日期为今天
  formData.billDate = new Date().toISOString().split('T')[0]

  // 自动生成单据编号
  await generateBillNo()
}

// 生成单据编号
const generateBillNo = async () => {
  try {
    const response = await getFillRule()
    if (response && response.success && response.result) {
      formData.billNo = response.result
    } else {
      // 如果接口失败，使用默认格式
      const date = new Date()
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
      formData.billNo = `XSFP-${year}${month}${day}-${random}`
    }
  } catch (error) {
    console.error('生成单据编号失败:', error)
    // 使用默认格式
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    formData.billNo = `XSFP-${year}${month}${day}-${random}`
  }
}

// 切换全屏
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}

// 关闭对话框
const closeDialog = () => {
  dialogVisible.value = false
  isFullscreen.value = false
}

// 保存表单
const saveForm = async () => {
  try {
    await formRef.value.validate()
    console.log('保存表单数据:', formData)
    // 这里可以调用保存API
    ElMessage.success('保存成功')
    closeDialog()
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 提交表单
const submitForm = async () => {
  try {
    await formRef.value.validate()
    console.log('提交表单数据:', formData)
    // 这里可以调用提交API
    ElMessage.success('提交成功')
    closeDialog()
    // 刷新列表
    getTableData()
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 处理已作废下拉按钮点击
const handleVoidDropdown = () => {
  console.log('点击已作废下拉按钮')
  // 这里可以添加下拉菜单逻辑
  ElMessage.info('已作废下拉菜单')
}

// 导出处理
const onExport = () => {
  console.log('导出数据')
}

// 导入处理
const onImport = () => {
  console.log('导入数据')
}

// 页面加载时获取数据
onMounted(() => {
  getTableData()
})
</script>

<style scoped>
.cost-rad {
  height: 100%;
}

.table-container {
  margin-top: 20px;
}

/* 210发票列表特定的搜索表单样式 */
.cost-rad :deep(.form-row) {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}

.cost-rad :deep(.form-row:last-child) {
  margin-bottom: 0;
}

.cost-rad :deep(.button-row) {
  justify-content: flex-start;
  align-items: center;
}

.cost-rad :deep(.el-form-item) {
  margin-bottom: 0;
  margin-right: 0;
}

.cost-rad :deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
  min-width: 80px;
  text-align: right;
}

.cost-rad :deep(.el-input__wrapper) {
  border-radius: 4px;
}

.cost-rad :deep(.el-select .el-input__wrapper) {
  border-radius: 4px;
}

.cost-rad :deep(.el-date-editor .el-input__wrapper) {
  border-radius: 4px;
}

.cost-rad :deep(.el-button) {
  border-radius: 4px;
  font-weight: 500;
}

.cost-rad :deep(.ecat) {
  background-color: #409eff;
  border-color: #409eff;
}

.cost-rad :deep(.ecat:hover) {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

.cost-rad :deep(.ecat.is-link) {
  color: #409eff;
  border: none;
  background: transparent;
}

.cost-rad :deep(.ecat.is-link:hover) {
  color: #66b1ff;
  background: transparent;
}

/* 对话框样式 */
.rubric-invoice-dialog :deep(.el-dialog__header) {
  padding: 0;
}

.rubric-invoice-dialog :deep(.el-dialog__body) {
  padding: 20px;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;

}

.dialog-controls {
  display: flex;
  gap: 8px;
}

.fullscreen-btn,
.setting-btn,
.close-btn {
  padding: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #606266;
}

.fullscreen-btn:hover,
.setting-btn:hover,
.close-btn:hover {
  color: #409eff;
}

.dialog-content {
  max-height: 70vh;
  overflow-y: auto;
}

.invoice-form {
  margin-bottom: 20px;
}

.invoice-form :deep(.el-form-item) {
  margin-bottom: 12px;
}

.invoice-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
}

.detail-section {
  margin-bottom: 20px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.detail-tabs {
  flex: 1;
}

.custom-columns {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #606266;
  font-size: 14px;
  cursor: pointer;
}

.custom-columns:hover {
  color: #409eff;
}

.detail-table {
  margin-bottom: 16px;
}

.summary-row {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 12px 16px;
  background-color: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-top: none;
}

.summary-label {
  font-weight: 500;
  margin-right: 20px;
}

.summary-quantity,
.summary-amount {
  margin-left: 20px;
  font-weight: 500;
  color: #409eff;
}

.bottom-section {
  margin-top: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 必填字段样式 */
.invoice-form :deep(.el-form-item.is-required .el-form-item__label::before) {
  color: #f56c6c;
}

/* 复选框样式 */
.invoice-form :deep(.el-checkbox.is-disabled) {
  opacity: 0.6;
}

/* 状态复选框样式 */
.status-checkboxes {
  display: flex;
  
  gap: 8px;
  padding-top: 8px;
}

.status-checkboxes .el-checkbox {
  margin-right: 0;
}

.void-checkbox {
  display: flex;
  align-items: center;
  gap: 4px;
}

.dropdown-icon {
  color: #c0c4cc;
  font-size: 12px;
}
</style>