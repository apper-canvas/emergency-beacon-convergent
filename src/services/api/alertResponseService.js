import { getApperClient } from "@/services/apperClient"
import { toast } from "react-toastify"

class AlertResponseService {
  constructor() {
    this.tableName = "alertResponses_c"
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
          {"field": {"Name": "incident_id_c"}},
          {"field": {"Name": "facility_id_c"}},
          {"field": {"Name": "acknowledged_at_c"}},
          {"field": {"Name": "responder_id_c"}},
          {"field": {"Name": "estimated_arrival_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        orderBy: [{"fieldName": "acknowledged_at_c", "sorttype": "DESC"}]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching alert responses:", error?.response?.data?.message || error)
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
          {"field": {"Name": "incident_id_c"}},
          {"field": {"Name": "facility_id_c"}},
          {"field": {"Name": "acknowledged_at_c"}},
          {"field": {"Name": "responder_id_c"}},
          {"field": {"Name": "estimated_arrival_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching alert response ${id}:`, error?.response?.data?.message || error)
      return null
    }
  }

  async getByIncident(incidentId) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        console.error("ApperClient not available")
        return []
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "incident_id_c"}},
          {"field": {"Name": "facility_id_c"}},
          {"field": {"Name": "acknowledged_at_c"}},
          {"field": {"Name": "responder_id_c"}},
          {"field": {"Name": "estimated_arrival_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        where: [{
          "FieldName": "incident_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(incidentId)],
          "Include": true
        }],
        orderBy: [{"fieldName": "acknowledged_at_c", "sorttype": "DESC"}]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching responses by incident:", error?.response?.data?.message || error)
      return []
    }
  }

  async getByFacility(facilityId) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        console.error("ApperClient not available")
        return []
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "incident_id_c"}},
          {"field": {"Name": "facility_id_c"}},
          {"field": {"Name": "acknowledged_at_c"}},
          {"field": {"Name": "responder_id_c"}},
          {"field": {"Name": "estimated_arrival_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        where: [{
          "FieldName": "facility_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(facilityId)],
          "Include": true
        }],
        orderBy: [{"fieldName": "acknowledged_at_c", "sorttype": "DESC"}]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching responses by facility:", error?.response?.data?.message || error)
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
          {"field": {"Name": "incident_id_c"}},
          {"field": {"Name": "facility_id_c"}},
          {"field": {"Name": "acknowledged_at_c"}},
          {"field": {"Name": "responder_id_c"}},
          {"field": {"Name": "estimated_arrival_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        where: [{
          "FieldName": "status_c",
          "Operator": "EqualTo",
          "Values": [status],
          "Include": true
        }],
        orderBy: [{"fieldName": "acknowledged_at_c", "sorttype": "DESC"}]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching responses by status:", error?.response?.data?.message || error)
      return []
    }
  }

  async create(responseData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        console.error("ApperClient not available")
        return null
      }

      const recordData = {
        Name: `Response-${Date.now()}`,
        incident_id_c: parseInt(responseData.incidentId),
        facility_id_c: parseInt(responseData.facilityId),
        acknowledged_at_c: responseData.acknowledgedAt || new Date().toISOString(),
        responder_id_c: responseData.responderId,
        status_c: responseData.status || "acknowledged"
      }

      if (responseData.estimatedArrival) {
        recordData.estimated_arrival_c = responseData.estimatedArrival
      }
      if (responseData.notes) {
        recordData.notes_c = responseData.notes
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
      console.error("Error creating alert response:", error?.response?.data?.message || error)
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
      
      if (updateData.incident_id_c !== undefined) recordData.incident_id_c = parseInt(updateData.incident_id_c)
      if (updateData.facility_id_c !== undefined) recordData.facility_id_c = parseInt(updateData.facility_id_c)
      if (updateData.acknowledged_at_c !== undefined) recordData.acknowledged_at_c = updateData.acknowledged_at_c
      if (updateData.responder_id_c !== undefined) recordData.responder_id_c = updateData.responder_id_c
      if (updateData.estimated_arrival_c !== undefined) recordData.estimated_arrival_c = updateData.estimated_arrival_c
      if (updateData.status_c !== undefined) recordData.status_c = updateData.status_c
      if (updateData.notes_c !== undefined) recordData.notes_c = updateData.notes_c

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
      console.error("Error updating alert response:", error?.response?.data?.message || error)
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
      console.error("Error deleting alert response:", error?.response?.data?.message || error)
      return false
    }
  }

  async updateStatus(id, status, notes = "") {
    const updateData = { status_c: status }
    if (notes) {
      updateData.notes_c = notes
    }
    return this.update(id, updateData)
  }
}

export const alertResponseService = new AlertResponseService()