<script setup>
import { getTableData } from '../../../api/erp/finance/SalReceivableList.js';
import { ref, computed } from 'vue';
//表格组件
import SalReceivableList from '../../../components/erp/finance/SalReceivableList.vue';
// 自定义列组件
import CustomColumns from '../../../components/erp/finance/CustomColumns.vue';
// 分页器组件
import Paging from '../../../components/paging.vue';
// 引入图标
import {
	Download,
	ArrowUp,
	ArrowDown,
	RefreshRight,
	Search,
	Filter,
	CaretTop,
	CaretBottom,
	Plus,
	Minus,
	CircleClose,
	Document,
	QuestionFilled,
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

// 初始表头数据（用于显隐列功能）
const initialTableHeader = [
	{
		label: '单据编号',
		prop: 'billNo',
	},
	{
		label: '单据日期',
		prop: 'billDate',
	},
	{
		label: '单据主题',
		prop: 'subject',
	},
	{
		label: '源单号',
		prop: 'srcNo',
	},
	{
		label: '客户',
		prop: 'customerId_dictText',
	},
	{
		label: '业务部门',
		prop: 'opDept_dictText',
	},
	{
		label: '业务员',
		prop: 'operator_dictText',
	},
	{
		label: '金额',
		prop: 'amt',
	},
	{
		label: '已核销金额',
		prop: 'checkedAmt',
	},
	{
		label: '单据阶段',
		prop: 'billStage_dictText',
	},
	{
		label: '已生效',
		prop: 'isAuto_dictText',
	},
	{
		label: '已关闭',
		prop: 'isClosed_dictText',
	},
	{
		label: '已作废',
		prop: 'isVoided_dictText',
	},
	{
		label: '自动单据',
		prop: 'isEffective_dictText',
	},
	{
		label: '红字单据',
		prop: 'isRubric_dictText',
	},
	{
		label: '备注',
		prop: 'remark',
	},
];
// 当前表头数据
const tableHeader = ref(initialTableHeader);
// 动态计算实际显示的表头（用于显隐列功能）
const displayedTableHeader = computed(() => {
	return tableHeader.value.filter((item) => item.visible !== false);
});

// 存放表格数据
const tableData = ref([]);

// 分页参数
const pageParams = ref({
	page: 1, // 当前页码
	limit: 10, // 每页显示条数
	total: 0, // 总条数
});
// 排序参数
const sortParams = ref({
	column: 'createTime',
	order: 'desc',
});

// 调取表格数据接口
const getTableDataFun = async () => {
	try {
		let params = {
			_t: Date.now(),
			isVoided: 0,
			column: sortParams.value.column, //按照哪一列排序
			order: sortParams.value.order, //降序或升序
			field:
				'id,,,billNo,billDate,subject,srcNo,customerId_dictText,opDept_dictText,operator_dictText,amt,checkedAmt,billStage_dictText,isEffective_dictText,isClosed_dictText,isVoided_dictText,isAuto_dictText,isRubric_dictText,remark,effectiveTime,approver_dictText,createTime,createBy_dictText,sysOrgCode_dictText,updateTime,updateBy_dictText',
			pageNo: pageParams.value.page, // 当前页码
			pageSize: pageParams.value.limit, // 每页显示条数
		};
		const { code, message, result } = await getTableData(params);
		if (code === 200) {
			tableData.value = result.records;
			// 更新分页信息
			pageParams.value.total = result.total;
		} else {
			console.error('接口请求失败:', message);
		}
	} catch (error) {
		console.error('请求异常:', error);
	}
};
getTableDataFun();

// 获取组件中的排序
const handleSortChange = ({ column, prop, order }) => {
	console.log('排序字段:', prop);
	console.log('排序顺序:', order); // 'ascending' 或 'descending' 或 null

	// 更新排序参数
	if (prop) {
		// 将 Element Plus 的排序值转换为后端需要的值
		const orderMap = {
			ascending: 'asc',
			descending: 'desc',
		};
		// 如果 order 为 null，根据上次的排序顺序来决定新的排序顺序
		if (order === null) {
			// 假设默认为 ascending，你可以根据实际需求调整
			order = 'ascending';
		}

		sortParams.value.column = prop;
		sortParams.value.order = orderMap[order] || order;
	} else {
		// 如果没有排序，使用默认值
		sortParams.value.column = 'createTime';
		sortParams.value.order = 'desc';
	}
	// 重新获取数据
	getTableDataFun();
};

// 更新表头数据
const updateTableHeader = (newHeader) => {
	tableHeader.value = newHeader.map((item) => ({ ...item, visible: true }));
};

// 分业器
// 处理分页变化 - 页码变化
const handlePageChange = (newPage) => {
	console.log('页码变化，切换到第', newPage, '页');
	pageParams.value.page = newPage;
	getTableDataFun();
};
// 处理分页变化 - 每页条数变化
const handleSizeChange = (newSize) => {
	console.log('每页条数变化，每页显示', newSize, '条');
	pageParams.value.limit = newSize;
	pageParams.value.page = 1; // 重置到第一页
	getTableDataFun();
};
// 处理分页变化 - 统一处理函数（兼容旧版）
const handlePagination = ({ page, limit }) => {
	console.log('分页统一处理:', { page, limit });
	pageParams.value.page = page;
	pageParams.value.limit = limit;
	getTableDataFun();
};

// 导出功能
const handleExport = async () => {
	try {
		ElMessage.info('正在导出数据，请稍候...');

		// 构造导出参数（与获取表格数据的参数保持一致）
		const exportParams = {
			_t: Date.now(),
			isVoided: 0,
			column: sortParams.value.column,
			order: sortParams.value.order,
			field:
				'id,,,billNo,billDate,subject,srcNo,customerId_dictText,opDept_dictText,operator_dictText,amt,checkedAmt,billStage_dictText,isEffective_dictText,isClosed_dictText,isVoided_dictText,isAuto_dictText,isRubric_dictText,remark,effectiveTime,approver_dictText,createTime,createBy_dictText,sysOrgCode_dictText,updateTime,updateBy_dictText',
		};

		// 发起导出请求
		const response = await fetch('/api/erp/finance/sal-receivable/export', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			params: exportParams,
		});

		if (!response.ok) {
			throw new Error('导出请求失败');
		}

		// 获取响应数据
		const blob = await response.blob();
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = '应收款列表.xlsx'; // 设置导出文件名
		link.click();

		// 清理
		window.URL.revokeObjectURL(url);

		ElMessage.success('导出成功');
	} catch (error) {
		console.error('导出失败:', error);
		ElMessage.error('导出失败: ' + (error.message || '未知错误'));
	}
};
</script>

<template>
	<el-card style="width: 95%; margin: 2px">
		<el-row></el-row>
		<el-row>
			<el-col :span="22">
				<el-button type="primary" text @click="handleExport"
					><el-icon>
						<Download /> </el-icon
					>导出</el-button
				>
			</el-col>
			<el-col :span="2">
				<!-- 自定义列组件 -->
				<CustomColumns :tableHeader="initialTableHeader" @updateTableHeader="updateTableHeader"></CustomColumns>
			</el-col>
		</el-row>
		<!-- 表格组件 -->
		<SalReceivableList :tableHeader="displayedTableHeader" :tableData="tableData" @sort-change="handleSortChange">
			<!-- 列：单据编号  -->
			<template #receiptNumber="{ row }">
				<el-button type="primary" text size="large">{{ row.billNo }}</el-button>
			</template>
		</SalReceivableList>
		<Paging
			:total="pageParams.total"
			:page="pageParams.page"
			:limit="pageParams.limit"
			@page-change="handlePageChange"
			@size-change="handleSizeChange"
			@pagination="handlePagination"
		/>
	</el-card>
</template>

<style scoped>
</style>