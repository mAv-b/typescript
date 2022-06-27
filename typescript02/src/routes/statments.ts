import { Router } from "express";
import { statmentsController } from "../controllers";

const routes = Router();

routes.get('/statments', statmentsController);

export default routes;