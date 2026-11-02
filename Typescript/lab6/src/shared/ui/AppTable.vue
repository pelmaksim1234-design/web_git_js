<script setup lang="ts">
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'

export interface AppTableColumn {
  field: string
  header: string
}

defineProps<{
  value: Record<string, string | number | undefined>[]
  columns: AppTableColumn[]
  dataKey?: string
  loading?: boolean
}>()
</script>

<template>
  <DataTable :value="value" :data-key="dataKey" :loading="loading" striped-rows>
    <Column v-for="column in columns" :key="column.field" :field="column.field" :header="column.header">
      <template #body="{ data }">
        <slot :name="`body-${column.field}`" :data="data">
          {{ data[column.field] }}
        </slot>
      </template>
    </Column>
  </DataTable>
</template>
