import express from 'express';
import { getMentors } from '../controllers/userController.js';


const router = express.Router();

router.get('/mentors', getMentors);

// ✅ IMPORTANT FIX
export default router;