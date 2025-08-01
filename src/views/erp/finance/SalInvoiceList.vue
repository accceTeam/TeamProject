<template>
  <div class="sal-invoice-list-container layout-pd">
    <el-card shadow="hover">
      <!-- 搜索表单组件 -->
      <SearchForm @search="onSearch" @reset="onReset" />
      
      <!-- 操作工具栏组件 -->
      <ToolBar 
        :selectedCount="selectedCount" 
        :columnConfig="columnConfig"
        @new="onNew" 
        @export="onExport" 
        @import="onImport"
        @custom-list="onCustomList" 
      />
      
      <!-- 表格组件 -->
      <TableComponent
        :data="tableData"
        :loading="loading"
        :pagination="pagination"
        :columnConfig="columnConfig"
        @selection-change="onSelectionChange"
        @edit="onEdit"
        @view="onView"
        @delete="onDelete"
        @close="onClose"
        @void="onVoid"
        @print="onPrint"
        @page-change="onPageChange"
        @sort-change="onSortChange"
      />
    </el-card>
  </div>
</template>

<script setup name="SalInvoiceList">
import { ref, reactive, onMounted } from 'vue'
import { getSalInvoiceList } from '/@/api/Sall/SalInvoiceList'
import SearchForm from '/@/components/SearchForm/search.vue'
import ToolBar from '/@/components/SearchForm/toolbar.vue'
import TableComponent from '/@/components/SearchForm/table.vue'

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

// 搜索参数
const searchParams = reactive({
  pageNum: 1,
  pageSize: 20
})

// 获取列表数据
const getTableData = async () => {
  try {
    loading.value = true
    const response = await getSalInvoiceList(searchParams)
    console.log('API响应:', response) // 调试日志
    
    // 根据后端返回的数据结构处理
    if (response && response.success) {
      // 如果后端返回的是标准格式 { success: true, result: { records: [], total: 0 } }
      if (response.result && Array.isArray(response.result.records)) {
        tableData.value = response.result.records
        pagination.total = response.result.total || 0
      } else if (Array.isArray(response.result)) {
        // 如果直接返回数组
        tableData.value = response.result
        pagination.total = response.result.length
      }
    } else if (Array.isArray(response)) {
      // 如果直接返回数组
      tableData.value = response
      pagination.total = response.length
    } else if (response && response.data) {
      // 如果返回格式是 { data: [] }
      tableData.value = response.data
      pagination.total = response.total || response.data.length
    } else {
      tableData.value = []
      pagination.total = 0
    }
    
    console.log('处理后的表格数据:', tableData.value) // 调试日志
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
  switch(command) {
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
const onNew = () => {
  console.log('新增发票')
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
.sal-invoice-list-container {
  height: 100%;
}

.table-container {
  margin-top: 20px;
}
</style>
