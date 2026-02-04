import axios from "axios"

export const getGithubRepos = async (username)=>{
    try {
        const res = await axios.get(`https://api.github.com/users/${username}/repos?sort=updated&direction=desc`)
        return res.data
    }

    catch (err){
        console.log(err)
    }
}