<!-- BasCustomerList.vue -->
<template>
	6
	<el-card style="width: 95%; margin: 2px">
		<div class="top">
			<Mytable :tableheader="tableHeader" :conditions="conditions" :saved-queries="savedQueries"
				@search="handleSearch" @reset="handleReset" @save-query="handleSaveQuery" @load-query="handleLoadQuery"
				@delete-query="handleDeleteQuery" />
		</div>
		<div class="bottom">
			<el-row>
				<el-col :span="22"></el-col>
				<el-col :span="2">
					<!-- 自定义列组件 -->
					<CustomColumns :tableHeader="initialTableHeader" @updateTableHeader="updateTableHeader">
					</CustomColumns>
				</el-col>
			</el-row>
			<!-- 表格组件 -->

			<SalReceivableList :tableHeader="displayedTableHeader" :tableData="tableData"
				@sort-change="handleSortChange">

				<template #select>
					<el-table-column type="selection" width="50" />
				</template>
				<!-- 列：编码  -->

				<template #bianma="{ row }">
					<el-button type="primary" text size="large">{{ row.code }}</el-button>
				</template>
			</SalReceivableList>
			<Paging :total="pageParams.total" :page="pageParams.page" :limit="pageParams.limit"
				@page-change="handlePageChange" @size-change="handleSizeChange" @pagination="handlePagination" />
		</div>
	</el-card>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import Mytable from '/@/components/Mytable/Mytable.vue';
import { getTableData } from '../../../api/erp/base/Bascust';
//表格组件
import SalReceivableList from '../../../components/erp/finance/SalReceivableList.vue';
// 自定义列组件
import CustomColumns from '../../../components/erp/finance/CustomColumns.vue';
// 分页器组件
import Paging from '../../../components/paging.vue';

// 初始表头数据（用于显隐列功能）
const initialTableHeader = [
	{
		label: '编码',
		prop: 'code',
	},
	{
		label: '名称',
		prop: 'name',
	},
	{
		label: '助记名',
		prop: 'auxName',
	},
	{
		label: '分类',
		prop: 'area',
	},
	{
		label: '等级',
		prop: 'customerLevel_dictText',
	},
	{
		label: '纳税规模',
		prop: 'taxScale_dictText',
	},
	{
		label: '欠款额度',
		prop: 'invoiceBankCode',
	},
	{
		label: '所属总公司',
		prop: 'invoiceCompany',
	},
	{
		label: '所属地区',
		prop: 'recvAddress',
	},
	{
		label: '业务区域',
		prop: 'billStage_dictText',
	},
	{
		label: '客户地址',
		prop: 'isAuto_dictText',
	},
	{
		label: '客户网站',
		prop: 'isClosed_dictText',
	},
	{
		label: '启用',
		prop: 'isEnabled_dictText',
	},
	{
		label: '备注',
		prop: 'remark',
	},
	{
		label: '创建人',
		prop: 'createBy_dictText',
	},
	{
		label: '修改时间',
		prop: 'updateTime',
	},
	{
		label: '修改人',
		prop: 'updateBy_dictText',
	},
	{
		label: '操作',

	}


];
// 当前表头数据
const tableHeader = ref(initialTableHeader);
// 动态计算实际显示的表头（用于显隐列功能）
const displayedTableHeader = computed(() => {
	return tableHeader.value.filter((item) => item.visible !== false);
});

// 存放表格数据
const tableData = ref([]);

// 存放搜索参数
const searchParams = ref({});
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
				'id,,,code,name,auxName,area,customerLevel_dictText,taxScale_dictText,invoiceBankCode,invoiceCompany,recvAddress,billStage_dictText,createBy_dictText,isClosed_dictText,isEnabled_dictText,isAuto_dictText,updateTime,remark,effectiveTime,updateBy_dictText_dictText,createTime,createBy_dictText,sysOrgCode_dictText,updateTime,createBy_dictText',
			pageNo: pageParams.value.page, // 当前页码
			pageSize: pageParams.value.limit, // 每页显示条数
		};

		// 添加搜索参数
		const fieldMapping = {
			'inputCode': 'code',
			'inputName': 'name',
			'customerCategory': 'area',
			'customerLevel': 'customerLevel',
			'taxScale': 'taxScale'
		};

		for (const key in searchParams.value) {
			if (searchParams.value[key]) {
				if (fieldMapping[key]) {
					params[fieldMapping[key]] = searchParams.value[key];
				} else if (key === 'region' && searchParams.value[key].length > 0) {
					params.recvAddress = searchParams.value[key][searchParams.value[key].length - 1];
				} else if (key === 'businessArea' && searchParams.value[key].length > 0) {
					params.billStage = searchParams.value[key][searchParams.value[key].length - 1];
				}
			}
		}

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

// 条件选项
const conditions = ref([
	{ label: '等于', value: 'equal' },
	{ label: '包含', value: 'contains' },
	{ label: '以..开始', value: 'startsWith' },
	{ label: '以..结尾', value: 'endsWith' },
	{ label: '在...中', value: 'in' },
	{ label: '不等于', value: 'notEqual' },
	{ label: '大于', value: 'greaterThan' },
	{ label: '大于等于', value: 'greaterThanOrEqual' },
	{ label: '小于', value: 'lessthan' },
	{ label: '小于等于', value: 'lessthanOrEqual' }
]);

// 保存的查询条件
const savedQueries = ref([]);
// 监听 savedQueries 变化，并保存到 localStorage
watch(savedQueries, (newVal) => {
	localStorage.setItem('savedQueries', JSON.stringify(newVal));
}, { deep: true });
// 处理搜索事件
const handleSearch = (params) => {
	console.log('执行搜索:', params);
	// 在这里调用接口获取数据
	// 保存搜索参数
	searchParams.value = params;
	// 重置页码到第一页
	pageParams.value.page = 1;
	// 重新获取数据
	getTableDataFun();
};

// 处理重置事件
const handleReset = () => {
	// 重置逻辑可以在子组件中处理
	// 清空搜索参数
	searchParams.value = {
		inputCode: '',
		inputName: '',
		customerCategory: '',
		customerLevel: '',
		taxScale: '',
		region: [],
		businessArea: []
	};
	// 重置页码到第一页
	pageParams.value.page = 1;
	// 重新获取数据
	getTableDataFun();
};

// 处理保存查询
const handleSaveQuery = (query) => {
	savedQueries.value.push(query);
};

// 处理加载查询
const handleLoadQuery = (query) => {
	// 加载查询逻辑可以在子组件中处理
	console.log('加载查询:', query);
	// 更新 localSearchParams.value
	localSearchParams.value.searchConditions = query.conditions || [];
	localSearchParams.value.filterCondition = query.filterCondition || 'and';
};

// 处理删除查询
const handleDeleteQuery = (index) => {
	savedQueries.value.splice(index, 1);
};

// 组件挂载时加载保存的查询
onMounted(() => {
	const storedQueries = localStorage.getItem('savedQueries');
	if (storedQueries) {
		savedQueries.value = JSON.parse(storedQueries);
	}
});
</script>

<style>
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
</style>