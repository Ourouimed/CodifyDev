import axiosService from "@/lib/axiosService"

const create = async (event) => {
    const respone = await axiosService.post(`/api/events/create` , event)
    return respone.data
}

const eventsService = { create }
export default eventsService