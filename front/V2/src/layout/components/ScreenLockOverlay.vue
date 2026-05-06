<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import type { UserInfo } from '@/types/user';

const props = defineProps<{
  visible: boolean;
  userInfo: UserInfo;
  lockPassword: string;
}>();

const emit = defineEmits<{
  unlock: [];
  cancel: [];
  logout: [];
  savePassword: [password: string];
}>();

const timeText = ref('');
const dateText = ref('');
const unlocking = ref(false);
const stage = ref<'setup' | 'landing' | 'unlock'>('landing');
const setupForm = reactive({
  password: '',
});
const unlockForm = reactive({
  password: '',
});
let timer: number | undefined;
const { t, locale } = useI18n();

const displayName = computed(
  () => props.userInfo.nickname || props.userInfo.username || t('screenLock.defaultUser'),
);
const displayAvatarText = computed(
  () => displayName.value.slice(0, 1) || t('screenLock.defaultUser').slice(0, 1),
);
const hasLockPassword = computed(() => Boolean(props.lockPassword));

function formatClock(date: Date) {
  return date.toLocaleTimeString(locale.value, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function formatCalendar(date: Date) {
  return date.toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
}

function updateClock() {
  const now = new Date();
  timeText.value = formatClock(now);
  dateText.value = formatCalendar(now);
}

function startClock() {
  stopClock();
  updateClock();
  timer = window.setInterval(updateClock, 1000);
}

function stopClock() {
  if (timer) {
    window.clearInterval(timer);
    timer = undefined;
  }
}

function resetForms() {
  setupForm.password = '';
  unlockForm.password = '';
  unlocking.value = false;
}

function syncStage() {
  stage.value = hasLockPassword.value ? 'landing' : 'setup';
}

function openUnlockForm() {
  stage.value = 'unlock';
  unlockForm.password = '';
}

function backToLanding() {
  stage.value = 'landing';
  unlockForm.password = '';
}

function handleSavePassword() {
  if (!setupForm.password) {
    ElMessage.warning(t('screenLock.message.passwordRequired'));
    return;
  }

  if (setupForm.password.length < 4) {
    ElMessage.warning(t('screenLock.message.passwordMinLength'));
    return;
  }

  emit('savePassword', setupForm.password);
  resetForms();
  stage.value = 'landing';
}

async function handleUnlock() {
  if (!unlockForm.password) {
    ElMessage.warning(t('screenLock.message.unlockPasswordRequired'));
    return;
  }

  unlocking.value = true;

  try {
    if (unlockForm.password !== props.lockPassword) {
      throw new Error(t('screenLock.message.unlockPasswordWrong'));
    }

    unlockForm.password = '';
    stage.value = 'landing';
    emit('unlock');
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : t('screenLock.message.unlockFailed'));
  } finally {
    unlocking.value = false;
  }
}

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      resetForms();
      syncStage();
      startClock();
      return;
    }

    stopClock();
    resetForms();
    syncStage();
  },
  { immediate: true },
);

watch(
  () => props.lockPassword,
  () => {
    if (props.visible) {
      syncStage();
    }
  },
);

onMounted(() => {
  if (props.visible) {
    startClock();
  }
});

onBeforeUnmount(() => {
  stopClock();
});
</script>

<template>
  <div v-if="visible" class="screen-lock" data-test="screen-lock-overlay">
    <div class="screen-lock__backdrop"></div>

    <div v-if="stage === 'landing'" class="screen-lock__landing">
      <p class="screen-lock__date">{{ dateText }}</p>
      <strong class="screen-lock__time">{{ timeText }}</strong>
      <button
        type="button"
        class="screen-lock__trigger"
        data-test="screen-lock-trigger"
        @click="openUnlockForm"
      >
        {{ t('screenLock.clickToUnlock') }}
      </button>
    </div>

    <div v-else class="screen-lock__panel">
      <div class="screen-lock__avatar-wrap">
        <el-avatar v-if="userInfo.avatar" :size="72" :src="userInfo.avatar" />
        <el-avatar v-else :size="72">{{ displayAvatarText }}</el-avatar>
      </div>

      <div class="screen-lock__identity">
        <strong>{{ displayName }}</strong>
      </div>

      <template v-if="stage === 'setup'">
        <el-input
          v-model="setupForm.password"
          type="password"
          show-password
          :placeholder="t('screenLock.setupPlaceholder')"
          data-test="screen-lock-password-setup"
          @keyup.enter="handleSavePassword"
        />
        <el-button
          type="primary"
          class="screen-lock__submit"
          data-test="screen-lock-password-save"
          @click="handleSavePassword"
        >
          {{ t('screenLock.setupSubmit') }}
        </el-button>
      </template>

      <template v-else>
        <el-input
          v-model="unlockForm.password"
          type="password"
          show-password
          :placeholder="t('screenLock.unlockPlaceholder')"
          data-test="screen-lock-password"
          @keyup.enter="handleUnlock"
        />

        <el-button
          type="primary"
          :loading="unlocking"
          class="screen-lock__submit"
          data-test="screen-lock-submit"
          @click="handleUnlock"
        >
          {{ t('screenLock.unlockSubmit') }}
        </el-button>
      </template>

      <div class="screen-lock__actions">
        <button
          v-if="stage === 'setup'"
          type="button"
          class="screen-lock__secondary"
          data-test="screen-lock-cancel"
          @click="emit('cancel')"
        >
          {{ t('screenLock.back') }}
        </button>
        <button
          v-if="stage === 'unlock'"
          type="button"
          class="screen-lock__secondary"
          data-test="screen-lock-back"
          @click="backToLanding"
        >
          {{ t('screenLock.backToLanding') }}
        </button>
        <button
          type="button"
          class="screen-lock__secondary"
          data-test="screen-lock-logout"
          @click="emit('logout')"
        >
          {{ t('screenLock.logout') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.screen-lock {
  position: fixed;
  inset: 0;
  z-index: 4000;
  overflow: hidden;
  color: #fff;
  background:
    radial-gradient(circle at top, rgb(58 112 255 / 0.24), transparent 36%),
    linear-gradient(160deg, #0f172a 0%, #111827 42%, #09090b 100%);
}

.screen-lock__backdrop {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.03), transparent 38%), rgb(15 23 42 / 0.22);
  backdrop-filter: blur(6px);
}

.screen-lock__landing,
.screen-lock__panel {
  position: relative;
  z-index: 1;
}

.screen-lock__landing {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  text-align: center;
}

.screen-lock__date {
  margin: 0 0 16px;
  color: rgb(226 232 240 / 0.78);
  font-size: 18px;
  line-height: 1.5;
}

.screen-lock__time {
  margin-bottom: 28px;
  font-size: clamp(68px, 10vw, 112px);
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0;
}

.screen-lock__trigger {
  min-width: 132px;
  min-height: 42px;
  padding: 0 20px;
  border: 1px solid rgb(255 255 255 / 0.14);
  border-radius: 999px;
  color: #fff;
  background: rgb(255 255 255 / 0.06);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.screen-lock__trigger:hover {
  background: rgb(255 255 255 / 0.1);
  border-color: rgb(255 255 255 / 0.2);
  transform: translateY(-1px);
}

.screen-lock__panel {
  width: min(calc(100% - 32px), 360px);
  margin: min(18vh, 160px) auto 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
  padding: 28px 24px 24px;
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: 20px;
  background: rgb(15 23 42 / 0.72);
  box-shadow: 0 24px 60px rgb(15 23 42 / 0.32);
  backdrop-filter: blur(16px);
}

.screen-lock__avatar-wrap {
  display: flex;
  justify-content: center;
}

.screen-lock__identity {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: center;
}

.screen-lock__identity strong {
  font-size: 24px;
  line-height: 1.2;
}

.screen-lock__identity span {
  color: rgb(226 232 240 / 0.72);
  font-size: 14px;
  line-height: 1.6;
}

.screen-lock__submit {
  width: 100%;
  min-height: 42px;
}

.screen-lock__actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.screen-lock__secondary {
  padding: 0;
  border: 0;
  color: rgb(226 232 240 / 0.72);
  background: transparent;
  font-size: 13px;
  cursor: pointer;
}

.screen-lock__secondary:hover {
  color: #fff;
}

@media (width <= 640px) {
  .screen-lock__panel {
    margin-top: 20vh;
    padding: 24px 20px 20px;
  }

  .screen-lock__actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>
