<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { debounce } from 'lodash'

console.log(import.meta.env.VITE_WEATHER_API_KEY)


const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const API_URL = 'https://api..org/data/2.5/weather'
openweathermap
const searchQuery = ref('')
const searchResults = ref([])
const showDropdown = ref(false)
const weatherData = ref(null)
const loading = ref(false)
const error = ref(null)

const handleSearch = debounce(async () => {
  if (searchQuery.value.length < 3) {
    searchResults.value = []
    showDropdown.value = false
    return
  }

  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchQuery.value)}&limit=5&appid=${API_KEY}`
    )
    searchResults.value = await response.json()
    showDropdown.value = true
  } catch (e) {
    searchResults.value = []
  }
}, 300)

const selectCity = async (city) => {
  searchQuery.value = city.name
  showDropdown.value = false
  loading.value = true
  error.value = null

  try {
    const response = await fetch(
      `${API_URL}?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${API_KEY}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch weather data')
    }

    weatherData.value = await response.json()
  } catch (e) {
    error.value = e.message
    weatherData.value = null
  } finally {
    loading.value = false
  }
}

// Click outside to close dropdown
const handleClickOutside = (event) => {
  if (!event.target.closest('.search-container')) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-sky-400 to-blue-600 p-8">
    <div class="max-w-4xl mx-auto text-center mb-8">
      <h1 class="text-4xl md:text-6xl font-bold text-white mb-2">Weather Forecast</h1>
      <p class="text-white/80 text-lg">Real-time weather updates for any location</p>
    </div>

    <div class="max-w-md mx-auto bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
      <!-- Search Section -->
      <div class="mb-8 relative">
        <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg class="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input v-model="searchQuery" @input="handleSearch" type="text" placeholder="Search for a city..."
          class="w-full pl-12 pr-4 py-4 bg-sky-600/20 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/60" />

        <!-- Dropdown Results -->
        <div v-if="searchResults.length && showDropdown"
          class="absolute w-full mt-2 bg-gradient-to-b from-sky-700/90 to-blue-900/90 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-10">
          <div v-for="result in searchResults" :key="`${result.lat}-${result.lon}`" @click="selectCity(result)"
            class="p-4 hover:bg-sky-500/30 transition-all duration-200 cursor-pointer border-b border-white/10 last:border-b-0 text-white">
            <div class="font-medium">{{ result.name }}</div>
            <div class="text-sm text-white/70">
              {{ result.state ? `${result.state}, ` : '' }}{{ result.country }}
            </div>
          </div>
        </div>
      </div>

      <!-- Weather Display -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full"></div>
      </div>

      <div v-else-if="error" class="flex justify-center items-center text-white py-8 bg-red-500/10 rounded-xl">
        {{ error }}
      </div>

      <div v-else-if="weatherData" class="text-white space-y-6">
        <!-- City and Temperature -->
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <h2 class="text-4xl font-bold">{{ weatherData.name }}</h2>
            <p class="text-white/70">{{ new Date().toLocaleDateString('en-US', {
              weekday: 'long', month: 'long', day:
                'numeric'
            }) }}</p>
          </div>
          <div class="text-6xl font-bold">{{ Math.round(weatherData.main.temp) }}°</div>
        </div>

        <!-- Weather Description -->
        <div class="bg-sky-600/20 rounded-xl p-6 text-center">
          <div class="text-2xl font-semibold capitalize mb-2">
            {{ weatherData.weather[0].description }}
          </div>
          <div class="text-white/70">
            Feels like {{ Math.round(weatherData.main.feels_like) }}°
          </div>
        </div>

        <!-- Weather Details -->
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-sky-600/20 p-6 rounded-xl flex flex-col items-center">
            <div class="flex items-center gap-2 mb-2">
              <svg class="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <span class="text-white/70">Humidity</span>
            </div>
            <p class="text-3xl font-bold">{{ weatherData.main.humidity }}%</p>
          </div>
          <div class="bg-sky-600/20 p-6 rounded-xl flex flex-col items-center">
            <div class="flex items-center gap-2 mb-2">
              <svg class="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <span class="text-white/70">Wind</span>
            </div>
            <p class="text-3xl font-bold">{{ weatherData.wind.speed }} m/s</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
