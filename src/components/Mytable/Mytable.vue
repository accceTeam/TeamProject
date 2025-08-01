
<template>
  <div style="padding: 10px;">
    <el-card>
      <el-row :gutter="10">
        <el-col>
          <span style="width: 40px;">编码:</span>
          <el-input size='default' v-model="localSearchParams.inputCode" placeholder="请输入" />
        </el-col>
        <el-col>
          <span style="width: 40px;">名称:</span>
          <el-input size='default' v-model="localSearchParams.inputName" placeholder="请输入" />
        </el-col>

        <el-col v-if="localSearchParams.isExpanded">
          <span>客户分类:</span>
          <el-select size='default' v-model="localSearchParams.customerCategory" placeholder="请选择">
            <el-option label="请选择" value="1"></el-option>
          </el-select>
        </el-col>
        <el-col v-if="localSearchParams.isExpanded">
          <span>客户等级:</span>
          <el-select size='default' v-model="localSearchParams.customerLevel" placeholder="请选择">
            <el-option label="请选择" value="1"></el-option>
            <el-option label="等级1" value="2"></el-option>
            <el-option label="等级2" value="2"></el-option>
          </el-select>
        </el-col>
        <el-col v-if="localSearchParams.isExpanded">
          <span>纳税规模:</span>
          <el-select size='default' v-model="localSearchParams.taxScale" placeholder="请选择">
            <el-option label="一般纳税人" value="1"></el-option>
          </el-select>
        </el-col>
        <el-col v-if="localSearchParams.isExpanded">
          <span>所属地区:</span>
          <el-select size='default' v-model="localSearchParams.region" 
            :suffix-icon="localSearchParams.isExpanded ? CaretBottom : CaretTop" placeholder="请选择">
            <el-option label="选项1" value="1"></el-option>
            <el-option label="选项2" value="2"></el-option>
          </el-select>
        </el-col>
        <el-col v-if="localSearchParams.isExpanded">
          <span>业务区域:</span>
          <el-select size='default' v-model="localSearchParams.businessArea" 
            :suffix-icon="localSearchParams.isExpanded ? CaretBottom : CaretTop" placeholder="请选择">
            <el-option label="选项1" value="1"></el-option>
            <el-option label="选项2" value="2"></el-option>
          </el-select>
        </el-col>
        <el-col>
          <el-button type="primary" @click="handleSearch"><el-icon>
              <Search />
            </el-icon>查询</el-button>
          <el-button @click="handleReset"><el-icon>
              <RefreshRight />
            </el-icon>重置</el-button>
          <el-button type="primary" @click="showAdvancedSearch"><el-icon>
              <Filter />
            </el-icon>高级查询</el-button>
          <el-button link type="primary" class="zhankai" @click="toggleForm">{{ localSearchParams.isExpanded ? '收起' : '展开' }}
            <el-icon>
              <ArrowDown v-if="!localSearchParams.isExpanded" />
              <ArrowUp v-else />
            </el-icon>
          </el-button>
        </el-col>
      </el-row>
      <!-- 高级查询弹窗 -->
      <el-dialog v-model="advancedSearchVisible" title="高级查询构造器" style="width: 944px !important;" draggable="true">
        <div style="margin-top: 5px; display: flex; border-top: 1px solid #e8e8e8; flex-direction: row;
    justify-content: space-around;
    align-items: center;">
          <el-form label-width="100px">
            <el-form-item label="过滤条件匹配:" style="margin-top: 5px;">
              <el-select size='default' v-model="localSearchParams.filterCondition" placeholder="请选择" style="width: 300px;">
                <el-option v-for="item in filterConditions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <div v-for="(condition, index) in localSearchParams.searchConditions" :key="index"
              style="display: flex; width: 700px;     flex-direction: row;   justify-content: space-between;">
              <el-select v-model="condition.searchField" size='default' placeholder="选择查询字段">
                <el-option v-for="item in tableheader" :key="item.label" :label="item.label"
                  :prop="item.prop"></el-option>
              </el-select>

              <el-select v-model="condition.condition" size='default' style="width: 90px;">
                <el-option v-for="item in conditions" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>

              <el-input v-model="condition.value" placeholder="请输入值" style="width: 240px;"
                size='default'></el-input>

              <div>
                <el-button @click="add" style="padding: 0 5px; height: 30px; ">&nbsp;<el-icon>
                    <Plus />
                  </el-icon></el-button>
                <el-button @click="remove(index)"
                  style="width: 25px; padding: 0 15px; height: 30px;">&nbsp;<el-icon>
                    <Minus />
                  </el-icon></el-button>
              </div>
            </div>
          </el-form>
          <div style="width: 150px;  border: 1px solid  #e8e8e8; margin-top: 10px;">
            <p style="border-bottom:1px solid #e8e8e8;">保存的查询</p>
            <div style="margin-top: 10px;"></div>
            <div class="saved-query-item" v-for="(savedQuery, index) in savedQueries" :key="index">
              <span style="height: 20px;" @click="loadSavedQuery(savedQuery)"><el-icon><Document /></el-icon>{{ savedQuery.name }}</span>
              <el-button link type="primary" @click="showDeleteConfirm(index)"><el-icon><CircleClose /></el-icon></el-button>
            </div>
          </div>
        </div>
        <template #footer>
          <div style="width: 100%; border-top:1px solid #e8e8e8;line-height: 50px; ">
            <span style="margin-right: 525px; margin-top: 5px;">
              <el-button @click="resetAdvancedSearch">重置</el-button>
              <el-button @click="showSaveDialog">保存查询条件</el-button>
            </span>
            <span class="dialog-footer">
              <el-button @click="advancedSearchVisible = false">取消</el-button>
              <el-button type="primary" @click="handleAdvancedSearch">查询</el-button>
            </span>
          </div>
        </template>
      </el-dialog>
      <!-- 保存查询条件对话框 -->
      <el-dialog v-model="saveDialogVisible" title="请输入保存的名称" width="30%">
        <el-input v-model="saveName" placeholder="" size='default'></el-input>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="saveDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveQuery">确 定</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 删除确认对话框 -->
      <el-dialog v-model="deleteConfirmVisible" width="30%">
        <span><el-icon><QuestionFilled /></el-icon>是否删除当前查询？</span>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="deleteConfirmVisible = false">取 消</el-button>
            <el-button type="primary" @click="deleteQuery">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { ArrowUp, ArrowDown, RefreshRight, Search, Filter, CaretTop, CaretBottom, Plus, Minus, CircleClose, Document, QuestionFilled } from '@element-plus/icons-vue'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

// 定义 props
const props = defineProps({
  tableheader: {
    type: Array,
    required: true
  },
  conditions: {
    type: Array,
    required: true
  },
  savedQueries: {
    type: Array,
    default: () => []
  }
});

// 定义事件
const emit = defineEmits(['search', 'reset', 'save-query', 'load-query', 'delete-query']);

// 搜索参数
const localSearchParams = ref({
  inputCode: '',
  inputName: '',
  customerCategory: '',
  customerLevel: '',
  taxScale: '',
  region: '',
  businessArea: '',
  isExpanded: false,
  searchConditions: [
    {
      searchField: '',
      condition: 'equal',
      value: ''
    }
  ],
  filterCondition: ''
});

const windowWidth = ref(window.innerWidth)
const advancedSearchVisible = ref(false)
const saveDialogVisible = ref(false)
const saveName = ref('')
const deleteConfirmVisible = ref(false)
const deleteIndex = ref(-1)

// 过滤条件选项
const filterConditions = ref([
  {
    label: "AND(所有条件都要求匹配)",
    value: "and"
  },
  {
    label: "OR(任一条件匹配即可)",
    value: "or"
  }
])

// 显示高级搜索
const showAdvancedSearch = () => {
  advancedSearchVisible.value = true
}

// 执行高级搜索
const handleAdvancedSearch = () => {
  emit('search', localSearchParams.value)
  advancedSearchVisible.value = false
}

// 监听窗口大小变化
const handleResize = () => {
  windowWidth.value = window.innerWidth
  if (windowWidth.value < 1080) {
    localSearchParams.value.isExpanded = false
  }
}

const checkScreenSize = () => {
  if (window.innerWidth < 1080) {
    localSearchParams.value.isExpanded = false
  }
}

// 组件卸载前移除事件监听
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

// 切换展开/收起
const toggleForm = () => {
  localSearchParams.value.isExpanded = !localSearchParams.value.isExpanded
}

// 执行普通搜索
const handleSearch = () => {
  emit('search', localSearchParams.value)
}

// 重置高级搜索
const resetAdvancedSearch = () => {
  localSearchParams.value.searchConditions = [
    {
      searchField: '',
      condition: 'equal',
      value: ''
    }
  ];
  localSearchParams.value.filterCondition = '';
}

// 重置表单
const handleReset = () => {
  localSearchParams.value.inputCode = ''
  localSearchParams.value.inputName = ''
  localSearchParams.value.customerCategory = ''
  localSearchParams.value.customerLevel = ''
  localSearchParams.value.taxScale = ''
  localSearchParams.value.region = ''
  localSearchParams.value.businessArea = ''
  localSearchParams.value.isExpanded = false
  localSearchParams.value.searchConditions = [
    {
      searchField: '',
      condition: 'equal',
      value: ''
    }
  ];
  localSearchParams.value.filterCondition = ''
  emit('reset')
}

// 添加搜索条件
const add = () => {
  localSearchParams.value.searchConditions.push({
    searchField: '',
    condition: 'equal',
    value: ''
  });
}

// 删除搜索条件
const remove = (index) => {
  if (localSearchParams.value.searchConditions.length > 1) {
    localSearchParams.value.searchConditions.splice(index, 1);
  }
}

// 显示保存对话框
const showSaveDialog = () => {
  saveDialogVisible.value = true;
}

// 保存查询
const saveQuery = () => {
  if (saveName.value) {
    const queryToSave = {
      name: saveName.value,
      conditions: JSON.parse(JSON.stringify(localSearchParams.value.searchConditions)),
      filterCondition: localSearchParams.value.filterCondition
    };
    emit('save-query', queryToSave);
    saveDialogVisible.value = false;
    saveName.value = '';
  }
}

// 加载保存的查询
const loadSavedQuery = (query) => {
  emit('load-query', query);
}

// 显示删除确认
const showDeleteConfirm = (index) => {
  deleteIndex.value = index;
  deleteConfirmVisible.value = true;
}

// 删除查询
const deleteQuery = () => {
  if (deleteIndex.value !== -1) {
    emit('delete-query', deleteIndex.value);
    deleteIndex.value = -1;
    deleteConfirmVisible.value = false;
  }
}

// 组件挂载时添加事件监听
onMounted(() => {
  window.addEventListener('resize', handleResize)
  checkScreenSize()
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.el-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

/* 在小屏幕上调整列数 */
@media (max-width: 1080px) {
  .el-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 748px) {
  .el-row {
    grid-template-columns: 1fr;
  }
}

.el-col {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

span {
  margin-right: 10px;
  width: 69px;
}

.el-button {
  height: 32px;
  padding: 0 20px;
}

.zhankai {
  margin-left: 10px;
}

.saved-query-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 20px;
  &:hover {
    background-color: #e6f6ff;
  }
}
</style>