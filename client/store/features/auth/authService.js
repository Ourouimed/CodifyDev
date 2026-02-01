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



const authService = { register , login , verifySession , logout}
export default authService