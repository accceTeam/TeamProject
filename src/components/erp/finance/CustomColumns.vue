<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { Setting } from '@element-plus/icons-vue';

const props = defineProps({
  tableHeader: {
    type: Array,
    default: () => [],
  },
});

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
  <el-popconfirm
    title="自定义列"
    confirm-button-text="确定"
    cancel-button-text="取消"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <template #reference>
      <el-button type="primary" text :icon="Setting">自定义列</el-button>
    </template>
    <el-checkbox-group v-model="selectedColumns">
      <el-row :gutter="20">
        <el-col :span="12" v-for="item in tableHeader" :key="item.prop">
          <el-checkbox :label="item.prop">{{ item.label }}</el-checkbox>
        </el-col>
      </el-row>
    </el-checkbox-group>
  </el-popconfirm>
</template>

<style scoped>
.el-button--primary {
  font-weight: 400;
}
</style>