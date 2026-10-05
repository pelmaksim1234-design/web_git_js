<script setup lang="ts">
import { computed, ref } from 'vue'
import { users as sourceUsers, type User } from '../data/users'

type GenderFilter = 'all' | 'male' | 'female'
type AgeFilter = 'all' | 'adult'
type SortMode = 'default' | 'name-asc' | 'name-desc' | 'age-asc' | 'age-desc'

const users = sourceUsers
const genderFilter = ref<GenderFilter>('all')
const ageFilter = ref<AgeFilter>('all')
const sortMode = ref<SortMode>('default')
const expandedCards = ref<Record<number, boolean>>({})

const getUserAge = (user: User): number => user.dob.age

const getAgeClass = (user: User): string => {
  const age = getUserAge(user)

  if (age < 18) return 'minor'
  if (age <= 30) return 'young'
  if (age <= 50) return 'adult'
  return 'senior'
}

const visibleUsers = computed(() => {
  let filtered = [...users]

  if (genderFilter.value !== 'all') {
    filtered = filtered.filter((user) => user.gender === genderFilter.value)
  }

  if (ageFilter.value === 'adult') {
    filtered = filtered.filter((user) => getUserAge(user) >= 18)
  }

  if (sortMode.value !== 'default') {
    filtered.sort((first, second) => {
      if (sortMode.value === 'name-asc' || sortMode.value === 'name-desc') {
        const result = `${first.name.first} ${first.name.last}`.localeCompare(
          `${second.name.first} ${second.name.last}`,
        )
        return sortMode.value === 'name-asc' ? result : -result
      }

      const ageDelta = getUserAge(first) - getUserAge(second)
      return sortMode.value === 'age-asc' ? ageDelta : -ageDelta
    })
  }

  return filtered
})

const toggleDetails = (userId: number): void => {
  expandedCards.value[userId] = !expandedCards.value[userId]
}

const clearFilters = (): void => {
  genderFilter.value = 'all'
  ageFilter.value = 'all'
  sortMode.value = 'default'
}
</script>

<template>
  <div class="users-page">
    <div class="toolbar">
      <div class="toolbar-group">
        <button
          :class="{ active: genderFilter === 'all' }"
          type="button"
          @click="genderFilter = 'all'"
        >
          Всі
        </button>
        <button
          :class="{ active: genderFilter === 'male' }"
          type="button"
          @click="genderFilter = 'male'"
        >
          Чоловіки
        </button>
        <button
          :class="{ active: genderFilter === 'female' }"
          type="button"
          @click="genderFilter = 'female'"
        >
          Жінки
        </button>
      </div>

      <div class="toolbar-group">
        <button :class="{ active: ageFilter === 'all' }" type="button" @click="ageFilter = 'all'">
          Всі
        </button>
        <button :class="{ active: ageFilter === 'adult' }" type="button" @click="ageFilter = 'adult'">
          18 +
        </button>
      </div>

      <div class="toolbar-group sort-group">
        <button :class="{ active: sortMode === 'name-asc' }" type="button" @click="sortMode = 'name-asc'">
          Ім'я ↑
        </button>
        <button :class="{ active: sortMode === 'name-desc' }" type="button" @click="sortMode = 'name-desc'">
          Ім'я ↓
        </button>
        <button :class="{ active: sortMode === 'age-asc' }" type="button" @click="sortMode = 'age-asc'">
          Вік ↑
        </button>
        <button :class="{ active: sortMode === 'age-desc' }" type="button" @click="sortMode = 'age-desc'">
          Вік ↓
        </button>
      </div>

      <button class="clear-button" type="button" @click="clearFilters">Очистити все</button>
    </div>

    <div v-if="visibleUsers.length === 0" class="empty-state">Список юзерів пустий</div>

    <ul v-else class="user-list">
      <li
        v-for="user in visibleUsers"
        :key="user.id"
        class="user-card"
        :class="getAgeClass(user)"
      >
        <div class="user-image-wrap">
          <img :src="user.picture" :alt="`${user.name.first} ${user.name.last}`" />
        </div>

        <div class="user-content">
          <h2>{{ user.name.title }}. {{ user.name.first }} {{ user.name.last }}</h2>

          <div class="meta-row">
            <span class="meta-label">Gender</span>
            <span>{{ user.gender === 'female' ? 'Female' : 'Male' }}</span>
          </div>

          <div class="meta-row">
            <span class="meta-label">Age</span>
            <span v-if="user.dob.age > 18">{{ user.dob.age }} years</span>
            <span v-else>Minor</span>
          </div>

          <div class="meta-row">
            <span class="meta-label">Location</span>
            <span>{{ user.location.city }}, {{ user.location.country }}</span>
          </div>

          <div class="meta-row">
            <span class="meta-label">Email</span>
            <span>{{ user.email }}</span>
          </div>

          <div class="meta-row">
            <span class="meta-label">Phone</span>
            <span>{{ user.phone }}</span>
          </div>

          <div class="hobbies-list">
            <span v-for="hobby in user.hobbies" :key="hobby" class="hobby-tag">{{ hobby }}</span>
          </div>

          <button class="toggle-button" type="button" @click="toggleDetails(user.id)">
            {{ expandedCards[user.id] ? 'Сховати' : 'Деталі' }}
          </button>

          <div v-show="expandedCards[user.id]" class="details-box">
            {{ user.details }}
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.users-page {
  width: min(1200px, 100%);
  margin: 0 auto;
  padding: 32px 20px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(184, 198, 219, 0.9);
  border-radius: 18px;
  padding: 14px 18px;
  margin-bottom: 24px;
  box-shadow: 0 8px 24px rgba(20, 47, 73, 0.08);
}

.toolbar-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

button {
  border: 1px solid #d5e0ef;
  background: #f6f9ff;
  color: #2c4967;
  border-radius: 10px;
  padding: 9px 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

button:hover {
  border-color: #93b3d8;
  transform: translateY(-1px);
}

button.active {
  background: linear-gradient(135deg, #5da4ff, #7bb6ff);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 6px 18px rgba(96, 156, 255, 0.3);
}

.clear-button {
  background: #eef4ff;
}

.user-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.user-card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 18px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(182, 196, 218, 0.9);
  border-radius: 24px;
  padding: 18px;
  box-shadow: 0 12px 28px rgba(16, 40, 70, 0.08);
}

.user-card.minor {
  border-left: 6px solid #ffb1a8;
}

.user-card.young {
  border-left: 6px solid #87c5ff;
}

.user-card.adult {
  border-left: 6px solid #9dd8a8;
}

.user-card.senior {
  border-left: 6px solid #d7b7ff;
}

.user-image-wrap {
  display: flex;
  justify-content: center;
}

.user-image-wrap img {
  width: 100%;
  max-width: 230px;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 18px;
  border: 1px solid rgba(150, 170, 190, 0.8);
}

.user-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-content h2 {
  margin: 0;
  color: #2c4d6e;
  font-size: clamp(1.6rem, 2vw, 2.1rem);
}

.meta-row {
  display: grid;
  grid-template-columns: 90px 1fr;
  gap: 10px;
  font-size: 0.95rem;
  color: #3b5777;
}

.meta-label {
  font-weight: 700;
  color: #456a8e;
}

.hobbies-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}

.hobby-tag {
  background: linear-gradient(135deg, #eaf2ff, #eef7f0);
  border: 1px solid #d3e2fb;
  border-radius: 999px;
  padding: 6px 10px;
  color: #2a4f72;
  font-size: 0.8rem;
  font-weight: 600;
}

.toggle-button {
  align-self: flex-start;
  margin-top: 6px;
}

.details-box {
  background: #f5f9ff;
  border: 1px solid #dfeafc;
  border-radius: 12px;
  padding: 10px 12px;
  color: #365678;
  line-height: 1.5;
}

.empty-state {
  text-align: center;
  padding: 36px 18px;
  border: 1px dashed #c6d2e5;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.72);
  color: #45657f;
  font-size: 1.2rem;
  font-weight: 600;
}

@media (max-width: 640px) {
  .toolbar {
    justify-content: flex-start;
  }

  .meta-row {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}
</style>
