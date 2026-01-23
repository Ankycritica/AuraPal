export async function getCountry() {
  try {
    const response = await fetch('https://ipapi.co/json/')
    const data = await response.json()
    return data.country_name || 'Unknown'
  } catch (error) {
    console.error('Failed to get country:', error)
    return 'Unknown'
  }
}