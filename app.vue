<template>
  <div>
    <DynamicVirtualTable :data>
      <template #header="{ header }">
        <div
          v-if="!header.isPlaceholder"
          :class="[
            'text-left',
            header.column.getCanSort() ? 'cursor-pointer select-none' : '',
          ]"
          @click="
            getSortingHandler($event, header.column.getToggleSortingHandler())
          "
        >
          <div>
            <FlexRender
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </div>
          <span v-if="header.column.getIsSorted() === 'asc'"> 🔼</span>
          <span v-if="header.column.getIsSorted() === 'desc'"> 🔽</span>
        </div>
      </template>
      <template #row="{ cell }">
        <div class="">
          {{ cell.row.getValue(cell.column.id) }}
        </div>
      </template>
    </DynamicVirtualTable>
  </div>
</template>

<script setup lang="ts">
  import datas from '@/data/table_data.json';
  import { FlexRender } from '@tanstack/vue-table';

  const data = ref(datas);

  const getSortingHandler = (e: Event, fn: any) => {
    return fn(e);
  };
</script>
