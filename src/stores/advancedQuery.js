import { defineStore } from "pinia";
import { ref } from 'vue'

export const useAdvancedQueryStore = defineStore('advancedQuery',()=>{
    const advancedQueryParams = ref({})
    function setAdvancedQueryParams(params){
        advancedQueryParams.value = params
    }
    return { advancedQueryParams,setAdvancedQueryParams }
})