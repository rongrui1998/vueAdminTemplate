import { createApp } from 'vue';
import 'element-plus/theme-chalk/el-message-box.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import 'nprogress/nprogress.css';
import App from './App.vue';
import { permissionDirective } from './directives/permission';
import router from './router';
import { setupRouterGuards } from './router/guards';
import { setupElementPlus } from './plugins/element-plus';
import { pinia } from './store';
import { useAppStore } from './store/modules/app';
import './styles/index.scss';

const app = createApp(App);

app.use(pinia);
app.directive('permission', permissionDirective);

const appStore = useAppStore();
appStore.initializeSettings();
window.addEventListener('resize', () => {
  appStore.syncSidebarWithViewport(window.innerWidth);
});

setupElementPlus(app);
setupRouterGuards(router);
app.use(router);
app.mount('#app');
