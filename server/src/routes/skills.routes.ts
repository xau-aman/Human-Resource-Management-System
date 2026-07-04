import { Router } from 'express';
import * as skillsController from '../controllers/skills.controller';

const router = Router();

router.get('/', skillsController.getSkills);
router.get('/matrix', skillsController.getSkillsMatrix);

export default router;
