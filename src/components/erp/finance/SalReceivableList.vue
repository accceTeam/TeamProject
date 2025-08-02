<!-- //表格组件 -->
<script setup>
import { defineProps, defineEmits } from 'vue';

// 接收父组件传递的参数
const props = defineProps({
	// 表格数据
	tableData: {
		type: Array,
		default: () => [],
	},
	// 表头数据
	tableHeader: {
		type: Array,
		default: () => [],
	},
});

// 定义向父组件传递的事件
//用于传递是降序还是升序
const emit = defineEmits(['sort-change']);
</script>

<template>
	
		<el-table
			:data="tableData"
			fit="false"
			border
			style="width: 100%"
			:cell-style="{ padding: '5px 0', 'text-align': 'center' }"
			:header-cell-style="{ background: '#fafafa', color: '#3a3a3a', 'font-weight': '400', 'text-align': 'center' }"
			@sort-change="({ column, prop, order }) => emit('sort-change', { column, prop, order })"
		>
			<!-- 列：多选框 -->
			<slot name="select" />
			<!-- 在父元素中写入调用
        <template #select>
          <el-table-column type="selection" width="50" />
        </template> -->

			<!-- 列：索引 -->
			<el-table-column type="index" label="#" width="50" fixed />
			<!-- 表头循环 -->
			<el-table-column
				v-for="item in tableHeader"
				:key="item.label"
				:prop="item.prop"
				:label="item.label"
				:width="
					item.label === '单据编号' || item.label === '单据日期' || item.label === '单据主题' || item.label === '源单号' || item.label === '客户'|| item.label === '编码'|| item.label === '名称'|| item.label === '助记名'
						? 160
						: item.label === '业务部门' ||
						  item.label === '业务员' ||
						  item.label === '已核销金额' ||
						  item.label === '单据阶段' ||
						  item.label === '自动单据' ||
						  item.label === '红字单据'|| item.label === '纳税规模'
						? 120
						: auto
				"
				:fixed="item.label === '单据编号' ? 'left' : item.label === '操作' ? 'right' : false"
				:sortable="
					item.label === '单据编号' ||
					item.label === '单据日期' ||
					item.label === '单据主题' ||
					item.label === '源单号' ||
					item.label === '业务部门' ||
					item.label === '业务员'
						? true
						: false
				"
			>
				<!-- 插槽支持：单据编号  编码 -->
				<template v-if="item.label === '单据编号'" #default="{ row }">
					<slot name="receiptNumber" :row="row" />
				</template>
				<template v-if="item.label === '编码'" #default="{ row }">
					<slot name="bianma" :row="row" />
				</template>
			</el-table-column>
		</el-table>

</template>


