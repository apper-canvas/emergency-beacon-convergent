import { getApperClient } from "@/services/apperClient"
import { toast } from "react-toastify"

class IncidentService {
  constructor() {
    this.tableName = "incidents_c"
  }

  async getAll() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        console.error("ApperClient not available")
        return []
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "coordinates_c"}},
          {"field": {"Name": "severity_c"}},
          {"field": {"Name": "accident_type_c"}},
          {"field": {"Name": "victim_count_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notified_facilities_c"}},
          {"field": {"Name": "photos_c"}},
          {"field": {"Name": "voice_notes_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching incidents:", error?.response?.data?.message || error)
      return []
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        console.error("ApperClient not available")
        return null
      }

      const response = await apperClient.getRecordById(this.tableName, id, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "coordinates_c"}},
          {"field": {"Name": "severity_c"}},
          {"field": {"Name": "accident_type_c"}},
          {"field": {"Name": "victim_count_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notified_facilities_c"}},
          {"field": {"Name": "photos_c"}},
          {"field": {"Name": "voice_notes_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching incident ${id}:`, error?.response?.data?.message || error)
      return null
    }
  }

  async getActive() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        console.error("ApperClient not available")
        return []
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "coordinates_c"}},
          {"field": {"Name": "severity_c"}},
          {"field": {"Name": "accident_type_c"}},
          {"field": {"Name": "victim_count_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notified_facilities_c"}},
          {"field": {"Name": "photos_c"}},
          {"field": {"Name": "voice_notes_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{
          "FieldName": "status_c",
          "Operator": "NotEqualTo",
          "Values": ["resolved"],
          "Include": true
        }],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching active incidents:", error?.response?.data?.message || error)
      return []
    }
  }

  async getByStatus(status) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        console.error("ApperClient not available")
        return []
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "coordinates_c"}},
          {"field": {"Name": "severity_c"}},
          {"field": {"Name": "accident_type_c"}},
          {"field": {"Name": "victim_count_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notified_facilities_c"}},
          {"field": {"Name": "photos_c"}},
          {"field": {"Name": "voice_notes_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{
          "FieldName": "status_c",
          "Operator": "EqualTo",
          "Values": [status],
          "Include": true
        }],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching incidents by status:", error?.response?.data?.message || error)
      return []
    }
  }

  async create(incidentData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        console.error("ApperClient not available")
        return null
      }

      // Prepare data with only Updateable fields
      const recordData = {
        Name: `EMG-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
        location_c: typeof incidentData.location === 'string' ? incidentData.location : JSON.stringify(incidentData.location),
        coordinates_c: typeof incidentData.coordinates === 'string' ? incidentData.coordinates : JSON.stringify(incidentData.coordinates),
        severity_c: incidentData.severity,
        accident_type_c: incidentData.accidentType,
        victim_count_c: parseInt(incidentData.victimCount),
        status_c: "pending"
      }

      // Add optional fields if they exist
      if (incidentData.description) {
        recordData.description_c = incidentData.description
      }
      if (incidentData.notifiedFacilities) {
        recordData.notified_facilities_c = typeof incidentData.notifiedFacilities === 'string' ? 
          incidentData.notifiedFacilities : 
          JSON.stringify(incidentData.notifiedFacilities)
      }
      if (incidentData.photos) {
        recordData.photos_c = incidentData.photos
      }
      if (incidentData.voiceNotes) {
        recordData.voice_notes_c = incidentData.voiceNotes
      }

      const response = await apperClient.createRecord(this.tableName, {
        records: [recordData]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          return successful[0].data
        }
      }

      return null
    } catch (error) {
      console.error("Error creating incident:", error?.response?.data?.message || error)
      return null
    }
  }

  async update(id, updateData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        console.error("ApperClient not available")
        return null
      }

      const recordData = { Id: parseInt(id) }
      
      // Add only fields that are being updated
      if (updateData.location_c !== undefined) recordData.location_c = updateData.location_c
      if (updateData.coordinates_c !== undefined) recordData.coordinates_c = updateData.coordinates_c
      if (updateData.severity_c !== undefined) recordData.severity_c = updateData.severity_c
      if (updateData.accident_type_c !== undefined) recordData.accident_type_c = updateData.accident_type_c
      if (updateData.victim_count_c !== undefined) recordData.victim_count_c = parseInt(updateData.victim_count_c)
      if (updateData.description_c !== undefined) recordData.description_c = updateData.description_c
      if (updateData.status_c !== undefined) recordData.status_c = updateData.status_c
      if (updateData.notified_facilities_c !== undefined) recordData.notified_facilities_c = updateData.notified_facilities_c
      if (updateData.photos_c !== undefined) recordData.photos_c = updateData.photos_c
      if (updateData.voice_notes_c !== undefined) recordData.voice_notes_c = updateData.voice_notes_c

      const response = await apperClient.updateRecord(this.tableName, {
        records: [recordData]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          return successful[0].data
        }
      }

      return null
    } catch (error) {
      console.error("Error updating incident:", error?.response?.data?.message || error)
      return null
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        console.error("ApperClient not available")
        return false
      }

      const response = await apperClient.deleteRecord(this.tableName, {
        RecordIds: [parseInt(id)]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successful.length > 0
      }

      return false
    } catch (error) {
      console.error("Error deleting incident:", error?.response?.data?.message || error)
      return false
    }
  }

  async updateStatus(id, status) {
    return this.update(id, { status_c: status })
  }
}

export const incidentService = new IncidentService()