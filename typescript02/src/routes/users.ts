import {Router} from 'express';
import { createUserController } from '../controllers';

const routes = Router();

routes.post('/users/create', createUserController);

export default routes;