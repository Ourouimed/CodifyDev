import axiosService from "@/lib/axiosService"

const createPost = async (content) => {
    const respone = await axiosService.post(`/api/posts/create` , {
        content
    })
    return respone.data
}


const getAll = async ()=>{
    const response = await axiosService.get('/api/posts')
    return response.data
}
const postService = {createPost , getAll}
export default postService