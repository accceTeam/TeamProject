import { createApp } from 'vue';
import pinia from '/@/stores/index';
import App from '/@/App.vue';
import router from '/@/router';
import { directive } from '/@/directive/index';
import other from '/@/utils/other';

import Antd from 'ant-design-vue';// 引入 Ant Design Vue
// import 'ant-design-vue/dist/antd.css';// 引入 Ant Design Vue 样式

import ElementPlus from 'element-plus';
import '/@/theme/index.scss';
import Antd from 'ant-design-vue';// 引入 Ant Design Vue
const app = createApp(App);

directive(app);
other.elSvg(app);
// 注册 Ant Design Vue：    app.use(Antd);

app.use(pinia).use(router).use(ElementPlus).use(Antd).mount('#app');
// app.use(pinia).use(router).use(ElementPlus).use(Antd).mount('#app');
