<template>
    <div>
        <el-form :inline="true">
            <el-form-item
                v-for="item in inputConfigs"
                :key="item.prop"
                :label="item.label">

                 <!-- 如果需要插槽渲染，则渲染插槽 -->
                <template v-if="item.slotStatus">
                    <slot :name="item.prop" ></slot>
                </template>
                  <el-input  
                      
                    v-else    
                    :placeholder="item.placeholder"
                    v-model="inputForm[item.prop]"
                />
                
            </el-form-item>
            <el-form-item>
                <el-button :icon="Search" 
                           type="primary"
                           @click="handleSearch"
                           >查询</el-button>
                <el-button :icon="Refresh"
                           @click="handleReset"
                           >重置</el-button>
                <el-button 
                           type="primary"
                           :icon="Filter"
                           @click="advancedQuerybtn"
                           >高级查询</el-button>
                
            </el-form-item>
          
        </el-form>
        <advancedQuery
              v-model:dialogVisible="dialogVisible"
              @updateParentTable="updateParentTable"
              ></advancedQuery>
    </div>
</template>
<script setup>
import { ref,watch } from 'vue'
import { Refresh, Search,Filter } from '@element-plus/icons-vue'
import advancedQuery from './advancedQuery.vue'



const inputForm = ref({})
 // 定义 新增弹窗默认为false
const dialogVisible = ref(false)
// 定义向父组件发送数据  重置数据
const emit = defineEmits(['searchInputData','clearSearchData'])

// 子组件接受数据
// 接收配置项
const props = defineProps({
  inputConfigs: {
    type: Array,
    default: () => []
  }
})


// 搜索按钮  
const handleSearch=()=>{
    // // 执行查询操作
    console.log(inputForm.value,'文本框中的内容')
    // 通知父组件 父组件接收到
    emit('searchInputData',inputForm.value)
    // 清空数据
    clearData()
}
// 重置按钮
const handleReset=()=>{
    props.inputConfigs.forEach(config => {
    inputForm[config.prop] = ''
    })
    // 通知父组件 重置   这里没有传递数据，让父组件清空搜索的数据然后再请求一下就行
    emit('clearSearchData')
}

const clearData=()=>{
  const form = {}
  props.inputConfigs.forEach(config => {
    form[config.prop] = ''
  })
  inputForm.value = form
}

// 高级查询
const advancedQuerybtn=()=>{
  console.log('高级查询');
  dialogVisible.value = true
  
}

// 使用watch监听props.inputConfigs初始化字段
watch(
  () => props.inputConfigs,
  (newConfigs) => {
    const form = {}
    newConfigs.forEach(config => {
      // 只提交非插槽的字段,插槽的字段数值在父组件中得到
      if(!config.slotStatus){
         form[config.prop] = ''
      }
    })
    inputForm.value = form
  },
  { immediate: true } // 页面加载时立即执行
)



</script>
<style setup>

</style>