<template>
  <div class="rubric-search-form">
    <el-form :model="searchForm" ref="searchFormRef" :inline="true" class="search-form">
      <!-- 使用插槽来自定义搜索字段 -->
      <slot name="search-fields" :searchForm="searchForm" :isExpanded="isExpanded">
        <!-- 默认的搜索字段 -->
        <!-- 第一行 - 始终显示 -->
        <div class="form-row">
          <el-form-item label="单据编号" prop="billNo">
            <el-input 
              v-model="searchForm.billNo" 
              placeholder="请输入" 
              clearable 
              style="width: 200px"
            />
          </el-form-item>
          
          <el-form-item label="单据日期" prop="billDateRange">
            <el-date-picker
              v-model="searchForm.billDateRange"
              type="daterange"
              range-separator="~"
              start-placeholder="请选择开始"
              end-placeholder="请选择结束"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 300px"
            />
          </el-form-item>
          
          <el-form-item label="单据主题" prop="subject">
            <el-input 
              v-model="searchForm.subject" 
              placeholder="请输入" 
              clearable 
              style="width: 200px"
            />
          </el-form-item>
          
          <!-- 未展开时显示的按钮 -->
          <el-form-item v-show="!isExpanded">
            <el-button type="primary" @click="handleSearch" :icon="Search">
              查询
            </el-button>
            <el-button @click="handleReset" :icon="Refresh">
              重置
            </el-button>
            <el-button 
              type="primary" 
              link 
              @click="toggleExpand" 
              :icon="ArrowDown"
            >
              展开
            </el-button>
          </el-form-item>
        </div>
        
        <!-- 第二行 - 可展开收起 -->
        <div class="form-row" v-show="isExpanded">
          <el-form-item label="客户" prop="customerId">
            <el-select 
              v-model="searchForm.customerId" 
              placeholder="请选择" 
              clearable 
              style="width: 200px"
            >
              <el-option label="客户A" value="customerA" />
              <el-option label="客户B" value="customerB" />
              <el-option label="客户C" value="customerC" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="单据阶段" prop="billStage">
            <el-select 
              v-model="searchForm.billStage" 
              placeholder="请选择" 
              clearable 
              style="width: 150px"
            >
              <el-option label="草稿" value="draft" />
              <el-option label="待审核" value="pending" />
              <el-option label="已审核" value="approved" />
              <el-option label="已关闭" value="closed" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="已生效" prop="isEffective">
            <el-select 
              v-model="searchForm.isEffective" 
              placeholder="请选择" 
              clearable 
              style="width: 120px"
            >
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="已关闭" prop="isClosed">
            <el-select 
              v-model="searchForm.isClosed" 
              placeholder="请选择" 
              clearable 
              style="width: 120px"
            >
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="已作废" prop="isVoided">
            <el-select 
              v-model="searchForm.isVoided" 
              placeholder="请选择" 
              clearable 
              style="width: 120px"
            >
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </el-form-item>
        </div>
        
        <!-- 展开时的操作按钮行 -->
        <div class="form-row" v-show="isExpanded">
          <el-form-item>
            <el-button type="primary" @click="handleSearch" :icon="Search">
              查询
            </el-button>
            <el-button @click="handleReset" :icon="Refresh">
              重置
            </el-button>
            <el-button 
              type="primary" 
              link 
              @click="toggleExpand" 
              :icon="ArrowUp"
            >
              收起
            </el-button>
          </el-form-item>
        </div>
      </slot>
     
    </el-form>
  </div>
</template>

<script setup name="RubricSearchForm">
import { ref, reactive } from 'vue'
import { Search, Refresh, ArrowUp, ArrowDown } from '@element-plus/icons-vue'

// 定义事件
const emit = defineEmits(['search', 'reset'])

// 表单引用
const searchFormRef = ref()

// 展开状态
const isExpanded = ref(false)

// 搜索表单数据
const searchForm = reactive({
  billNo: '',
  billDateRange: [],
  subject: '',
  customerId: '',
  billStage: '',
  isEffective: '',
  isClosed: '',
  isVoided: ''
})

// 搜索处理
const handleSearch = () => {
  const params = { ...searchForm }
  
  // 处理日期范围
  if (params.billDateRange && params.billDateRange.length === 2) {
    params.billDateStart = params.billDateRange[0]
    params.billDateEnd = params.billDateRange[1]
  }
  delete params.billDateRange
  
  emit('search', params)
}

// 重置处理
const handleReset = () => {
  searchFormRef.value?.resetFields()
  Object.keys(searchForm).forEach(key => {
    if (key === 'billDateRange') {
      searchForm[key] = []
    } else {
      searchForm[key] = ''
    }
  })
  emit('reset')
}

// 切换展开状态
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

// 暴露方法给父组件
defineExpose({
  reset: handleReset,
  getFormData: () => searchForm
})
</script>

<style scoped>
.rubric-search-form {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.search-form {
  width: 100%;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}

.form-row:last-child {
  margin-bottom: 0;
}

.button-row {
  justify-content: flex-start;
  align-items: center;
}

:deep(.el-form-item) {
  margin-bottom: 0;
  margin-right: 0;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
  min-width: 80px;
  text-align: right;
}

:deep(.el-input__wrapper) {
  border-radius: 4px;
}

:deep(.el-select .el-input__wrapper) {
  border-radius: 4px;
}

:deep(.el-date-editor .el-input__wrapper) {
  border-radius: 4px;
}

:deep(.el-button) {
  border-radius: 4px;
  font-weight: 500;
}

:deep(.el-button--primary) {
  background-color: #409eff;
  border-color: #409eff;
}

:deep(.el-button--primary:hover) {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

:deep(.el-button--primary.is-link) {
  color: #409eff;
  border: none;
  background: transparent;
}

:deep(.el-button--primary.is-link:hover) {
  color: #66b1ff;
  background: transparent;
}

/* 展开收起动画效果 */
.form-row {
  transition: all 0.3s ease-in-out;
}

.form-row[v-show="false"] {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}

.form-row[v-show="true"] {
  opacity: 1;
  max-height: 100px;
}
</style> 