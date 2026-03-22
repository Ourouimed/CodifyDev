'use client'

import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import FeedLayout from "../FeedLayout"
import { Search, Loader2, Users, FileText } from "lucide-react"
import axiosService from "@/lib/axiosService"
import { useToast } from "@/hooks/useToast"
import Image from "next/image"
import { Button } from "@/components/ui/Button"
import PostCard from "@/components/cards/PostCard"
import Link from "next/link"

const SearchPage = () => {
    const searchParam = useSearchParams()
    const searchQuery = searchParam.get("q")
    
    const [searchRes, setSearchRes] = useState([])
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState('all')

    const toast = useToast()

    useEffect(() => {
        const controller = new AbortController()

        const fetchSearchRes = async () => {
            if (!searchQuery) {
                setSearchRes([])
                return
            }

            setLoading(true)
            try {
                const res = await axiosService.get(`/api/search?q=${searchQuery}`, {
                    signal: controller.signal
                })
                setSearchRes(res.data || [])
            } catch (err) {
                if (err.name !== 'CanceledError') {
                    toast.error("Error fetching results")
                }
            } finally {
                setLoading(false)
            }
        }

        fetchSearchRes()
        return () => controller.abort()
    }, [searchQuery]) 

    const { profiles, posts } = useMemo(() => {
        return {
            profiles: searchRes.filter(s => s.type === 'profile') || [],
            posts: searchRes.filter(s => s.type === 'post') || []
        }
    }, [searchRes])

    return (
        <FeedLayout>
            <div className="">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">
                        {searchQuery ? `Results for "${searchQuery}"` : "Search"}
                    </h1>
                    {!loading && searchQuery && (
                        <p className="text-muted-foreground mt-2">
                            Found {searchRes.length} results
                        </p>
                    )}
                </div>

                {searchRes.length > 0 && !loading && (
                    <div className="flex gap-2 mb-6 border-b border-border pb-2">
                        {['all', 'profiles', 'posts'].map((tab) => (
                            <Button
                                key={tab}
                                variant={activeTab === tab ? "default" : "outline"}
                                size="sm"
                                onClick={() => setActiveTab(tab)}
                                className="capitalize"
                            >
                                {tab}
                            </Button>
                        ))}
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4 text-gray-400">
                        <Loader2 className="animate-spin" size={40} />
                        <p>Searching the archives...</p>
                    </div>
                ) : !searchQuery ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-40">
                        <Search size={60} />
                        <p className="mt-4 text-lg">Type to start searching</p>
                    </div>
                ) : searchRes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-20 border-2 border-border border-dashed rounded-3xl bg-muted/10">
                        <Search size={80} className="text-gray-300 mb-4" />
                        <h3 className="text-xl font-medium">No results found</h3>
                        <p className="text-gray-500 text-center">Try adjusting your keywords or filters.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Profiles */}
                        {(activeTab === 'all' || activeTab === 'profiles') && profiles.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <Users size={20} />
                                    <h4 className="text-xl font-semibold">Profiles</h4>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {profiles.map(p => (
                                        <div key={p._id} className="p-4 rounded-2xl border border-border hover:bg-muted/30 transition flex items-center justify-between">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="relative w-12 h-12 flex-shrink-0">
                                                    <Image
                                                        src={p.avatar || "/default-avatar.png"}
                                                        alt={p.username}
                                                        fill
                                                        className="rounded-full object-cover"
                                                    />
                                                </div>
                                                <div className="truncate">
                                                    <p className="font-semibold truncate">{p.displayName}</p>
                                                    <p className="text-sm text-muted-foreground truncate">@{p.username}</p>
                                                </div>
                                            </div>
                                            <Link href={`/profile/${p.username}`}>
                                                <Button size="sm" variant="outline">View</Button>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Posts */}
                        {(activeTab === 'all' || activeTab === 'posts') && posts.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <FileText size={20} />
                                    <h4 className="text-xl font-semibold">Posts</h4>
                                </div>
                                <div className="space-y-4">
                                    {posts.map(p => (
                                        <PostCard key={p._id} post={p}/>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </FeedLayout>
    )
}

export default SearchPage