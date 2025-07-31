<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { Setting } from '@element-plus/icons-vue';

const props = defineProps({
  tableHeader: {
    type: Array,
    default: () => [],
  },
});

// 在父中调用事件并传递表头列表即可使用
const emit = defineEmits(['updateTableHeader']);

const selectedColumns = ref(props.tableHeader.map(item => item.prop));

const handleConfirm = () => {
  const updatedHeader = props.tableHeader.filter(item => selectedColumns.value.includes(item.prop));
  emit('updateTableHeader', updatedHeader);
};

const handleCancel = () => {
  // 取消操作，恢复初始状态
  selectedColumns.value = props.tableHeader.map(item => item.prop);
};
</script>

<template>
  <el-popover
    placement="left-start"
    :width="400"
    trigger="click"
    title="自定义列"
  >
    <template #reference>
      <el-button type="primary" text :icon="Setting">自定义列</el-button>
    </template>
    <el-checkbox-group v-model="selectedColumns">
      <el-row :gutter="20">
        <el-col :span="12" v-for="item in tableHeader" :key="item.label">
          <el-checkbox :label="item.prop">{{ item.label }}</el-checkbox>
        </el-col>
      </el-row>
    </el-checkbox-group>
    <div style="text-align: right; margin: 0">
      <el-button size="mini" @click="handleCancel">取消</el-button>
      <el-button type="primary" size="mini" @click="handleConfirm">确定</el-button>
    </div>
  </el-popover>
</template>

<style scoped>
.el-button--primary {
  font-weight: 400;
}
</style>