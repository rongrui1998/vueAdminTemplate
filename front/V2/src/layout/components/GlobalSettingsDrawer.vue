<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Close, Moon, Setting, Sunny, Warning } from '@element-plus/icons-vue';
import {
  CONTENT_WIDTH_MODE,
  LAYOUT_MODE,
  PAGE_TRANSITION_ANIMATION,
  THEME_MODE,
  THEME_PRESETS,
  type ContentWidthMode,
  type LayoutMode,
  type PageTransitionAnimationName,
  type ThemeMode,
  type ThemePreset,
} from '@/constants/app';
import { useAppStore } from '@/store/modules/app';

const appStore = useAppStore();
const { t } = useI18n();
const activeTab = ref('appearance');
const themeModeOptions = [
  { value: THEME_MODE.light, labelKey: 'settings.appearance.light', icon: Sunny },
  { value: THEME_MODE.dark, labelKey: 'settings.appearance.dark', icon: Moon },
];
const themePresetOptions = computed(() =>
  Object.entries(THEME_PRESETS).map(([value, preset]) => ({
    value: value as ThemePreset,
    ...preset,
    label: t(`settings.appearance.presets.${value}`),
  })),
);
const layoutModeOptions = [
  { value: LAYOUT_MODE.vertical, labelKey: 'settings.layout.vertical', supported: true },
  { value: LAYOUT_MODE.horizontal, labelKey: 'settings.layout.horizontal', supported: true },
  { value: LAYOUT_MODE.sidebar, labelKey: 'settings.layout.sidebar', supported: true },
  { value: LAYOUT_MODE.fullContent, labelKey: 'settings.layout.fullContent', supported: true },
];
const contentWidthOptions = [
  { value: CONTENT_WIDTH_MODE.fluid, labelKey: 'settings.layout.fluid' },
  { value: CONTENT_WIDTH_MODE.fixed, labelKey: 'settings.layout.fixed' },
];
const pageTransitionAnimationOptions = [
  { value: PAGE_TRANSITION_ANIMATION.fade, labelKey: 'settings.common.fade' },
  { value: PAGE_TRANSITION_ANIMATION.fadeSlideUp, labelKey: 'settings.common.fadeSlideUp' },
  {
    value: PAGE_TRANSITION_ANIMATION.fadeSlideRight,
    labelKey: 'settings.common.fadeSlideRight',
  },
  { value: PAGE_TRANSITION_ANIMATION.zoomFade, labelKey: 'settings.common.zoomFade' },
];
const tabs = computed(() => [
  { key: 'appearance', label: t('settings.tabs.appearance') },
  { key: 'layout', label: t('settings.tabs.layout') },
  { key: 'shortcut', label: t('settings.tabs.shortcut') },
  { key: 'common', label: t('settings.tabs.common') },
]);
const shortcutOptions = computed(() => [
  {
    keys: 'Ctrl / ⌥ + ,',
    title: t('settings.shortcut.openSettings.title'),
    description: t('settings.shortcut.openSettings.description'),
  },
  {
    keys: 'Ctrl / ⌥ + Q',
    title: t('settings.shortcut.logout.title'),
    description: t('settings.shortcut.logout.description'),
  },
  {
    keys: 'Ctrl / ⌥ + L',
    title: t('settings.shortcut.lockScreen.title'),
    description: t('settings.shortcut.lockScreen.description'),
  },
]);
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

function updateThemePreset(value: ThemePreset) {
  appStore.setThemePreset(value);
}

function updateLayoutMode(mode: LayoutMode, supported: boolean) {
  if (!supported) {
    return;
  }

  appStore.setLayoutMode(mode);
}

function updateContentWidthMode(mode: ContentWidthMode) {
  appStore.setContentWidthMode(mode);
}

function updateTagViewsVisible(value: string | number | boolean) {
  appStore.setTagViewsVisible(Boolean(value));
}

function updateKeepAliveEnabled(value: string | number | boolean) {
  appStore.setKeepAliveEnabled(Boolean(value));
}

function updateShortcutHintsEnabled(value: string | number | boolean) {
  appStore.setShortcutHintsEnabled(Boolean(value));
}

function updateLogoutShortcutEnabled(value: string | number | boolean) {
  appStore.setLogoutShortcutEnabled(Boolean(value));
}

function updateScreenLockShortcutEnabled(value: string | number | boolean) {
  appStore.setScreenLockShortcutEnabled(Boolean(value));
}

function updateDarkSidebarEnabled(value: string | number | boolean) {
  appStore.setDarkSidebarEnabled(Boolean(value));
}

function updateDarkHeaderEnabled(value: string | number | boolean) {
  appStore.setDarkHeaderEnabled(Boolean(value));
}

function updateGrayModeEnabled(value: string | number | boolean) {
  appStore.setGrayModeEnabled(Boolean(value));
}

function updateColorWeakModeEnabled(value: string | number | boolean) {
  appStore.setColorWeakModeEnabled(Boolean(value));
}

function updatePageTransitionProgressEnabled(value: string | number | boolean) {
  appStore.setPageTransitionProgressEnabled(Boolean(value));
}

function updatePageTransitionLoadingEnabled(value: string | number | boolean) {
  appStore.setPageTransitionLoadingEnabled(Boolean(value));
}

function updatePageTransitionAnimationEnabled(value: string | number | boolean) {
  appStore.setPageTransitionAnimationEnabled(Boolean(value));
}

function updatePageTransitionAnimationName(value: PageTransitionAnimationName) {
  appStore.setPageTransitionAnimationName(value);
}

function resetUiPreferences() {
  appStore.resetUiPreferences();
}

function closeDrawer() {
  appStore.closeSettingsDrawer();
}
</script>

<template>
  <button
    v-if="!drawerVisible"
    type="button"
    class="global-settings-trigger"
    :aria-label="t('settings.trigger.open')"
    @click="openDrawer"
  >
    <el-icon><Setting /></el-icon>
  </button>

  <el-drawer
    v-model="drawerVisible"
    size="392px"
    append-to-body
    :with-header="false"
    class="global-settings-drawer"
  >
    <div class="global-settings">
      <header class="global-settings__header">
        <div class="global-settings__title">
          <strong>{{ t('settings.title') }}</strong>
          <span class="global-settings__sr-only">{{ t('settings.srTitle') }}</span>
        </div>
        <div class="global-settings__actions">
          <button type="button" :aria-label="t('settings.trigger.close')" @click="closeDrawer">
            <el-icon><Close /></el-icon>
          </button>
        </div>
      </header>

      <nav class="global-settings__tabs" :aria-label="t('settings.srTitle')">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          :data-test="`settings-tab-${tab.key}`"
          :class="{ 'is-active': activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </nav>

      <section v-if="activeTab === 'appearance'" class="global-settings__panel">
        <div class="global-settings__section">
          <div class="global-settings__switch-row">
            <span>{{ t('settings.appearance.darkSidebar') }}</span>
            <el-switch
              :model-value="appStore.darkSidebarEnabled"
              data-test="appearance-dark-sidebar-switch"
              @update:model-value="updateDarkSidebarEnabled"
            />
          </div>
          <div class="global-settings__switch-row">
            <span>{{ t('settings.appearance.darkHeader') }}</span>
            <el-switch
              :model-value="appStore.darkHeaderEnabled"
              data-test="appearance-dark-header-switch"
              @update:model-value="updateDarkHeaderEnabled"
            />
          </div>
        </div>

        <div class="global-settings__section">
          <h3>{{ t('settings.appearance.theme') }}</h3>
          <div class="global-settings__mode-grid">
            <button
              v-for="option in themeModeOptions"
              :key="option.value"
              type="button"
              class="global-settings__mode-card"
              :class="{ 'is-active': appStore.themeMode === option.value }"
              @click="updateThemeMode(option.value)"
            >
              <el-icon :size="28">
                <component :is="option.icon" />
              </el-icon>
              <span>{{ t(option.labelKey) }}</span>
            </button>
          </div>
        </div>

        <div class="global-settings__section">
          <h3>{{ t('settings.appearance.preset') }}</h3>
          <div class="global-settings__preset-grid">
            <button
              v-for="preset in themePresetOptions"
              :key="preset.value"
              type="button"
              class="global-settings__preset-card"
              :class="{ 'is-active': appStore.themePreset === preset.value }"
              :data-test="`theme-preset-${preset.value}`"
              @click="updateThemePreset(preset.value)"
            >
              <span class="global-settings__swatch-wrap">
                <span class="global-settings__swatch" :style="{ backgroundColor: preset.color }" />
              </span>
              <span>{{ preset.label }}</span>
            </button>
          </div>
        </div>
      </section>

      <section v-else-if="activeTab === 'layout'" class="global-settings__panel">
        <div class="global-settings__section">
          <h3>{{ t('settings.layout.title') }}</h3>
          <div class="global-settings__layout-grid">
            <button
              v-for="option in layoutModeOptions"
              :key="option.value"
              type="button"
              class="global-settings__layout-card"
              :class="[
                `global-settings__layout-card--${option.value}`,
                {
                  'is-active': appStore.layoutMode === option.value,
                  'is-disabled': !option.supported,
                },
              ]"
              :disabled="!option.supported"
              :data-test="`layout-mode-${option.value}`"
              @click="updateLayoutMode(option.value, option.supported)"
            >
              <span class="global-settings__layout-preview" aria-hidden="true">
                <span class="global-settings__preview-sidebar" />
                <span class="global-settings__preview-header" />
                <span class="global-settings__preview-subnav" />
                <span class="global-settings__preview-body">
                  <span />
                  <span />
                  <span />
                </span>
              </span>
              <span class="global-settings__layout-label">
                {{ t(option.labelKey) }}
                <small v-if="!option.supported">{{ t('settings.layout.comingSoon') }}</small>
              </span>
            </button>
          </div>
        </div>

        <div class="global-settings__section">
          <h3>{{ t('settings.layout.contentWidth') }}</h3>
          <div class="global-settings__content-grid">
            <button
              v-for="option in contentWidthOptions"
              :key="option.value"
              type="button"
              class="global-settings__layout-card global-settings__layout-card--content"
              :class="{ 'is-active': appStore.contentWidthMode === option.value }"
              :data-test="`content-width-${option.value}`"
              @click="updateContentWidthMode(option.value)"
            >
              <span class="global-settings__layout-preview" aria-hidden="true">
                <span class="global-settings__preview-header" />
                <span class="global-settings__preview-body">
                  <span />
                  <span />
                  <span />
                </span>
              </span>
              <span class="global-settings__layout-label">{{ t(option.labelKey) }}</span>
            </button>
          </div>
        </div>

        <div class="global-settings__section">
          <!-- <div class="global-settings__switch-row">
            <span>深色侧边栏</span>
            <el-switch
              :model-value="appStore.darkSidebarEnabled"
              data-test="dark-sidebar-switch"
              @update:model-value="updateDarkSidebarEnabled"
            />
          </div>
          <div class="global-settings__switch-row">
            <span>深色顶栏</span>
            <el-switch
              :model-value="appStore.darkHeaderEnabled"
              data-test="dark-header-switch"
              @update:model-value="updateDarkHeaderEnabled"
            />
          </div> -->
          <div class="global-settings__switch-row">
            <span>{{ t('settings.layout.tagViews') }}</span>
            <el-switch
              :model-value="appStore.tagViewsVisible"
              :active-text="t('common.action.show')"
              :inactive-text="t('common.action.hide')"
              data-test="tag-views-switch"
              @update:model-value="updateTagViewsVisible"
            />
          </div>
          <div class="global-settings__switch-row">
            <span>{{ t('settings.layout.keepAlive') }}</span>
            <el-switch
              :model-value="appStore.keepAliveEnabled"
              data-test="keep-alive-switch"
              @update:model-value="updateKeepAliveEnabled"
            />
          </div>
        </div>
      </section>

      <section v-else-if="activeTab === 'shortcut'" class="global-settings__panel">
        <div class="global-settings__section">
          <h3>{{ t('settings.shortcut.title') }}</h3>
          <div class="global-settings__switch-row">
            <span>{{ t('settings.shortcut.enabled') }}</span>
            <el-switch
              :model-value="appStore.shortcutHintsEnabled"
              data-test="shortcut-hints-switch"
              @update:model-value="updateShortcutHintsEnabled"
            />
          </div>
          <div class="global-settings__switch-row">
            <span>{{ t('settings.shortcut.logout.title') }}</span>
            <el-switch
              :model-value="appStore.logoutShortcutEnabled"
              data-test="logout-shortcut-switch"
              @update:model-value="updateLogoutShortcutEnabled"
            />
          </div>
          <div class="global-settings__switch-row">
            <span>{{ t('settings.shortcut.lockScreen.title') }}</span>
            <el-switch
              :model-value="appStore.screenLockShortcutEnabled"
              data-test="screen-lock-shortcut-switch"
              @update:model-value="updateScreenLockShortcutEnabled"
            />
          </div>
        </div>

        <div class="global-settings__shortcut-list">
          <div
            v-for="shortcut in shortcutOptions"
            :key="shortcut.keys"
            class="global-settings__shortcut-item"
          >
            <div>
              <strong>{{ shortcut.title }}</strong>
              <span>{{ shortcut.description }}</span>
            </div>
            <kbd>{{ shortcut.keys }}</kbd>
          </div>
        </div>
      </section>

      <section v-else-if="activeTab === 'common'" class="global-settings__panel">
        <div class="global-settings__section">
          <h3>{{ t('settings.common.title') }}</h3>
          <div class="global-settings__switch-row">
            <span>{{ t('settings.common.progress') }}</span>
            <el-switch
              :model-value="appStore.pageTransitionProgressEnabled"
              data-test="page-transition-progress-switch"
              @update:model-value="updatePageTransitionProgressEnabled"
            />
          </div>
          <div class="global-settings__switch-row">
            <span>{{ t('settings.common.loading') }}</span>
            <el-switch
              :model-value="appStore.pageTransitionLoadingEnabled"
              data-test="page-transition-loading-switch"
              @update:model-value="updatePageTransitionLoadingEnabled"
            />
          </div>
          <div class="global-settings__switch-row">
            <span>{{ t('settings.common.animation') }}</span>
            <el-switch
              :model-value="appStore.pageTransitionAnimationEnabled"
              data-test="page-transition-animation-switch"
              @update:model-value="updatePageTransitionAnimationEnabled"
            />
          </div>
          <div class="global-settings__animation-grid">
            <button
              v-for="option in pageTransitionAnimationOptions"
              :key="option.value"
              type="button"
              class="global-settings__animation-card"
              :class="[
                `global-settings__animation-card--${option.value}`,
                {
                  'is-active': appStore.pageTransitionAnimationName === option.value,
                },
              ]"
              :data-test="`page-transition-animation-${option.value}`"
              @click="updatePageTransitionAnimationName(option.value)"
            >
              <span class="global-settings__animation-preview">
                <span class="global-settings__animation-frame" />
                <span class="global-settings__animation-node" />
              </span>
              <span class="global-settings__animation-label">{{ t(option.labelKey) }}</span>
            </button>
          </div>
          <div class="global-settings__switch-row">
            <span>{{ t('settings.common.grayMode') }}</span>
            <el-switch
              :model-value="appStore.grayModeEnabled"
              data-test="gray-mode-switch"
              @update:model-value="updateGrayModeEnabled"
            />
          </div>
          <div class="global-settings__switch-row">
            <span>{{ t('settings.common.colorWeakMode') }}</span>
            <el-switch
              :model-value="appStore.colorWeakModeEnabled"
              data-test="color-weak-switch"
              @update:model-value="updateColorWeakModeEnabled"
            />
          </div>
        </div>

        <button
          type="button"
          class="global-settings__reset"
          data-test="reset-ui-preferences"
          @click="resetUiPreferences"
        >
          <el-icon><Warning /></el-icon>
          <span>{{ t('settings.common.reset') }}</span>
        </button>
      </section>

      <section v-else class="global-settings__empty">
        <span>{{ tabs.find((tab) => tab.key === activeTab)?.label }}</span>
        <p>{{ t('settings.empty') }}</p>
      </section>

      <div class="global-settings__legacy" aria-hidden="true">
        <span>{{ t('settings.layout.keepAlive') }}</span>
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
  min-height: 100%;
  display: flex;
  flex-direction: column;
  margin: -20px;
  color: var(--el-text-color-primary);
  background: var(--el-bg-color);
}

.global-settings__header {
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 20px;
  border-bottom: 1px solid var(--el-border-color-light);
  background: var(--el-bg-color);
}

.global-settings__title {
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: 4px;
  white-space: nowrap;
}

.global-settings__title strong {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
}

.global-settings__sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.global-settings__title span {
  min-width: 0;
  overflow: hidden;
  color: var(--el-text-color-secondary);
  font-size: 15px;
  font-weight: 600;
  text-overflow: ellipsis;
}

.global-settings__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.global-settings__actions button {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  cursor: pointer;
  border: 0;
  border-radius: 6px;
  color: var(--el-text-color-secondary);
  background: transparent;
  transition:
    color 0.2s ease,
    background 0.2s ease;
}

.global-settings__actions button:hover {
  color: var(--el-color-primary);
  background: var(--el-fill-color-light);
}

.global-settings__tabs {
  display: flex;
  gap: 8px;
  margin: 20px 12px 18px;
  padding: 6px;
  overflow-x: auto;
  border: 1px solid var(--el-border-color);
  border-radius: 12px;
  background: var(--el-fill-color-light);
}

.global-settings__tabs button {
  min-width: max-content;
  flex: 0 0 auto;
  padding: 8px 14px;
  cursor: pointer;
  border: 0;
  border-radius: 8px;
  color: var(--el-text-color-secondary);
  background: transparent;
  font-size: 15px;
  font-weight: 700;
  transition:
    color 0.2s ease,
    background 0.2s ease;
}

.global-settings__tabs button.is-active {
  color: var(--el-color-primary);
  background: var(--el-bg-color);
}

.global-settings__panel {
  display: flex;
  flex-direction: column;
  gap: 26px;
  padding: 0 12px 20px;
}

.global-settings__section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.global-settings__section h3 {
  margin: 0;
  font-size: 20px;
  line-height: 1.3;
}

.global-settings__mode-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.global-settings__mode-card,
.global-settings__preset-card {
  cursor: pointer;
  border: 1px solid var(--el-border-color);
  background: var(--el-bg-color);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    color 0.2s ease;
}

.global-settings__mode-card {
  min-height: 110px;
  display: grid;
  place-items: center;
  gap: 12px;
  border-radius: 8px;
  color: var(--el-text-color-secondary);
  font-size: 15px;
  font-weight: 700;
}

.global-settings__mode-card.is-active,
.global-settings__preset-card.is-active {
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--el-color-primary) 30%, transparent);
  color: var(--el-color-primary);
}

.global-settings__layout-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px 18px;
}

.global-settings__content-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px 34px;
}

.global-settings__layout-card {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 0;
  cursor: pointer;
  border: 0;
  color: var(--el-text-color-secondary);
  background: transparent;
  font-size: 14px;
  font-weight: 700;
}

.global-settings__layout-card:disabled {
  cursor: not-allowed;
}

.global-settings__layout-card.is-disabled {
  opacity: 0.58;
}

.global-settings__layout-preview {
  position: relative;
  height: 78px;
  overflow: hidden;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  background: var(--el-bg-color);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.global-settings__layout-card.is-active .global-settings__layout-preview {
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--el-color-primary) 30%, transparent);
}

.global-settings__layout-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 34px;
  text-align: center;
}

.global-settings__layout-label small {
  color: var(--el-text-color-placeholder);
  font-size: 11px;
  font-weight: 600;
}

.global-settings__preview-sidebar,
.global-settings__preview-header,
.global-settings__preview-subnav,
.global-settings__preview-body {
  position: absolute;
  display: block;
}

.global-settings__preview-sidebar,
.global-settings__preview-header {
  background: #171923;
}

.global-settings__preview-sidebar {
  inset: 8px auto 8px 8px;
  width: 28px;
}

.global-settings__preview-header {
  inset: 8px 8px auto 44px;
  height: 12px;
}

.global-settings__preview-subnav {
  display: none;
  background: var(--el-fill-color);
}

.global-settings__preview-body {
  inset: 26px 8px 8px 44px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

.global-settings__preview-body span {
  display: block;
  border-radius: 3px;
  background: var(--el-fill-color);
}

.global-settings__preview-body span:nth-child(3) {
  grid-column: 1 / -1;
}

.global-settings__layout-card--sidebar .global-settings__preview-sidebar {
  width: 24px;
}

.global-settings__layout-card--sidebar .global-settings__preview-header,
.global-settings__layout-card--full-content .global-settings__preview-header {
  left: 38px;
}

.global-settings__layout-card--sidebar .global-settings__preview-body,
.global-settings__layout-card--full-content .global-settings__preview-body {
  left: 38px;
}

.global-settings__layout-card--horizontal .global-settings__preview-sidebar {
  display: none;
}

.global-settings__layout-card--horizontal .global-settings__preview-header {
  inset: 8px 8px auto;
}

.global-settings__layout-card--horizontal .global-settings__preview-body {
  inset: 26px 8px 8px;
}

.global-settings__layout-card--content .global-settings__preview-header {
  inset: 8px 8px auto;
}

.global-settings__layout-card--full-content .global-settings__preview-sidebar,
.global-settings__layout-card--full-content .global-settings__preview-header {
  display: none;
}

.global-settings__layout-card--full-content .global-settings__preview-body {
  inset: 8px;
}

.global-settings__preset-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px 18px;
}

.global-settings__preset-card {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 9px;
  padding: 10px 8px;
  border-radius: 8px;
  color: var(--el-text-color-secondary);
  font-size: 13px;
  font-weight: 700;
}

.global-settings__swatch-wrap {
  width: 100%;
  height: 46px;
  display: grid;
  place-items: center;
  border-radius: 6px;
}

.global-settings__swatch {
  width: 28px;
  height: 28px;
  border-radius: 9px;
}

.global-settings__animation-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.global-settings__animation-card {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 0;
  cursor: pointer;
  border: 0;
  color: var(--el-text-color-secondary);
  background: transparent;
  font-size: 13px;
  font-weight: 700;
}

.global-settings__animation-preview {
  position: relative;
  display: block;
  height: 68px;
}

.global-settings__animation-frame {
  position: absolute;
  inset: 0;
  display: block;
  border: 1px solid var(--el-border-color);
  border-radius: 12px;
  background: transparent;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.global-settings__animation-node {
  position: absolute;
  top: 18px;
  left: 18px;
  display: block;
  width: 58px;
  height: 44px;
  border-radius: 12px;
  background: var(--el-fill-color);
  opacity: 0.82;
}

.global-settings__animation-card--fade-slide-up .global-settings__animation-node {
  top: 22px;
}

.global-settings__animation-card--fade-slide-right .global-settings__animation-node {
  left: 24px;
}

.global-settings__animation-card--zoom-fade .global-settings__animation-node {
  top: 16px;
  left: 20px;
  width: 50px;
  height: 50px;
}

.global-settings__animation-card.is-active .global-settings__animation-frame {
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--el-color-primary) 30%, transparent);
}

.global-settings__animation-label {
  display: flex;
  justify-content: center;
  min-height: 18px;
}

.global-settings__switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 44px;
  color: var(--el-text-color-secondary);
  font-size: 16px;
  font-weight: 600;
}

.global-settings__shortcut-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.global-settings__shortcut-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  background: var(--el-fill-color-lighter);
}

.global-settings__shortcut-item div {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.global-settings__shortcut-item strong {
  color: var(--el-text-color-primary);
}

.global-settings__shortcut-item span {
  color: var(--el-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.global-settings__shortcut-item kbd {
  flex: 0 0 auto;
  padding: 5px 8px;
  border: 1px solid var(--el-border-color);
  border-bottom-width: 2px;
  border-radius: 6px;
  color: var(--el-text-color-primary);
  background: var(--el-bg-color);
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
}

.global-settings__empty {
  display: grid;
  place-items: center;
  gap: 8px;
  min-height: 220px;
  padding: 24px;
  color: var(--el-text-color-secondary);
  text-align: center;
}

.global-settings__empty span {
  color: var(--el-text-color-primary);
  font-size: 18px;
  font-weight: 700;
}

.global-settings__empty p {
  margin: 0;
}

.global-settings__reset {
  width: 100%;
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  border: 1px solid var(--el-color-danger-light-5);
  border-radius: 8px;
  color: var(--el-color-danger);
  background: var(--el-color-danger-light-9);
  font-weight: 700;
  transition:
    border-color 0.2s ease,
    background 0.2s ease;
}

.global-settings__reset:hover {
  border-color: var(--el-color-danger);
  background: var(--el-color-danger-light-8);
}

.global-settings__legacy {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>
