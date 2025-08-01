<template>
    <div>
        <el-table 
                :data="tableData" 
                style="width: 100%;height: 600px;"
                @selection-change="handleSelectionChange"
                @row-click="handleRadioChange"
                highlight-current-row
                @sort-change="handleSortChange"
                border
                 >
            <!--前置 radio -->
            <el-table-column
                v-if="isRadio"
                width="55"
                align="center"
                >
                <template #default="scope">
                    <el-radio
                        :model-value="selectRow"
                        :label="scope.row"
                        @change="handleRadioChange(scope.row)">
                        &nbsp;  
                    </el-radio>
                </template>
            </el-table-column>

            <!-- 复选框 -->
            <el-table-column 
                v-if="!isRadio"
                type="selection" 
                width="55" >
            </el-table-column>
            <el-table-column
                label="#"
                type="index"
                width="55"
                :fixed="true"
                >
            </el-table-column>

                             <!-- :selectable="selectable" -->             
            <el-table-column v-for="item in tableSetting" 
                             :type="item.type"
                             :fixed="item.isFixed"
                             :sortable="item.isSortTable"
                             :key="item.label" 
                             :prop="item.prop" 
                             :label="item.label"
                             :width="item.width">
                <template #default="scope" v-if="item.slotStatus">
                    <slot :name="item.prop" :scoped="scope.row"></slot>
                </template>

            </el-table-column>      
        </el-table>
        <!-- 分页器 -->
         <div class="pagination-div">
            <el-pagination
                :page-sizes="[5, 10, 20, 50]"
                 background
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableTotal"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="pageSize"
            />
         </div>
    </div>
</template>
<script setup>
import { ref,computed} from 'vue';

     let currentPage = ref(1)
     let pageSize = ref(10)
    //  定义要删除的数组
    let deleteArr = ref([]);
    // 接收表格数据
    const props = defineProps({
        tableData: {
            type: Array,
            default:()=> []
        },
        tableTotal:{
            type: Number,
            default:0
        },
        // 表头数据
        tableSetting:{
            type: Array,
            default:()=> []
        }
    })

    // 分页器相关
    const emit = defineEmits(['updateSize','updateCurrentPage','updateSort'])
    const handleSizeChange = (val) => {
        console.log(`${val} items per page`)
         pageSize.value = val
        // 父组件更新数据
        emit('updateSize',val)
    }
    const handleCurrentChange = (val) => {
        console.log(`current page: ${val}`)
        currentPage.value = val
        emit('updateCurrentPage',val)
    }

    // 复选框  选中项 发生变化时，获取选中行
    const handleSelectionChange=(val)=>{
        // 这里需要判断，如果数据中标题：物料编码，则执行下面这句，
        // 如果为单位编码，则执行measureId
        if(props.tableSetting[0].prop === 'itemCode'){
            deleteArr.value = val.map(item=>item.itemId)
        }
        // 这里可以继续添加表头
        console.log(deleteArr.value,'要删除的数组');

        // deleteArr.value = val.map(item=>item.itemId)
        // console.log(deleteArr.value,'要删除的数组');

    }

    // 排序
    const handleSortChange=({prop,order})=>{
        //order:'ascending' |  'descending' | null
        let sortOrder = order === 'ascending' ? 'asc' : 'desc'
        console.log('您点击了'+prop+','+sortOrder);
        
        emit('updateSort',{column:prop,order:sortOrder})
    }



    // radio
    const selectRow = ref(null)
    const isRadio = computed(() => {
        return props.tableSetting.some(item=>item.radio == true)
    })
    const handleRadioChange = (row) => {
        selectRow.value = row
        deleteArr.value = [getRowId(row)]
        console.log(deleteArr.value,'选中的数据');
    }
    const getRowId = (row) => {
        if(props.tableSetting[0].prop === 'itemCode') return row.itemId
       
        return null
    }



    // 将要删除的id暴露给父组件
    defineExpose({
        deleteArr
    })

</script>
<style scoped>
    .pagination-div{
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
</style>