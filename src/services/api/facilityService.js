import { getApperClient } from "@/services/apperClient"
import { toast } from "react-toastify"

class FacilityService {
  constructor() {
    this.tableName = "facilities_c"
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
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        console.error("ApperClient not available")
        return []
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "coordinates_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "contact_number_c"}},
          {"field": {"Name": "distance_c"}},
          {"field": {"Name": "response_time_c"}},
          {"field": {"Name": "availability_c"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching facilities:", error?.response?.data?.message || error)
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
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "coordinates_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "contact_number_c"}},
          {"field": {"Name": "distance_c"}},
          {"field": {"Name": "response_time_c"}},
          {"field": {"Name": "availability_c"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching facility ${id}:`, error?.response?.data?.message || error)
      return null
    }
  }

  async getByType(type) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        console.error("ApperClient not available")
        return []
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "coordinates_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "contact_number_c"}},
          {"field": {"Name": "distance_c"}},
          {"field": {"Name": "response_time_c"}},
          {"field": {"Name": "availability_c"}}
        ],
        where: [{
          "FieldName": "type_c",
          "Operator": "EqualTo",
          "Values": [type],
          "Include": true
        }]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching facilities by type:", error?.response?.data?.message || error)
      return []
    }
  }

  async getNearby(coordinates, radiusKm = 10) {
    try {
      const allFacilities = await this.getAll()
      
      return allFacilities
        .map(facility => {
          let facilityCoords
          try {
            facilityCoords = typeof facility.coordinates_c === 'string' ? 
              JSON.parse(facility.coordinates_c) : 
              facility.coordinates_c
          } catch (e) {
            console.warn('Invalid coordinates for facility:', facility.Id)
            return null
          }

          if (!facilityCoords || !facilityCoords.latitude || !facilityCoords.longitude) {
            return null
          }

          const distance = this.calculateDistance(
            coordinates.latitude,
            coordinates.longitude,
            facilityCoords.latitude,
            facilityCoords.longitude
          )
          
          return {
            ...facility,
            distance: distance
          }
        })
        .filter(facility => facility !== null && facility.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance)
    } catch (error) {
      console.error("Error fetching nearby facilities:", error?.response?.data?.message || error)
      return []
    }
  }

  async getAvailable() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        console.error("ApperClient not available")
        return []
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "coordinates_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "contact_number_c"}},
          {"field": {"Name": "distance_c"}},
          {"field": {"Name": "response_time_c"}},
          {"field": {"Name": "availability_c"}}
        ],
        where: [{
          "FieldName": "availability_c",
          "Operator": "EqualTo",
          "Values": ["available"],
          "Include": true
        }]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching available facilities:", error?.response?.data?.message || error)
      return []
    }
  }

  async create(facilityData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        console.error("ApperClient not available")
        return null
      }

      const recordData = {
        Name: facilityData.name,
        type_c: facilityData.type,
        coordinates_c: typeof facilityData.coordinates === 'string' ? 
          facilityData.coordinates : 
          JSON.stringify(facilityData.coordinates),
        address_c: facilityData.address,
        contact_number_c: facilityData.contactNumber,
        response_time_c: facilityData.responseTime || "Unknown",
        availability_c: facilityData.availability || "available"
      }

      if (facilityData.distance !== undefined) {
        recordData.distance_c = parseFloat(facilityData.distance)
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
      console.error("Error creating facility:", error?.response?.data?.message || error)
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
      
      if (updateData.Name !== undefined) recordData.Name = updateData.Name
      if (updateData.type_c !== undefined) recordData.type_c = updateData.type_c
      if (updateData.coordinates_c !== undefined) recordData.coordinates_c = updateData.coordinates_c
      if (updateData.address_c !== undefined) recordData.address_c = updateData.address_c
      if (updateData.contact_number_c !== undefined) recordData.contact_number_c = updateData.contact_number_c
      if (updateData.distance_c !== undefined) recordData.distance_c = parseFloat(updateData.distance_c)
      if (updateData.response_time_c !== undefined) recordData.response_time_c = updateData.response_time_c
      if (updateData.availability_c !== undefined) recordData.availability_c = updateData.availability_c

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
      console.error("Error updating facility:", error?.response?.data?.message || error)
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
      console.error("Error deleting facility:", error?.response?.data?.message || error)
      return false
    }
  }

  async updateAvailability(id, availability) {
    return this.update(id, { availability_c: availability })
  }
}

export const facilityService = new FacilityService()