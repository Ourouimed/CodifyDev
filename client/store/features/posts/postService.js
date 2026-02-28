import axiosService from "@/lib/axiosService"

const createPost = async (data) => {
    const respone = await axiosService.post(`/api/posts/create` , data , {
        headers: { "Content-Type": "multipart/form-data" },
      })
    return respone.data
}


const getAll = async ()=>{
    const response = await axiosService.get('/api/posts')
    return response.data
}

const getFollowingPosts = async ()=>{
    const response = await axiosService.get('/api/posts/following')
    return response.data
}


const likePost = async (postId) => {
    const response = await axiosService.post(`/api/posts/like/${postId}`)
    return response.data
}


const likeComment = async (commentId) => {
    const response = await axiosService.post(`/api/posts/comments/like/${commentId}`)
    return response.data
}

const getSinglePost = async (postId) => {
    const response = await axiosService.get(`/api/posts/post/${postId}`);
    return response.data; 
};

const getPostsByAuthor = async (authorId) => {
    const response = await axiosService.get(`/api/posts/author/${authorId}`);
    return response.data; 
};


const deletePost = async (postId) => {
    const response = await axiosService.delete(`/api/posts/delete/${postId}`);
    return response.data;
};


const addComment = async (postId , comment) => {
    const response = await axiosService.post(`/api/posts/comments/add/${postId}` , {comment});
    return response.data;
};


const postService = {createPost , getAll , likePost, deletePost , addComment ,
                    likeComment , 
                        getSinglePost , getFollowingPosts , getPostsByAuthor}
export default postService