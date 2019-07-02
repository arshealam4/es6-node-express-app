import express from 'express';
const router = express.Router();
import userController from '../controllers/userController';

/* GET users listing. */
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/user-list/:perPage?/:page?', userController.getUserList);

export default router
