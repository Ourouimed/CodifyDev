import axiosService from "@/lib/axiosService"

const create = async (event) => {
    const respone = await axiosService.post(`/api/events/create` , event)
    return respone.data
}


const join = async (id) => {
    const respone = await axiosService.post(`/api/events/join/${id}`)
    return respone.data
}


const get = async () => {
    const respone = await axiosService.get(`/api/events`)
    return respone.data
}



const eventsService = { create , get , join}
export default eventsService