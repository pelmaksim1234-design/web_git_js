<script setup lang="ts">
import type { Participant, SortDirection, SortField } from '../types'
import AppButton from './AppButton.vue'

defineProps<{
  participants: Participant[]
  sortField: SortField | null
  sortDirection: SortDirection
}>()

const emit = defineEmits<{
  sort: [field: SortField]
  edit: [participant: Participant]
  remove: [participant: Participant]
}>()
</script>

<template>
  <div class="table-responsive">
    <table class="table participants-table">
      <thead>
        <tr>
          <th scope="col">№</th>
          <th scope="col">
            <button class="sort-button" type="button" @click="emit('sort', 'name')">
              Ім'я
              <span v-if="sortField === 'name'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
            </button>
          </th>
          <th scope="col">
            <button class="sort-button" type="button" @click="emit('sort', 'dateOfBirth')">
              Дата народження
              <span v-if="sortField === 'dateOfBirth'">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </button>
          </th>
          <th scope="col">Електронна пошта</th>
          <th scope="col">Номер телефону</th>
          <th scope="col"><span class="visually-hidden">Дії</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(participant, index) in participants" :key="participant.id">
          <td>{{ index + 1 }}</td>
          <td class="participant-name">{{ participant.name }}</td>
          <td>{{ participant.dateOfBirth }}</td>
          <td>{{ participant.email }}</td>
          <td>{{ participant.phone }}</td>
          <td>
            <div class="table-actions">
              <AppButton
                variant="quiet"
                :aria-label="`Редагувати ${participant.name}`"
                @click="emit('edit', participant)"
              >
                Змінити
              </AppButton>
              <AppButton
                variant="quiet"
                :aria-label="`Видалити ${participant.name}`"
                @click="emit('remove', participant)"
              >
                Видалити
              </AppButton>
            </div>
          </td>
        </tr>
        <tr v-if="participants.length === 0">
          <td colspan="6" class="table-empty">Учасників не знайдено</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
