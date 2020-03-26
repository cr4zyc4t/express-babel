import { Router } from 'express';

const userRouter = Router();
/* GET users listing. */
userRouter.get('/', function (req, res) {
	res.send('respond with a resource');
});

export default userRouter;