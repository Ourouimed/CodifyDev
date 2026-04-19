'use client'
import { Compass, Plus, Users } from "lucide-react"
import FeedLayout from "../FeedLayout"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/Button"
import { usePopup } from "@/hooks/usePopup"
import { useCommunity } from "@/hooks/useCommunity"
import { useDispatch } from "react-redux"
import { getCommunities } from "@/store/features/communities/communitySlice"
import CommunityCard from "@/components/cards/CommunityCard"

const CommunitiesPage = () => {
    const filters = [{text : 'Discover' , icon : Compass} , {text : 'Joined' ,icon : Users}]
    const [filterType , setFilterType] = useState(filters[0].text)

    const { openPopup } = usePopup()
    const dispatch = useDispatch()
    const { isLoading , communities} = useCommunity() 

    useEffect(()=>{
            dispatch(getCommunities())
    } , [])
    const handleOpenCommunityPopup = ()=>{
        openPopup({title : 'Create community' , component : 'CreateCommunityPopup'})
    }


    if (isLoading) return <FeedLayout>
        Loading Communities...
    </FeedLayout>


    return <FeedLayout>
        <div>
            <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h1 className="text-3xl font-bold tracking-tight">
                                    Communities
                                </h1> 
                                <p className="text-gray-400">
                                    Discover experiences or host your own event.
                                </p>
                            </div>
                            <Button size="sm" onClick={handleOpenCommunityPopup}>
                                Create new community <Plus size={14}/>
                            </Button>
            </div>

            <div className="inline-flex items-center gap-2 p-2 bg-border/40 border border-border rounded-lg my-4">
                {filters.map(({text , icon : Icon}) => 
                <button key={text} className={`flex items-center gap-1 px-4 py-2 hover:bg-border/60 transition duration-300 rounded-md cursor-pointer 
                                            ${filterType === text ? 'bg-border/60' : ''}`} 
                                            onClick={()=> setFilterType(text)}>
                    <Icon size={14}/>
                    <span className="text-xs">{text}</span>
                </button>)}
                
               
            </div>

            <div className="space-y-2">
                {communities?.[filterType]?.length === 0 ? <div className='flex items-center justify-center flex-col gap-2 py-10 rounded-xl border-2 border-dashed border-border border-border'>
                        <Users size={48} className="mx-auto mb-4 text-gray-400"/>
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                            {filterType === 'Joined' ? `You have not joined any communities yet` : `No communities found`}
                        </h2>
                        <p className="text-gray-500 max-w-xl text-center"> 
                            It seems there are no communities to show. Try changing the filter or create a new community.
                        </p>
                        <Button onClick={handleOpenCommunityPopup}>Create new community</Button>
                </div> 
                : <div className="grid grid-cols sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {communities?.[filterType]?.map(c => <CommunityCard key={c._id} community={c}/>)}    
                </div>} 
            </div>
        </div>
    </FeedLayout>
}

export default CommunitiesPage