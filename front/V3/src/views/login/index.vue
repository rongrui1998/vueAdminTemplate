<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus/es/components/message/index.mjs';
import { DASHBOARD_PATH } from '@/constants/route';
import { useAuthStore } from '@/store/modules/auth';
import { usePermissionStore } from '@/store/modules/permission';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const permissionStore = usePermissionStore();

const formRef = ref();
const loading = ref(false);
const formModel = reactive({
  username: 'admin',
  password: '123456',
});

const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};

async function handleLogin() {
  await formRef.value?.validate();
  loading.value = true;

  try {
    await authStore.login(formModel);
    await authStore.fetchUserInfo(true);
    permissionStore.routeLoaded = false;
    const redirect =
      typeof route.query.redirect === 'string' ? route.query.redirect : DASHBOARD_PATH;
    ElMessage.success('登录成功');
    router.replace(redirect);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="login-page">
    <el-card class="login-card" shadow="never">
      <div class="login-card__header">
        <h1>后台模板登录</h1>
        <p>基于 Vue 3 + Element Plus 的后台管理系统基础模板</p>
      </div>

      <el-alert type="info" :closable="false" show-icon>
        <div>Mock 账号：<code>admin / 123456</code>（完整权限）</div>
        <div>Mock 账号：<code>editor / 123456</code>（受限权限）</div>
      </el-alert>

      <el-form
        ref="formRef"
        :model="formModel"
        :rules="rules"
        label-position="top"
        @keyup.enter="handleLogin"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model="formModel.username" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formModel.password"
            type="password"
            show-password
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            class="login-card__submit"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background:
    linear-gradient(180deg, rgba(64, 158, 255, 0.12), transparent 50%), var(--app-bg-color);
}

.login-card {
  width: 420px;
  border-radius: 16px;
}

.login-card__header {
  margin-bottom: 24px;
}

.login-card__header h1 {
  margin: 0 0 8px;
  font-size: 28px;
}

.login-card__header p {
  margin: 0;
  color: var(--el-text-color-secondary);
}

.login-card__submit {
  width: 100%;
}
</style>
