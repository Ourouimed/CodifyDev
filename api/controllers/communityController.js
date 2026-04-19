import { uploadImage } from "../lib/upload-image.js"
import Community from "../models/Community.js"

const getCommunities = async (req , res)=>{
    try {
        const userId = req.user.id 

        // get Communities feed 
        const AllCoummunities = await Community.find({ visibility : "public" }).populate('creator' , 'username avatar displayName followers').limit(10).sort({ createdAt : -1 })

        const userCommunities = await Community.find({ $or : [
            { creator : userId } ,
            { members : userId}
        ] }).populate('creator' , 'username avatar displayName followers').limit(10).sort({ createdAt : -1 })


        console.log(userCommunities) 
        const resp = {
            Discover : AllCoummunities ,
            Joined : userCommunities
        }

        

        return res.json({ communities : resp})
    }
        

    catch (err) {
        console.log(err)
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
}

const createCommunity = async (req , res)=>{
    try {
        const { name, description, visibility, required_post_approval, required_join_approval } = req.body
        
        if (!name ) {
            return res.status(400).json({ error: "Community name is required" });
        }

        if (!req.file) {
            return res.status(400).json({ error: "Community image is required" });
        }

        const communityImage = await uploadImage(req.file , 'communities')
        const newCommunity = await Community.create(
            {
                name, 
                description,
                visibility,
                required_post_approval,
                required_join_approval,
                communityImage ,
                creator : req.user.id
            }
        )

        console.log(newCommunity)
        
        return res.json({ message: "Community created successfully", community: newCommunity })

    }
    catch (err) {
        console.log(err)
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
}

export { getCommunities , createCommunity }