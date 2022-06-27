import { Router } from "express";
import {createAccount} from '../controllers';

const routes = Router();

routes.post('/accounts/create', createAccount );

export default routes;