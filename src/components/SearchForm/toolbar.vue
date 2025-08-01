<template>
  <div class="toolbar-container">
    <div class="toolbar-left">
      <el-button type="text" @click="onNew">
        <el-icon>
          <ele-Plus />
        </el-icon>
        新增
      </el-button>
      <el-button type="text" @click="onExport">
        <el-icon>
          <ele-Download />
        </el-icon>
        导出
      </el-button>
      <el-button type="text" @click="onImport">
        <el-icon>
          <ele-Upload />
        </el-icon>
        导入
      </el-button>
    
    
      <span class="selected-count">已选择 {{ selectedCount }}项</span>
      </div>
      <div class="toolbar-right">
      <el-popover
        ref="customListPopoverRef"
        v-model:visible="state.showCustomPopover"
        placement="left"
        :width="400"
        trigger="manual"
        :hide-after="0"
        :show-arrow="true"
        popper-class="custom-columns-popover"
        :close-on-click-outside="true"
        :close-on-press-escape="true"
      >
        <template #reference>
          <el-button 
            type="text" 
            class="custom-list-btn"
            @click="onCustomListClick"
          >
            自定义列
          </el-button>
        </template>
        
        <div class="custom-list-content">
          <div class="custom-columns-header">
            <h4>自定义列</h4>
          </div>
          <div class="custom-columns-body">
            <div class="columns-grid">
              <div class="column-item" v-for="column in columnOptions" :key="column.prop">
                <el-checkbox 
                  v-model="column.visible" 
                  @change="onColumnChange"
                >
                  {{ column.label }}
                </el-checkbox>
              </div>
            </div>
          </div>
          <div class="custom-columns-footer">
            <el-button size="small" @click="onResetColumns">重置</el-button>
            <el-button size="small" type="primary" @click="onApplyColumns">确定</el-button>
          </div>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script setup name="ToolBar">
import { reactive, ref, computed } from 'vue'

// 定义父组件传过来的值
const props = defineProps({
  selectedCount: {
    type: Number,
    default: 0
  },
  columnConfig: {
    type: Array,
    default: () => []
  }
})

// 定义子组件向父组件传值/事件
const emit = defineEmits(['new', 'export', 'import', 'custom-list'])

// 定义状态
const state = reactive({
  showCustomPopover: false,
  activeTab: 'column'
})

const customListPopoverRef = ref()

// 列选项配置 - 使用计算属性从父组件获取
const columnOptions = computed({
  get: () => {
    if (props.columnConfig && props.columnConfig.length > 0) {
      return props.columnConfig
    }
    // 默认配置
    return [
      { prop: 'index', label: '#', visible: false },
      { prop: 'billNo', label: '单据编号', visible: true },
      { prop: 'billDate', label: '单据日期', visible: true },
      { prop: 'subject', label: '单据主题', visible: true },
      { prop: 'customerId_dictText', label: '客户', visible: true },
      { prop: 'invoiceType_dictText', label: '发票类型', visible: true },
      { prop: 'invoiceNo', label: '发票号', visible: true },
      { prop: 'invoiceDate', label: '开票日期', visible: true },
      { prop: 'billStage_dictText', label: '单据阶段', visible: true },
      { prop: 'amt', label: '金额', visible: true },
      { prop: 'isEffective', label: '已生效', visible: true },
      { prop: 'isClosed', label: '已关闭', visible: true },
      { prop: 'isVoided', label: '已作废', visible: true },
      { prop: 'isAuto', label: '自动单据', visible: true },
      { prop: 'eroBillType', label: '红字单据', visible: true },
      { prop: 'effectiveTime', label: '生效时间', visible: true },
      { prop: 'remark', label: '备注', visible: true },
      { prop: 'approver_dictText', label: '核批人', visible: true },
      { prop: 'createTime', label: '制单时间', visible: true },
      { prop: 'createBy_dictText', label: '制单人', visible: true },
      { prop: 'sysOrgCode', label: '制单部门', visible: true },
      { prop: 'updateTime', label: '修改时间', visible: true },
      { prop: 'updateBy_dictText', label: '修改人', visible: true },
      { prop: 'operation', label: '操作', visible: true }
    ]
  },
  set: (value) => {
    // 当列配置变化时，通知父组件
    emit('custom-list', 'column-setting', value)
  }
})

// 保存原始列配置
const originalColumnOptions = ref([
  { prop: 'index', label: '#', visible: false },
  { prop: 'billNo', label: '单据编号', visible: true },
  { prop: 'billDate', label: '单据日期', visible: true },
  { prop: 'subject', label: '单据主题', visible: true },
  { prop: 'customerId_dictText', label: '客户', visible: true },
  { prop: 'invoiceType_dictText', label: '发票类型', visible: true },
  { prop: 'invoiceNo', label: '发票号', visible: true },
  { prop: 'invoiceDate', label: '开票日期', visible: true },
  { prop: 'billStage_dictText', label: '单据阶段', visible: true },
  { prop: 'amt', label: '金额', visible: true },
  { prop: 'isEffective', label: '已生效', visible: true },
  { prop: 'isClosed', label: '已关闭', visible: true },
  { prop: 'isVoided', label: '已作废', visible: true },
  { prop: 'isAuto', label: '自动单据', visible: true },
  { prop: 'eroBillType', label: '红字单据', visible: true },
  { prop: 'effectiveTime', label: '生效时间', visible: true },
  { prop: 'remark', label: '备注', visible: true },
  { prop: 'approver_dictText', label: '核批人', visible: true },
  { prop: 'createTime', label: '制单时间', visible: true },
  { prop: 'createBy_dictText', label: '制单人', visible: true },
  { prop: 'sysOrgCode', label: '制单部门', visible: true },
  { prop: 'updateTime', label: '修改时间', visible: true },
  { prop: 'updateBy_dictText', label: '修改人', visible: true },
  { prop: 'operation', label: '操作', visible: true }
])

// 新增
const onNew = () => {
  emit('new')
}

// 导出
const onExport = () => {
  emit('export')
}

// 导入
const onImport = () => {
  emit('import')
}

// 自定义列表按钮点击
const onCustomListClick = () => {
  state.showCustomPopover = !state.showCustomPopover
  if (state.showCustomPopover) {
    emit('custom-list', 'open')
  }
}

// 列变化处理
const onColumnChange = () => {
  // 实时更新父组件的列配置
  emit('custom-list', 'column-setting', columnOptions.value)
}

// 重置列配置
const onResetColumns = () => {
  emit('custom-list', 'column-setting', originalColumnOptions.value)
}

// 应用列配置
const onApplyColumns = () => {
  state.showCustomPopover = false
}
</script>

<style scoped>
.toolbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 20px;
}

.toolbar-left {
  display: flex;
  gap: 12px;
      align-items: center;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.selected-count {
  color: #606266;
  font-size: 14px;
}

.custom-list-btn {
  color: #409eff;
  font-size: 14px;
}

.toolbar-left .el-button {
  border-radius: 4px;
}

.toolbar-left .el-button .el-icon {
  margin-right: 4px;
}

.custom-list-content {
  padding: 0;
  min-width: 400px;
}

.custom-columns-header {
  padding: 16px 20px;
  border-bottom: 1px solid #ebeef5;
  background-color: #fafafa;
}

.custom-columns-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.custom-columns-body {
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.columns-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.column-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
}

.column-item .el-checkbox {
  width: 100%;
}

.column-item .el-checkbox__label {
  font-size: 14px;
  color: #606266;
}

.custom-columns-footer {
  padding: 16px 20px;
  border-top: 1px solid #ebeef5;
  background-color: #fafafa;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 弹出框样式 */
:deep(.custom-columns-popover) {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

:deep(.custom-columns-popover .el-popover__title) {
  font-weight: 500;
  color: #303133;
}
</style>


