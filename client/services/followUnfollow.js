import axiosService from "@/lib/axiosService"

export const followUnfollow = async (username)=>{
    try {
        const res = await axiosService.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/follow/${username}`)
        console.log(res.data)
        return res.data
    }

    catch (err){
        console.log(err)
    }
}