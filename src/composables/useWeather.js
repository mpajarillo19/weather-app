import { ref } from 'vue'

export function useWeather() {
  const API_KEY = '0cb01e9df5755697b5d05ed9422e92f3'
  const API_URL = 'https://api.openweathermap.org/data/2.5/weather'

  const weatherData = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchWeather = async (city) => {
    if (!city) return

    loading.value = true
    error.value = null

    try {
      const response = await fetch(
        `${API_URL}?q=${city}&units=metric&appid=${API_KEY}`
      )

      if (!response.ok) {
        throw new Error('City not found')
      }

      weatherData.value = await response.json()
    } catch (e) {
      error.value = e.message
      weatherData.value = null
    } finally {
      loading.value = false
    }
  }

  return {
    weatherData,
    loading,
    error,
    fetchWeather
  }
}
