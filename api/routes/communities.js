import express from "express"
import verifyJWT from '../middlewares/verifyJWT.js';
import { createCommunity, getCommunities } from "../controllers/communityController.js";
import multer from "multer";
const router = express.Router()


// Use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage }); 



router.get("/" , verifyJWT , getCommunities);
router.post("/create" , verifyJWT ,  upload.single('community_image'), createCommunity);

export default router