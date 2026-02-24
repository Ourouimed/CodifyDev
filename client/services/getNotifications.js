import axiosService from "@/lib/axiosService"

export const getNotifications = async () => {
    try {
        const res = await axiosService.get('/api/notifications')
        return res.data
            }
        catch(err) {
            console.error(err)
        }
    }
