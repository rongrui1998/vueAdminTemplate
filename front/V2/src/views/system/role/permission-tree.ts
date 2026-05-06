import type { BackendMenuItem } from '@/types/menu';

function buildParentIdMap(menuTree: BackendMenuItem[]) {
  const parentIdMap = new Map<string, string | null>();

  function walk(nodes: BackendMenuItem[], parentId: string | null = null) {
    nodes.forEach((node) => {
      parentIdMap.set(node.id, parentId);

      if (node.children?.length) {
        walk(node.children, node.id);
      }
    });
  }

  walk(menuTree);
  return parentIdMap;
}

function buildNodeMap(menuTree: BackendMenuItem[]) {
  const nodeMap = new Map<string, BackendMenuItem>();

  function walk(nodes: BackendMenuItem[]) {
    nodes.forEach((node) => {
      nodeMap.set(node.id, node);

      if (node.children?.length) {
        walk(node.children);
      }
    });
  }

  walk(menuTree);
  return nodeMap;
}

function collectDescendantIds(node: BackendMenuItem) {
  const ids: string[] = [];

  function walk(current: BackendMenuItem) {
    current.children?.forEach((child) => {
      ids.push(child.id);
      walk(child);
    });
  }

  walk(node);
  return ids;
}

export function resolveReplayCheckedMenuIds(
  menuTree: BackendMenuItem[],
  selectedMenuIds: string[],
) {
  const selectedIdSet = new Set(selectedMenuIds.map(String));

  function walk(node: BackendMenuItem): { ids: string[]; selectedInSubtree: boolean } {
    const childResults = (node.children || []).map((child) => walk(child));
    const hasSelectedDescendant = childResults.some((result) => result.selectedInSubtree);
    const isSelected = selectedIdSet.has(node.id);
    const shouldReplay =
      isSelected && (node.type === 'button' || node.type === 'menu' || !hasSelectedDescendant);
    const ids = shouldReplay ? [node.id] : [];

    childResults.forEach((result) => {
      ids.push(...result.ids);
    });

    return {
      ids,
      selectedInSubtree: isSelected || hasSelectedDescendant,
    };
  }

  return menuTree.flatMap((item) => walk(item).ids);
}

export function buildSubmittedMenuIds(menuTree: BackendMenuItem[], checkedMenuIds: string[]) {
  const parentIdMap = buildParentIdMap(menuTree);
  const submittedIds = new Set(checkedMenuIds.map(String));

  checkedMenuIds.forEach((id) => {
    let parentId = parentIdMap.get(String(id));

    while (parentId) {
      submittedIds.add(parentId);
      parentId = parentIdMap.get(parentId) ?? null;
    }
  });

  return [...submittedIds];
}

export function syncPermissionTreeCheckedIds(
  menuTree: BackendMenuItem[],
  checkedMenuIds: string[],
  toggledId: string,
  isChecked: boolean,
) {
  const parentIdMap = buildParentIdMap(menuTree);
  const nodeMap = buildNodeMap(menuTree);
  const nextCheckedIdSet = new Set(checkedMenuIds.map(String));
  const toggledNode = nodeMap.get(String(toggledId));

  if (!toggledNode) {
    return [...nextCheckedIdSet];
  }

  if (isChecked) {
    nextCheckedIdSet.add(toggledNode.id);

    let parentId = parentIdMap.get(toggledNode.id) ?? null;
    while (parentId) {
      nextCheckedIdSet.add(parentId);
      parentId = parentIdMap.get(parentId) ?? null;
    }

    return [...nextCheckedIdSet];
  }

  nextCheckedIdSet.delete(toggledNode.id);

  if (toggledNode.type !== 'button') {
    collectDescendantIds(toggledNode).forEach((id) => {
      nextCheckedIdSet.delete(id);
    });
  }

  return [...nextCheckedIdSet];
}
