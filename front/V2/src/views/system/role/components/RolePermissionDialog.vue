<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import type { ElTree, CheckedInfo } from 'element-plus';
import { useI18n } from 'vue-i18n';
import type { BackendMenuItem } from '@/types/menu';
import type { SystemRoleRecord } from '@/types/system-role';
import {
  buildSubmittedMenuIds,
  resolveReplayCheckedMenuIds,
  syncPermissionTreeCheckedIds,
} from '../permission-tree';

const props = defineProps<{
  visible: boolean;
  submitting?: boolean;
  record?: SystemRoleRecord | null;
  menuTree: BackendMenuItem[];
}>();

const emit = defineEmits<{
  (event: 'submit', payload: { roleId: string; menuIds: string[] }): void;
  (event: 'update:visible', value: boolean): void;
}>();

const treeRef = ref<InstanceType<typeof ElTree>>();
const checkedKeys = ref<string[]>([]);
const { t } = useI18n();

const dialogTitle = computed(() =>
  props.record
    ? t('systemRole.permission.titleWithName', { name: props.record.name })
    : t('systemRole.permission.title'),
);

watch(
  () => [props.visible, props.record?.id, props.menuTree.length],
  async ([visible]) => {
    if (!visible) {
      return;
    }

    await nextTick();
    checkedKeys.value = resolveReplayCheckedMenuIds(props.menuTree, props.record?.menuIds || []);
    treeRef.value?.setCheckedKeys([]);
    treeRef.value?.setCheckedKeys(checkedKeys.value);
  },
  { immediate: true },
);

function closeDialog() {
  emit('update:visible', false);
}

function submitPermission() {
  if (!props.record?.id) {
    return;
  }

  const currentCheckedKeys = (treeRef.value?.getCheckedKeys(false) || checkedKeys.value).map(
    String,
  );
  emit('submit', {
    roleId: props.record.id,
    menuIds: buildSubmittedMenuIds(props.menuTree, currentCheckedKeys),
  });
}

function handleTreeCheck(nodeData: BackendMenuItem, payload: CheckedInfo) {
  const nextCheckedKeys = payload.checkedKeys.map(String);

  checkedKeys.value = syncPermissionTreeCheckedIds(
    props.menuTree,
    nextCheckedKeys,
    String(nodeData.id),
    nextCheckedKeys.includes(String(nodeData.id)),
  );
  treeRef.value?.setCheckedKeys([]);
  treeRef.value?.setCheckedKeys(checkedKeys.value);
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    :title="dialogTitle"
    width="620px"
    destroy-on-close
    @close="closeDialog"
  >
    <el-scrollbar max-height="420px">
      <el-tree
        ref="treeRef"
        :data="menuTree"
        node-key="id"
        show-checkbox
        check-strictly
        default-expand-all
        :props="{ label: 'name', children: 'children' }"
        class="role-permission-tree"
        @check="handleTreeCheck"
      />
    </el-scrollbar>

    <template #footer>
      <el-button @click="closeDialog">{{ t('common.action.cancel') }}</el-button>
      <el-button
        type="primary"
        :loading="submitting"
        :disabled="!record?.id"
        @click="submitPermission"
      >
        {{ t('systemRole.permission.save') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.role-permission-tree {
  padding: 4px 0;
}
</style>
