<!-- BasCustomerList.vue -->
<template>
    <el-card style="width: 95%; margin: 2px">
  <div class="top">
    6666
    <Mytable 
      :tableheader="tableHeader"
      :conditions="conditions"
      :saved-queries="savedQueries"
      @search="handleSearch"
      @reset="handleReset"
      @save-query="handleSaveQuery"
      @load-query="handleLoadQuery"
      @delete-query="handleDeleteQuery"
    />
  </div>
  <div class="bottom">
    <el-row>
			<el-col :span="22"></el-col>
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
  </div>
  </el-card>
</template>

<script setup>
import { ref,  computed, onMounted ,watch} from 'vue';
import Mytable from '/@/components/Mytable/Mytable.vue';
import { getTableData } from '../../../api/erp/finance/SalReceivableList.js';
//表格组件
import SalReceivableList from '../../../components/erp/finance/SalReceivableList.vue';
// 自定义列组件
import CustomColumns from '../../../components/erp/finance/CustomColumns.vue';
// 分页器组件
import Paging from '../../../components/paging.vue';
// 搜索字段选项
const searchFields = ref([
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
]);
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
};

// 处理重置事件
const handleReset = () => {
  // 重置逻辑可以在子组件中处理
};

// 处理保存查询
const handleSaveQuery = (query) => {
  savedQueries.value.push(query);
};

// 处理加载查询
const handleLoadQuery = (query) => {
  // 加载查询逻辑可以在子组件中处理
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