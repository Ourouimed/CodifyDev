import axiosService from "@/lib/axiosService"

const register = async (data) => {
    console.log(process.env.NEXT_PUBLIC_API_URL)
    const respone = await axiosService.post(`/api/auth/register` , data)
    return respone.data
}


const login = async (data) => {
    const respone = await axiosService.post(`/api/auth/login` , data)
    return respone.data
}


const verifySession = async ()=>{
    const respone = await axiosService.get(`/api/auth/verify-session`)
    return respone.data
}


const logout = async ()=>{
    const respone = await axiosService.post(`/api/auth/logout`)
    return respone.data
}



const setEmail = async (email)=>{
    const respone = await axiosService.post(`/api/auth/setEmail` , {email})
    return respone.data
}


const setPassword = async (password)=>{
    const respone = await axiosService.post(`/api/auth/setPassword` , password)
    return respone.data
}

const deleteAccount = async ()=>{
    const respone = await axiosService.delete(`/api/auth/account/delete`)
    return respone.data
}

const updateProfile = async (data)=>{
    const respone = await axiosService.post('/api/auth/profile/update' , data , {
        headers: { "Content-Type": "multipart/form-data" },
      })
    return respone.data
}



const authService = { register , login , verifySession , 
                logout , updateProfile , setEmail , setPassword , deleteAccount}
export default authService