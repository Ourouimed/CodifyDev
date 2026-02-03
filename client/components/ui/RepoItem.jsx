import { ForkKnife, GitFork, Star } from "lucide-react"
import { Badge } from "./Badge"

const RepoItem = ({repo})=>{
    return  <div className="group bg-background shadow-md border border-border rounded-xl p-5 hover:border-primary/50 transition-all shadow-sm hover:shadow-md">
                        <div className="flex items-start justify-between">
                            <div className="space-y-3">
                                <h4 className="text-lg font-bold text-primary hover:underline cursor-pointer">
                                    <a href={repo.html_url} target="_blank" rel="noreferrer">{repo.name}</a>
                                </h4>
                                <p className="text-muted-foreground text-sm line-clamp-2">
                                    {repo.description || 'No description provided for this repository.'}
                                </p>

                                {repo.topics.length !== 0 && (
                                    <div className="inline-flex gap-2 items-center flex-wrap">
                                        {repo.topics.map((topic , i) => (
                                            <Badge text={topic} key={`${topic}-${i}`}/>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <span className="text-[10px] uppercase tracking-wider font-medium py-1 px-2 border border-border rounded-md bg-muted text-muted-foreground">
                                {repo.visibility || 'Public'}
                            </span>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-4">
                                {repo.language && (
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-3 h-3 rounded-full bg-primary/60" />
                                        {repo.language}
                                    </div>
                                )}
                                <div className="flex items-center gap-1">
                                    <span><Star className="text-yellow-500" size={14}/></span> {repo.stargazers_count || 0}
                                </div>
                                
                                <div className="flex items-center gap-1">
                                    <span><GitFork size={14}/></span> {repo.forks || 0} 
                                </div>
                            </div>


                            <div className="text-xs">
                                Updated {new Date(repo.updated_at).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
}

export default RepoItem