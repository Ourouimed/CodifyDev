'use client'
import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import FeedLayout from "../FeedLayout"
import { Search, Loader2 } from "lucide-react"
import axiosService from "@/lib/axiosService"
import { useToast } from "@/hooks/useToast"
import Image from "next/image"
import { Button } from "@/components/ui/Button"

const SearchPage = () => {
    const searchParam = useSearchParams()
    const searchQuery = searchParam.get("q")
    
    const [searchRes, setSearchRes] = useState([])
    const [loading, setLoading] = useState(false)

    const toast = useToast()

    useEffect(() => {
        const fetchSearchRes = async ()=>{
            if (searchQuery) {
                setLoading(true)
                console.log('hhh')
                try {
                    const res = await axiosService.post(`/api/search?q=${searchQuery}`)
                    const data = res.data
                    setSearchRes(data)
                }
                catch (err){
                    toast.error("Error fetching")
                }         
                finally {
                    setLoading(false)
                }
            }
        }

        fetchSearchRes()
    }, [searchQuery]) 

    const resultsToRender = useMemo(()=>{
        const profiles = searchRes.filter(s => s.type === 'profile')
        return {
            profiles : profiles || []
        }
    })

    useEffect(()=>{
        console.log(resultsToRender)
    } , [searchRes])

    return (
        <FeedLayout>
            <div className="p-4">
                <div className="mb-4">
                    <h1 className="text-3xl font-bold tracking-tight">
                        {searchQuery ? `Results for "${searchQuery}"` : "Search"}
                    </h1>
                    {!loading && searchQuery && (
                        <p className="text-muted-foreground mt-2">
                            Found {searchRes.length} results
                        </p>
                    )}
                </div>

                {/* 2. Content States */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center p-20 space-y-4 text-gray-400">
                        <Loader2 className="animate-spin" size={40} />
                        <p>Searching the archives...</p>
                    </div>
                ) : searchRes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-20 border-2 border-border border-dashed rounded-3xl">
                        <Search size={80} className="text-gray-300 mb-4" />
                        <h3 className="text-xl font-medium">No results found</h3>
                        <p className="text-gray-500">Try adjusting your keywords or filters.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {resultsToRender?.profiles && <div>
                            <h4 className="text-xl font-semibold mb-3">
                                Profiles ({resultsToRender.profiles.length})
                            </h4>    
                            <div className="space-y-2">
                                {resultsToRender.profiles.length !== 0 &&
                                    resultsToRender.profiles.map(p => (
                                        <div
                                            key={p._id}
                                            className="p-4 rounded-2xl border border-border hover:bg-muted/50 transition"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    {/* Avatar */}
                                                    <div className="relative w-12 h-12">
                                                        <Image
                                                            src={p.avatar || "/default-avatar.png"}
                                                            alt={p.username}
                                                            fill
                                                            className="rounded-full object-cover"
                                                        />
                                                    </div>

                                                    {/* Info */}
                                                    <div>
                                                        <p className="font-semibold">{p.displayName}</p>
                                                        <p className="text-sm text-muted-foreground">@{p.username}</p>
                                                    
                                                    </div>
                                            </div>

                                            {/* Button */}
                                            <Button
                                                size="sm"
                                                href={`/profile/${p.username}`}
                                            >
                                                View Profile
                                            </Button>
                                            </div>

                                            {p.bio && (
                                                <p className="text-sm text-gray-500 line-clamp-1 mt-3">{p.bio}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                        </div>}
                    </div>
                )}
            </div>
        </FeedLayout>
    )
}

export default SearchPage