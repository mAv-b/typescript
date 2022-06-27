import { Router } from "express";
import { deposit, withdraw,transfer } from "../controllers";

const routes = Router();

routes.post('/transactions/deposit', deposit);
routes.post('/transactions/withdraw', withdraw);
routes.post('/transactions/transfer', transfer);

export default routes;