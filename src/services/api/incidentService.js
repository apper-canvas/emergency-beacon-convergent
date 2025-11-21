import incidentsData from "@/services/mockData/incidents.json"

class IncidentService {
  constructor() {
    this.incidents = [...incidentsData]
  }

  // Simulate API delay
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getAll() {
    await this.delay()
    // Sort by timestamp descending (most recent first)
    return this.incidents
      .map(incident => ({ ...incident }))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  async getById(id) {
    await this.delay()
    const incident = this.incidents.find(incident => incident.Id === parseInt(id))
    return incident ? { ...incident } : null
  }

  async getActive() {
    await this.delay()
    return this.incidents
      .filter(incident => incident.status !== "resolved")
      .map(incident => ({ ...incident }))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  async getByStatus(status) {
    await this.delay()
    return this.incidents
      .filter(incident => incident.status === status)
      .map(incident => ({ ...incident }))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  async create(incidentData) {
    await this.delay(500)
    
    const newId = Math.max(...this.incidents.map(i => i.Id)) + 1
    const incidentId = `EMG-${new Date().getFullYear()}-${String(newId).padStart(3, '0')}`
    
    const newIncident = {
      Id: newId,
      id: incidentId,
      timestamp: new Date().toISOString(),
      reporterId: `user-${Math.random().toString(36).substr(2, 9)}`,
      location: incidentData.location,
      coordinates: incidentData.coordinates,
      severity: incidentData.severity,
      accidentType: incidentData.accidentType,
      victimCount: incidentData.victimCount,
      description: incidentData.description || "",
      status: "pending",
      notifiedFacilities: incidentData.notifiedFacilities || [],
      photos: [],
      voiceNotes: []
    }

    this.incidents.unshift(newIncident)
    return { ...newIncident }
  }

  async update(id, updateData) {
    await this.delay()
    
    const index = this.incidents.findIndex(incident => incident.Id === parseInt(id))
    if (index === -1) return null

    this.incidents[index] = {
      ...this.incidents[index],
      ...updateData
    }

    return { ...this.incidents[index] }
  }

  async delete(id) {
    await this.delay()
    
    const index = this.incidents.findIndex(incident => incident.Id === parseInt(id))
    if (index === -1) return false

    this.incidents.splice(index, 1)
    return true
  }

  async updateStatus(id, status) {
    await this.delay()
    
    const index = this.incidents.findIndex(incident => incident.Id === parseInt(id))
    if (index === -1) return null

    this.incidents[index].status = status
    return { ...this.incidents[index] }
  }
}

export const incidentService = new IncidentService()