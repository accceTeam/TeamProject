<template>
  <div class="table-container">
    <el-table
      :data="tableData"
      v-loading="loading"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      border
      stripe
    >
      <!-- 选择列 -->
      <el-table-column type="selection" width="55" fixed="left" />
      
      <!-- 动态渲染列 -->
      <template v-for="column in visibleColumns" :key="column.prop">
        <!-- 序号列 -->
        <el-table-column 
          v-if="column.prop === 'index'" 
          type="index" 
          label="#" 
          width="60" 
          fixed="left" 
        />
        
        <!-- 单据编号 -->
        <el-table-column 
          v-else-if="column.prop === 'billNo'" 
          prop="billNo" 
          label="单据编号" 
          width="120" 
          show-overflow-tooltip 
          fixed="left" 
          sortable 
        />
        
        <!-- 单据日期 -->
        <el-table-column 
          v-else-if="column.prop === 'billDate'" 
          prop="billDate" 
          label="单据日期" 
          width="100" 
          sortable 
        />
        
        <!-- 单据主题 -->
        <el-table-column 
          v-else-if="column.prop === 'subject'" 
          prop="subject" 
          label="单据主题" 
          width="150" 
          show-overflow-tooltip 
          sortable 
        />
        
        <!-- 源单号 -->
        <el-table-column 
          v-else-if="column.prop === 'sourceBillNo'" 
          prop="sourceBillNo" 
          label="源单号" 
          width="120" 
          show-overflow-tooltip 
          sortable 
        />
        
        <!-- 客户 -->
        <el-table-column 
          v-else-if="column.prop === 'customerId_dictText'" 
          prop="customerId_dictText" 
          label="客户" 
          width="120" 
          show-overflow-tooltip 
          sortable 
        />
        
        <!-- 发票类型 -->
        <el-table-column 
          v-else-if="column.prop === 'invoiceType_dictText'" 
          prop="invoiceType_dictText" 
          label="发票类型" 
          width="100" 
          sortable 
        />
        
        <!-- 蓝字发票号 -->
        <el-table-column 
          v-else-if="column.prop === 'blueInvoiceNo'" 
          prop="blueInvoiceNo" 
          label="蓝字发票号" 
          width="120" 
          sortable 
        />
        
        <!-- 发票号 -->
        <el-table-column 
          v-else-if="column.prop === 'invoiceNo'" 
          prop="invoiceNo" 
          label="发票号" 
          width="120" 
          sortable 
        />
        
        <!-- 开票日期 -->
        <el-table-column 
          v-else-if="column.prop === 'invoiceDate'" 
          prop="invoiceDate" 
          label="开票日期" 
          width="100" 
          sortable 
        />
        
        <!-- 单据阶段 -->
        <el-table-column 
          v-else-if="column.prop === 'billStage_dictText'" 
          prop="billStage_dictText" 
          label="单据阶段" 
          width="100" 
          sortable 
        />
        
        <!-- 金额 -->
        <el-table-column 
          v-else-if="column.prop === 'amt'" 
          prop="amt" 
          label="金额" 
          width="100" 
          align="right" 
          sortable
        >
          <template #default="scope">
            {{ scope.row.amt ? Number(scope.row.amt).toLocaleString() : '-' }}
          </template>
        </el-table-column>
        
        <!-- 已生效 -->
        <el-table-column 
          v-else-if="column.prop === 'isEffective'" 
          prop="isEffective" 
          label="已生效" 
          width="80" 
          align="center" 
          sortable
        >
          <template #default="scope">
            <el-tag :type="scope.row.isEffective ? 'success' : 'warning'">
              {{ scope.row.isEffective ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <!-- 已关闭 -->
        <el-table-column 
          v-else-if="column.prop === 'isClosed'" 
          prop="isClosed" 
          label="已关闭" 
          width="80" 
          align="center" 
          sortable
        >
          <template #default="scope">
            <el-tag :type="scope.row.isClosed ? 'info' : 'success'">
              {{ scope.row.isClosed ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <!-- 已作废 -->
        <el-table-column 
          v-else-if="column.prop === 'isVoided'" 
          prop="isVoided" 
          label="已作废" 
          width="80" 
          align="center" 
          sortable
        >
          <template #default="scope">
            <el-tag :type="scope.row.isVoided ? 'danger' : 'success'">
              {{ scope.row.isVoided ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <!-- 自动单据 -->
        <el-table-column 
          v-else-if="column.prop === 'isAuto'" 
          prop="isAuto" 
          label="自动单据" 
          width="80" 
          align="center" 
          sortable
        >
          <template #default="scope">
            <el-tag :type="scope.row.isAuto ? 'primary' : 'info'">
              {{ scope.row.isAuto ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <!-- 红字单据 -->
        <el-table-column 
          v-else-if="column.prop === 'eroBillType'" 
          prop="eroBillType" 
          label="红字单据" 
          width="80" 
          align="center" 
          sortable
        >
          <template #default="scope">
            <el-tag :type="scope.row.eroBillType ? 'danger' : 'success'">
              {{ scope.row.eroBillType ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <!-- 生效时间 -->
        <el-table-column 
          v-else-if="column.prop === 'effectiveTime'" 
          prop="effectiveTime" 
          label="生效时间" 
          width="120" 
          sortable 
        />
        
        <!-- 备注 -->
        <el-table-column 
          v-else-if="column.prop === 'remark'" 
          prop="remark" 
          label="备注" 
          width="120" 
          show-overflow-tooltip 
          sortable 
        />
        
        <!-- 核批人 -->
        <el-table-column 
          v-else-if="column.prop === 'approver_dictText'" 
          prop="approver_dictText" 
          label="核批人" 
          width="100" 
          sortable 
        />
        
        <!-- 制单时间 -->
        <el-table-column 
          v-else-if="column.prop === 'createTime'" 
          prop="createTime" 
          label="制单时间" 
          width="120" 
          sortable 
        />
        
        <!-- 制单人 -->
        <el-table-column 
          v-else-if="column.prop === 'createBy_dictText'" 
          prop="createBy_dictText" 
          label="制单人" 
          width="100" 
          sortable 
        />
        
        <!-- 制单部门 -->
        <el-table-column 
          v-else-if="column.prop === 'sysOrgCode'" 
          prop="sysOrgCode" 
          label="制单部门" 
          width="120" 
          sortable 
        />
        
        <!-- 修改时间 -->
        <el-table-column 
          v-else-if="column.prop === 'updateTime'" 
          prop="updateTime" 
          label="修改时间" 
          width="120" 
          sortable 
        />
        
        <!-- 修改人 -->
        <el-table-column 
          v-else-if="column.prop === 'updateBy_dictText'" 
          prop="updateBy_dictText" 
          label="修改人" 
          width="100" 
          sortable 
        />
        
        <!-- 操作列 -->
        <el-table-column 
          v-else-if="column.prop === 'operation'" 
          label="操作" 
          width="120" 
          fixed="right"
        >
          <template #default="scope">
            <div class="operation-container">
              <!-- 编辑按钮 - 灰色不可点击 -->
              <span class="edit-text">编辑</span>
              
              <!-- 分隔线 -->
              <span class="separator">|</span>
              
              <!-- 更多下拉菜单 -->
              <el-dropdown @command="(command) => handleMoreCommand(command, scope.row)" trigger="click">
                <span class="more-text">
                  更多
                  <el-icon class="el-icon--right">
                    <ele-ArrowDown />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="delete" disabled>
                      <span class="disabled-text">删除</span>
                    </el-dropdown-item>
                    <el-dropdown-item command="close">
                      <span>关闭</span>
                    </el-dropdown-item>
                    <el-dropdown-item command="void">
                      <span>作废</span>
                    </el-dropdown-item>
                    <el-dropdown-item command="print">
                      <span>打印</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
        
        <!-- 默认列处理 -->
        <el-table-column 
          v-else
          :prop="column.prop" 
          :label="column.label" 
          :width="column.width || 120" 
          :sortable="column.sortable !== false"
          :show-overflow-tooltip="column.showOverflowTooltip !== false"
        />
      </template>
    </el-table>
    
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup name="TableComponent">
import { ref, reactive, watch, computed } from 'vue'

// 定义父组件传过来的值
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Object,
    default: () => ({
      currentPage: 1,
      pageSize: 20,
      total: 0
    })
  },
  columnConfig: {
    type: Array,
    default: () => []
  }
})

// 定义子组件向父组件传值/事件
const emit = defineEmits(['selection-change', 'edit', 'view', 'delete', 'close', 'void', 'print', 'page-change', 'sort-change'])

// 表格数据
const tableData = ref(props.data)

// 计算可见列
const visibleColumns = computed(() => {
  if (props.columnConfig && props.columnConfig.length > 0) {
    return props.columnConfig.filter(col => col.visible)
  }
  // 默认显示所有列
  return [
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
})

// 监听props.data变化
watch(() => props.data, (newData) => {
  tableData.value = newData || []
  console.log('表格组件接收到的数据:', newData) // 调试日志
}, { immediate: true })

// 选择变化处理
const handleSelectionChange = (selection) => {
  emit('selection-change', selection)
}

// 排序变化处理
const handleSortChange = (sortInfo) => {
  emit('sort-change', sortInfo)
}

// 分页大小变化
const handleSizeChange = (size) => {
  emit('page-change', { page: props.pagination.currentPage, size })
}

// 当前页变化
const handleCurrentChange = (page) => {
  emit('page-change', { page, size: props.pagination.pageSize })
}

// 编辑操作
const onEdit = (row) => {
  emit('edit', row)
}

// 查看操作
const onView = (row) => {
  emit('view', row)
}

// 删除操作
const onDelete = (row) => {
  emit('delete', row)
}

// 处理更多菜单命令
const handleMoreCommand = (command, row) => {
  switch (command) {
    case 'delete':
      // 删除功能已禁用
      break
    case 'close':
      emit('close', row)
      break
    case 'void':
      emit('void', row)
      break
    case 'print':
      emit('print', row)
      break
  }
}
</script>

<style scoped>
.table-container {
  margin-top: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 操作列样式 */
.operation-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.edit-text {
  color: #c0c4cc;
  font-size: 14px;
  cursor: default;
}

.separator {
  color: #c0c4cc;
  font-size: 14px;
}

.more-text {
  color: #409eff;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.more-text:hover {
  color: #66b1ff;
}

.disabled-text {
  color: #c0c4cc !important;
}

:deep(.table-container.is-disabled) {
  background-color: transparent !important;
  cursor: default !important;
}

:deep(.table-container.is-disabled:hover) {
  background-color: transparent !important;
}
</style>







