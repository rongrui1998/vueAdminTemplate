<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus/es/components/message/index.mjs';
import { DASHBOARD_PATH } from '@/constants/route';
import { useAuthStore } from '@/store/modules/auth';
import { usePermissionStore } from '@/store/modules/permission';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const permissionStore = usePermissionStore();
const { t } = useI18n();

const formRef = ref();
const loading = ref(false);
const formModel = reactive({
  username: 'admin',
  password: '123456',
});

async function handleLogin() {
  await formRef.value?.validate();
  loading.value = true;

  try {
    await authStore.login(formModel);
    await authStore.fetchUserInfo(true);
    permissionStore.resetPermissionState(router);
    const redirect =
      typeof route.query.redirect === 'string' ? route.query.redirect : DASHBOARD_PATH;
    ElMessage.success(t('login.success'));
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
        <h1>{{ t('login.title') }}</h1>
        <p>{{ t('login.subtitle') }}</p>
      </div>

      <el-alert type="info" :closable="false" show-icon>
        <div>
          {{ t('login.mockAccount') }}：<code>admin / 123456</code>（{{ t('login.fullAccess') }}）
        </div>
        <div>
          {{ t('login.mockAccount') }}：<code>editor / 123456</code>（{{
            t('login.limitedAccess')
          }}）
        </div>
      </el-alert>

      <el-form
        ref="formRef"
        :model="formModel"
        :rules="{
          username: [
            { required: true, message: t('login.validation.usernameRequired'), trigger: 'blur' },
          ],
          password: [
            { required: true, message: t('login.validation.passwordRequired'), trigger: 'blur' },
          ],
        }"
        label-position="top"
        @keyup.enter="handleLogin"
      >
        <el-form-item :label="t('login.username')" prop="username">
          <el-input v-model="formModel.username" :placeholder="t('login.usernamePlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('login.password')" prop="password">
          <el-input
            v-model="formModel.password"
            type="password"
            show-password
            :placeholder="t('login.passwordPlaceholder')"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            class="login-card__submit"
            @click="handleLogin"
          >
            {{ t('login.submit') }}
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
