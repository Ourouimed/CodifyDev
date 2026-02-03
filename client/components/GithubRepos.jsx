import { getGithubRepos } from "@/lib/getGithubRepos"
import { useEffect, useState } from "react"
import RepoItem from "./ui/RepoItem"
import { Button } from "./ui/Button"

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
        <div className="py-4">
            <div className="flex items-center justify-between mb-6 border-b pb-4 border-border">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    Public Repositories
                    <span className="bg-muted text-muted-foreground text-sm py-0.5 px-2 rounded-full border border-border">
                        {repos.length}
                    </span>
                </h3>
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