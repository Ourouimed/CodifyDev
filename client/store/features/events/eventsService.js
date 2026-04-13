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


const accept_attendee = async (eventId , userId) => {
    const respone = await axiosService.post(`/api/events/accept_attendee/${eventId}` , {userId})
    return respone.data
}

const deleteEvent = async (eventId) => {
    const response = await axiosService.delete(`/api/events/delete/${eventId}`);
    return response.data;
};



const eventsService = { create , get , join , accept_attendee , deleteEvent}
export default eventsService