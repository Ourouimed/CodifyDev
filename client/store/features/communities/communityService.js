import axiosService from "@/lib/axiosService"

const create = async (community) => {
    const respone = await axiosService.post(`/api/communities/create` , community , { 
        headers: { "Content-Type": "multipart/form-data" }
    })
    return respone.data
}


const get = async () => {
    const respone = await axiosService.get(`/api/communities`)
    return respone.data
}

const communityService = { create, get }
export default communityService