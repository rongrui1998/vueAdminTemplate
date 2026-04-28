<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import type { ElTree } from 'element-plus';
import type { BackendMenuItem } from '@/types/menu';
import type { SystemRoleRecord } from '@/types/system-role';

const props = defineProps<{
  visible: boolean;
  submitting?: boolean;
  record?: SystemRoleRecord | null;
  menuTree: BackendMenuItem[];
}>();

const emit = defineEmits<{
  (event: 'submit', menuIds: string[]): void;
  (event: 'update:visible', value: boolean): void;
}>();

const treeRef = ref<InstanceType<typeof ElTree>>();

const dialogTitle = computed(() => `分配角色权限${props.record ? `：${props.record.name}` : ''}`);

watch(
  () => [props.visible, props.record?.id, props.menuTree.length],
  async ([visible]) => {
    if (!visible) {
      return;
    }

    await nextTick();
    treeRef.value?.setCheckedKeys(props.record?.menuIds || []);
  },
  { immediate: true },
);

function closeDialog() {
  emit('update:visible', false);
}

function submitPermission() {
  const checkedKeys = treeRef.value?.getCheckedKeys(false) || [];
  const halfCheckedKeys = treeRef.value?.getHalfCheckedKeys() || [];
  emit('submit', [...new Set([...checkedKeys, ...halfCheckedKeys])].map(String));
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
        default-expand-all
        :props="{ label: 'name', children: 'children' }"
        class="role-permission-tree"
      />
    </el-scrollbar>

    <template #footer>
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="submitPermission">保存权限</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.role-permission-tree {
  padding: 4px 0;
}
</style>
