import User from "../models/User.js";

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

    const profileMap = profiles.map(user => ({
      ...user.toObject(),
      type: "profile"
    }));
    
    const searchResults= [...profileMap]
    res.json(searchResults);

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message });
  }
}