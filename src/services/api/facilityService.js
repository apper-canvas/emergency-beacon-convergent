import facilitiesData from "@/services/mockData/facilities.json"

class FacilityService {
  constructor() {
    this.facilities = [...facilitiesData]
  }

  // Simulate API delay
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Calculate distance between two coordinates (Haversine formula)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371 // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1)
    const dLon = this.toRadians(lon2 - lon1)
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  toRadians(degrees) {
    return degrees * (Math.PI/180)
  }

  async getAll() {
    await this.delay()
    return this.facilities.map(facility => ({ ...facility }))
  }

  async getById(id) {
    await this.delay()
    const facility = this.facilities.find(facility => facility.Id === parseInt(id))
    return facility ? { ...facility } : null
  }

  async getByType(type) {
    await this.delay()
    return this.facilities
      .filter(facility => facility.type === type)
      .map(facility => ({ ...facility }))
  }

  async getNearby(coordinates, radiusKm = 10) {
    await this.delay()
    
    return this.facilities
      .map(facility => {
        const distance = this.calculateDistance(
          coordinates.latitude,
          coordinates.longitude,
          facility.coordinates.latitude,
          facility.coordinates.longitude
        )
        
        return {
          ...facility,
          distance: distance
        }
      })
      .filter(facility => facility.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance)
  }

  async getAvailable() {
    await this.delay()
    return this.facilities
      .filter(facility => facility.availability === "available")
      .map(facility => ({ ...facility }))
  }

  async create(facilityData) {
    await this.delay(400)
    
    const newId = Math.max(...this.facilities.map(f => f.Id)) + 1
    const facilityId = `${facilityData.type.toUpperCase()}-${String(newId).padStart(3, '0')}`
    
    const newFacility = {
      Id: newId,
      id: facilityId,
      name: facilityData.name,
      type: facilityData.type,
      coordinates: facilityData.coordinates,
      address: facilityData.address,
      contactNumber: facilityData.contactNumber,
      distance: 0,
      responseTime: facilityData.responseTime || "Unknown",
      availability: facilityData.availability || "available"
    }

    this.facilities.push(newFacility)
    return { ...newFacility }
  }

  async update(id, updateData) {
    await this.delay()
    
    const index = this.facilities.findIndex(facility => facility.Id === parseInt(id))
    if (index === -1) return null

    this.facilities[index] = {
      ...this.facilities[index],
      ...updateData
    }

    return { ...this.facilities[index] }
  }

  async delete(id) {
    await this.delay()
    
    const index = this.facilities.findIndex(facility => facility.Id === parseInt(id))
    if (index === -1) return false

    this.facilities.splice(index, 1)
    return true
  }

  async updateAvailability(id, availability) {
    await this.delay()
    
    const index = this.facilities.findIndex(facility => facility.Id === parseInt(id))
    if (index === -1) return null

    this.facilities[index].availability = availability
    return { ...this.facilities[index] }
  }
}

export const facilityService = new FacilityService()