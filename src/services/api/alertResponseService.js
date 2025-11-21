import alertResponsesData from "@/services/mockData/alertResponses.json"

class AlertResponseService {
  constructor() {
    this.responses = [...alertResponsesData]
  }

  // Simulate API delay
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getAll() {
    await this.delay()
    return this.responses
      .map(response => ({ ...response }))
      .sort((a, b) => new Date(b.acknowledgedAt) - new Date(a.acknowledgedAt))
  }

  async getById(id) {
    await this.delay()
    const response = this.responses.find(response => response.Id === parseInt(id))
    return response ? { ...response } : null
  }

  async getByIncident(incidentId) {
    await this.delay()
    return this.responses
      .filter(response => response.incidentId === incidentId)
      .map(response => ({ ...response }))
      .sort((a, b) => new Date(b.acknowledgedAt) - new Date(a.acknowledgedAt))
  }

  async getByFacility(facilityId) {
    await this.delay()
    return this.responses
      .filter(response => response.facilityId === facilityId)
      .map(response => ({ ...response }))
      .sort((a, b) => new Date(b.acknowledgedAt) - new Date(a.acknowledgedAt))
  }

  async getByStatus(status) {
    await this.delay()
    return this.responses
      .filter(response => response.status === status)
      .map(response => ({ ...response }))
      .sort((a, b) => new Date(b.acknowledgedAt) - new Date(a.acknowledgedAt))
  }

  async create(responseData) {
    await this.delay(400)
    
    const newId = Math.max(...this.responses.map(r => r.Id)) + 1
    
    const newResponse = {
      Id: newId,
      facilityId: responseData.facilityId,
      incidentId: responseData.incidentId,
      acknowledgedAt: new Date().toISOString(),
      responderId: responseData.responderId,
      estimatedArrival: responseData.estimatedArrival,
      status: responseData.status || "acknowledged",
      notes: responseData.notes || ""
    }

    this.responses.unshift(newResponse)
    return { ...newResponse }
  }

  async update(id, updateData) {
    await this.delay()
    
    const index = this.responses.findIndex(response => response.Id === parseInt(id))
    if (index === -1) return null

    this.responses[index] = {
      ...this.responses[index],
      ...updateData
    }

    return { ...this.responses[index] }
  }

  async delete(id) {
    await this.delay()
    
    const index = this.responses.findIndex(response => response.Id === parseInt(id))
    if (index === -1) return false

    this.responses.splice(index, 1)
    return true
  }

  async updateStatus(id, status, notes = "") {
    await this.delay()
    
    const index = this.responses.findIndex(response => response.Id === parseInt(id))
    if (index === -1) return null

    this.responses[index].status = status
    if (notes) {
      this.responses[index].notes = notes
    }

    return { ...this.responses[index] }
  }
}

export const alertResponseService = new AlertResponseService()