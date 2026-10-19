<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AppButton from './components/AppButton.vue'
import ModalDialog from './components/ModalDialog.vue'
import ParticipantsTable from './components/ParticipantsTable.vue'
import RegistrationForm from './components/RegistrationForm.vue'
import SearchBar from './components/SearchBar.vue'
import WinnersList from './components/WinnersList.vue'
import { loadParticipants, saveParticipants } from './data/participants'
import type { Participant, ParticipantFormData, SortDirection, SortField } from './types'

const participants = ref<Participant[]>([])
const winnerIds = ref<string[]>([])
const searchQuery = ref('')
const sortField = ref<SortField | null>(null)
const sortDirection = ref<SortDirection>('asc')
const editingParticipant = ref<Participant | null>(null)
const participantToDelete = ref<Participant | null>(null)
const notice = ref('')
const noticeType = ref<'error' | 'success'>('success')

try {
  participants.value = loadParticipants()
} catch (error) {
  noticeType.value = 'error'
  notice.value =
    error instanceof Error
      ? `${error.message} Збереження працюватиме після додавання нового учасника.`
      : 'Не вдалося завантажити збережених учасників.'
}

watch(
  participants,
  (value) => {
    try {
      saveParticipants(value)
    } catch (error) {
      noticeType.value = 'error'
      notice.value =
        error instanceof Error
          ? `Не вдалося зберегти учасників: ${error.message}`
          : 'Не вдалося зберегти учасників у localStorage.'
    }
  },
  { deep: true },
)

const winners = computed(() =>
  winnerIds.value
    .map((id) => participants.value.find((participant) => participant.id === id))
    .filter((participant): participant is Participant => participant !== undefined),
)

const visibleParticipants = computed(() => {
  const filtered = participants.value.filter((participant) =>
    participant.name.toLocaleLowerCase('uk-UA').includes(searchQuery.value.toLocaleLowerCase('uk-UA')),
  )

  const field = sortField.value
  if (field === null) {
    return filtered
  }

  const direction = sortDirection.value === 'asc' ? 1 : -1
  return [...filtered].sort((first, second) => {
    return direction * first[field].localeCompare(second[field], 'uk-UA')
  })
})

const remainingParticipantCount = computed(
  () => participants.value.filter((participant) => !winnerIds.value.includes(participant.id)).length,
)

function isEmailTaken(email: string, exceptId?: string): boolean {
  const normalizedEmail = email.trim().toLocaleLowerCase('en-US')
  return participants.value.some(
    (participant) =>
      participant.id !== exceptId &&
      participant.email.trim().toLocaleLowerCase('en-US') === normalizedEmail,
  )
}

function clearNotice(): void {
  notice.value = ''
}

function addParticipant(data: ParticipantFormData): void {
  participants.value.push({
    id: crypto.randomUUID(),
    ...data,
  })
  noticeType.value = 'success'
  notice.value = 'Учасника успішно додано.'
}

function updateParticipant(data: ParticipantFormData): void {
  if (editingParticipant.value === null) {
    return
  }

  const participant = participants.value.find(
    (candidate) => candidate.id === editingParticipant.value?.id,
  )
  if (participant === undefined) {
    noticeType.value = 'error'
    notice.value = 'Не вдалося знайти учасника для редагування.'
    editingParticipant.value = null
    return
  }

  Object.assign(participant, data)
  editingParticipant.value = null
  noticeType.value = 'success'
  notice.value = 'Дані учасника оновлено.'
}

function confirmDelete(): void {
  const target = participantToDelete.value
  if (target === null) {
    return
  }

  participants.value = participants.value.filter((participant) => participant.id !== target.id)
  winnerIds.value = winnerIds.value.filter((id) => id !== target.id)
  noticeType.value = 'success'
  notice.value = `Учасника «${target.name}» видалено.`
  participantToDelete.value = null
}

function drawWinner(): void {
  const eligible = participants.value.filter(
    (participant) => !winnerIds.value.includes(participant.id),
  )
  if (eligible.length === 0 || winnerIds.value.length >= 3) {
    return
  }

  const index = Math.floor(Math.random() * eligible.length)
  const selected = eligible[index]
  if (selected === undefined) {
    return
  }

  winnerIds.value.push(selected.id)
  noticeType.value = 'success'
  notice.value = `Переможця обрано: ${selected.name}.`
}

function removeWinner(id: string): void {
  winnerIds.value = winnerIds.value.filter((winnerId) => winnerId !== id)
}

function toggleSort(field: SortField): void {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    return
  }

  sortField.value = field
  sortDirection.value = 'asc'
}

function emailTakenForEditor(email: string): boolean {
  return isEmailTaken(email, editingParticipant.value?.id)
}
</script>

<template>
  <main class="lottery-app">
    <header class="page-heading">
      <p class="page-heading__eyebrow">Лабораторна робота №4</p>
      <h1>Лотерея учасників</h1>
      <p>Реєструйте учасників, обирайте переможців і керуйте списком в одному місці.</p>
    </header>

    <div v-if="notice" class="notice" :class="{ 'notice--success': noticeType === 'success' }" role="status">
      <div class="notice-content">
        <span>{{ notice }}</span>
        <button class="modal-close" type="button" aria-label="Закрити повідомлення" @click="clearNotice">
          ×
        </button>
      </div>
    </div>

    <div class="lottery-layout">
      <section class="panel winner-panel" aria-labelledby="winners-heading">
        <div class="panel-heading">
          <div>
            <h2 id="winners-heading">Переможці</h2>
            <p>Можна обрати до трьох різних учасників.</p>
          </div>
          <div class="winner-actions">
            <AppButton
              variant="primary"
              :disabled="winnerIds.length >= 3 || remainingParticipantCount === 0"
              @click="drawWinner"
            >
              Новий переможець
            </AppButton>
          </div>
        </div>
        <WinnersList :winners="winners" @remove="removeWinner" />
      </section>

      <section class="panel" aria-labelledby="registration-heading">
        <div class="panel-heading">
          <div>
            <h2 id="registration-heading">Реєстрація учасника</h2>
            <p>Усі поля обов'язкові. Телефон — у форматі +380XXXXXXXXX.</p>
          </div>
        </div>
        <RegistrationForm :is-email-taken="(email) => isEmailTaken(email)" @submit="addParticipant" />
      </section>

      <section class="panel" aria-labelledby="participants-heading">
        <div class="panel-heading">
          <div>
            <h2 id="participants-heading">Список учасників</h2>
            <p>Дані автоматично зберігаються у цьому браузері.</p>
          </div>
        </div>
        <div class="table-toolbar">
          <SearchBar @filter-by-name="searchQuery = $event" />
          <p class="participant-count">
            Показано {{ visibleParticipants.length }} з {{ participants.length }}
          </p>
        </div>
        <ParticipantsTable
          :participants="visibleParticipants"
          :sort-field="sortField"
          :sort-direction="sortDirection"
          @sort="toggleSort"
          @edit="editingParticipant = $event"
          @remove="participantToDelete = $event"
        />
      </section>
    </div>

    <ModalDialog
      v-if="editingParticipant"
      :model-value="true"
      title="Редагування учасника"
      @update:model-value="editingParticipant = null"
    >
      <RegistrationForm
        :key="editingParticipant.id"
        :initial="editingParticipant"
        :is-email-taken="emailTakenForEditor"
        submit-label="Оновити дані"
        @submit="updateParticipant"
        @cancel="editingParticipant = null"
      />
    </ModalDialog>

    <ModalDialog
      v-if="participantToDelete"
      :model-value="true"
      title="Видалити учасника?"
      @update:model-value="participantToDelete = null"
    >
      <p class="confirm-copy">
        Ви дійсно бажаєте видалити учасника «{{ participantToDelete.name }}» з електронною поштою
        {{ participantToDelete.email }}? Цю дію не можна скасувати.
      </p>
      <template #footer>
        <AppButton @click="participantToDelete = null">Ні, залишити</AppButton>
        <AppButton variant="danger" @click="confirmDelete">Так, видалити</AppButton>
      </template>
    </ModalDialog>
  </main>
</template>
