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


const likePost = async (postId) => {
    const response = await axiosService.post(`/api/posts/like/${postId}`)
    return response.data
}

const getSinglePost = async (postId) => {
    const response = await axiosService.get(`/api/posts/post/${postId}`);
    return response.data; 
};
const postService = {createPost , getAll , likePost, getSinglePost}
export default postService