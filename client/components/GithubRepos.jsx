import { getGithubRepos } from "@/services/getGithubRepos"
import { useEffect, useState } from "react"
import RepoItem from "./ui/RepoItem"
import { Button } from "./ui/Button"
import { Github } from "lucide-react"

const GithubRepos = ({ username }) => {
    const [repos, setRepos] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const reposPerPage = 6 

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const data = await getGithubRepos(username)
            setRepos(data)
            setLoading(false)
        }
        fetchData()
    }, [username])

    const indexOfLastRepo = currentPage * reposPerPage
    const indexOfFirstRepo = indexOfLastRepo - reposPerPage
    const currentRepos = repos.slice(indexOfFirstRepo, indexOfLastRepo)
    const totalPages = Math.ceil(repos.length / reposPerPage)

    if (loading) return <div className="mt-8 text-center animate-pulse">Loading repositories...</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-6">

                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-secondary/80 rounded-xl border border-border shadow-sm">
                        <Github className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg tracking-tight leading-none">Open Source</h3>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">
                            Latest repositories from GitHub
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                        Public Repos
                    </span>
                    <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-bold">
                        {repos?.length || 0}
                    </div>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-1 min-h-[400px]">
                {currentRepos.map(r => <RepoItem repo={r} key={r.id}/>)}
            </div>

            {repos.length > reposPerPage && (
                <div className="flex items-center justify-center gap-4 mt-8 pt-4 border-t border-border">
                    <Button 
                        variant="outline"
                        className='disabled:opacity-50 disabled:cursor-not-allowed'
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    
                    <span className="text-sm text-muted-foreground font-medium">
                        Page {currentPage} of {totalPages}
                    </span>

                    <Button 
                        variant="outline"
                        className='disabled:opacity-50 disabled:cursor-not-allowed'
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    )
}

export default GithubRepos