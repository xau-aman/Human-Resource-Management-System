import { Router } from 'express';
import * as skillsController from '../controllers/skills.controller';

const router = Router();

router.get('/', skillsController.getSkills);
router.get('/matrix', skillsController.getSkillsMatrix);
router.get('/gaps', skillsController.getSkillGaps);
router.get('/employee/:employeeId', skillsController.getEmployeeSkillProfile);
router.post('/employee/:employeeId', skillsController.upsertEmployeeSkill);

export default router;
