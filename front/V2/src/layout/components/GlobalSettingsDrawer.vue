<script setup lang="ts">
import { computed } from 'vue';
import { Setting } from '@element-plus/icons-vue';
import { LAYOUT_DENSITY, THEME_MODE, type LayoutDensity, type ThemeMode } from '@/constants/app';
import { useAppStore } from '@/store/modules/app';

const appStore = useAppStore();
const drawerVisible = computed({
  get: () => appStore.settingsDrawerVisible,
  set: (value: boolean) => appStore.setSettingsDrawerVisible(value),
});

function openDrawer() {
  appStore.openSettingsDrawer();
}

function updateThemeMode(value: string | number | boolean | undefined) {
  appStore.setThemeMode(value as ThemeMode);
}

function updateLayoutDensity(value: string | number | boolean | undefined) {
  appStore.setLayoutDensity(value as LayoutDensity);
}

function updateTagViewsVisible(value: string | number | boolean) {
  appStore.setTagViewsVisible(Boolean(value));
}

function updateKeepAliveEnabled(value: string | number | boolean) {
  appStore.setKeepAliveEnabled(Boolean(value));
}
</script>

<template>
  <button
    type="button"
    class="global-settings-trigger"
    aria-label="打开界面设置"
    @click="openDrawer"
  >
    <el-icon><Setting /></el-icon>
  </button>

  <el-drawer v-model="drawerVisible" title="界面设置" size="360px" append-to-body>
    <div class="global-settings">
      <section class="global-settings__intro">
        <p>Local Preferences</p>
        <h3>常用界面偏好</h3>
        <span>这些配置保存在本地浏览器中，适合模板演示和个人偏好。</span>
      </section>

      <el-form label-position="top" class="global-settings__form">
        <el-form-item label="主题模式">
          <el-radio-group :model-value="appStore.themeMode" @update:model-value="updateThemeMode">
            <el-radio-button :value="THEME_MODE.light">浅色</el-radio-button>
            <el-radio-button :value="THEME_MODE.dark">深色</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="布局密度">
          <el-radio-group
            :model-value="appStore.layoutDensity"
            @update:model-value="updateLayoutDensity"
          >
            <el-radio-button :value="LAYOUT_DENSITY.comfortable">舒适</el-radio-button>
            <el-radio-button :value="LAYOUT_DENSITY.compact">紧凑</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="标签栏显示">
          <el-switch
            :model-value="appStore.tagViewsVisible"
            active-text="显示"
            inactive-text="隐藏"
            @update:model-value="updateTagViewsVisible"
          />
        </el-form-item>

        <el-form-item label="页面缓存">
          <el-switch
            :model-value="appStore.keepAliveEnabled"
            active-text="启用"
            inactive-text="关闭"
            @update:model-value="updateKeepAliveEnabled"
          />
        </el-form-item>
      </el-form>

      <div class="global-settings__summary">
        <div>
          <span>当前密度</span>
          <strong>{{ appStore.layoutDensity === LAYOUT_DENSITY.compact ? '紧凑' : '舒适' }}</strong>
        </div>
        <div>
          <span>标签栏</span>
          <strong>{{ appStore.tagViewsVisible ? '显示' : '隐藏' }}</strong>
        </div>
        <div>
          <span>页面缓存</span>
          <strong>{{ appStore.keepAliveEnabled ? '启用' : '关闭' }}</strong>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<style scoped>
.global-settings-trigger {
  position: fixed;
  top: 42%;
  right: 0;
  z-index: 3000;
  width: 44px;
  height: 48px;
  display: grid;
  place-items: center;
  cursor: pointer;
  color: #fff;
  border: 0;
  border-radius: 14px 0 0 14px;
  background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-success));
  box-shadow: 0 12px 28px rgb(15 23 42 / 0.18);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.global-settings-trigger:hover {
  transform: translateX(-3px);
  box-shadow: 0 16px 34px rgb(15 23 42 / 0.24);
}

.global-settings {
  display: grid;
  gap: 18px;
}

.global-settings__intro {
  padding: 18px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 16px;
  background:
    radial-gradient(circle at top right, rgb(64 158 255 / 0.16), transparent 36%),
    var(--el-fill-color-lighter);
}

.global-settings__intro p {
  margin: 0 0 6px;
  color: var(--el-color-primary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.global-settings__intro h3 {
  margin: 0 0 8px;
  font-size: 20px;
}

.global-settings__intro span {
  color: var(--el-text-color-secondary);
  line-height: 1.7;
}

.global-settings__form {
  padding-top: 4px;
}

.global-settings__summary {
  display: grid;
  gap: 8px;
  padding: 14px;
  border-radius: 14px;
  background: var(--el-fill-color-light);
}

.global-settings__summary div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.global-settings__summary span {
  color: var(--el-text-color-secondary);
}
</style>
