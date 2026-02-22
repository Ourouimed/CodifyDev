import axiosService from "@/lib/axiosService"

export const getProfile = async (username)=>{
    try {
        const res = await axiosService.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile/${username}`)
        console.log(res.data)
        return res.data
    }

    catch (err){
        console.log(err)
    }
}