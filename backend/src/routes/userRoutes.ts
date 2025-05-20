import express from 'express'
import {UserLogin, UserSignUp} from '../controllers/user_controller'
import {
  project_details,
  getUserProjects,
  updateProject,
  deleteProject
} from '../controllers/project_controller';

const router = express.Router();

router.route('/login').post(UserLogin);
router.route('/signup').post(UserSignUp);
router.route('/project').post(project_details);
router.get('/projects/:userId', getUserProjects);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

// router.get('/test', (req, res) => {
//   res.send('User route working');
// });

// router.get('/signup', (_req, res) => {
//   res.send('Signup endpoint is working! Use POST to actually sign up.');
// });

export default router;
