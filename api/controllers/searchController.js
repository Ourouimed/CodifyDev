import User from "../models/User.js";
import Post from "../models/Post.js";

export const fetchSearchRes = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Query is required" });
    }

    // search on users
    const profiles = await User.find({
      $or: [
        { username: { $regex: q, $options: "i" } },
        { displayName: { $regex: q, $options: "i" } }
      ]
    }).select('displayName username avatar bio')


    // search on users
    const posts = await Post.find({
      $or: [
        { content: { $regex: q, $options: "i" } },
        { "codeEditor.code" : { $regex: q, $options: "i" }}
      ]
    }).populate('author', 'username avatar displayName').sort({ createdAt: -1 }).lean();

    const profileMap = profiles.map(user => ({
      ...user.toObject(),
      type: "profile"
    }));


    const postsMap = posts.map(p => ({
      ...p,
      type: "post"
    }));
    
    const searchResults= [...profileMap , ...postsMap]
    res.json(searchResults);

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message });
  }
}