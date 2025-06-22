<template>
  <div class="flex flex-col gap-4 py-4">
    <p class="text-xl font-bold text-center">Dynamic Virtual List Table</p>

    <div ref="parentRef" class="h-[600px] overflow-auto">
      <div :style="{ height: `${totalSize}px` }">
        <table class="border-separate border-spacing-[30px]">
          <thead>
            <tr
              v-for="headerGroup in table.getHeaderGroups()"
              :key="headerGroup.id"
            >
              <th
                v-for="(header, i) in headerGroup.headers"
                :key="`header-${i}`"
                :colspan="header.colSpan"
                :style="{ width: `${header.getSize()}px` }"
              >
                <slot name="header" :header />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(virtualRow, index) in virtualRows"
              :key="(virtualRow.key as number)"
              :style="{
                transform: `translateY(${
                  virtualRow.start - index * virtualRow.size
                }px)`,
              }"
            >
              <td
                v-for="(cell, k) in rows[virtualRow.index].getVisibleCells()"
                :key="`cell-${k}`"
              >
                <slot name="row" :cell />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useVirtualizer } from '@tanstack/vue-virtual';
  import {
    type ColumnDef,
    type SortingState,
    useVueTable,
    getCoreRowModel,
    getSortedRowModel,
  } from '@tanstack/vue-table';

  type Props = {
    data: Record<string, any>[];
  };

  const props = defineProps<Props>();

  type RowType = (typeof props.data)[number];
  const sorting = ref<SortingState>([]);

  const setSorting = (sortingUpdater: any) => {
    const newSortVal = sortingUpdater(sorting.value);

    sorting.value = newSortVal;
  };

  const columns = computed<ColumnDef<RowType>[]>(() => {
    const col = Object.keys(props.data[0]).map<ColumnDef<RowType>>((val) => ({
      header: val,
      id: val,
      accessorKey: val,
      minSize: 600,
    }));

    return col;
  });

  const table = useVueTable({
    data: props.data,
    columns: columns.value,
    state: {
      get sorting() {
        return sorting.value;
      },
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  const rows = computed(() => {
    return table.getRowModel().rows;
  });

  const parentRef = ref<HTMLElement | null>(null);

  const rowVirtualizerOptions = computed(() => {
    return {
      count: rows.value.length,
      getScrollElement: () => parentRef.value,
      estimateSize: (index: number) => {
        const row = props.data[index];
        const colCount = Object.keys(row).length;
        return 34 + colCount * 0.5;
      },
      overscan: 10,
    };
  });

  const rowVirtualizer = useVirtualizer(rowVirtualizerOptions);

  const virtualRows = computed(() => rowVirtualizer.value.getVirtualItems());

  const totalSize = computed(() => rowVirtualizer.value.getTotalSize());
</script>
