import { Router } from "express";
import { v1Router } from "./v1";

const rootRouter = Router();

rootRouter.use("/", v1Router);

export default rootRouter;
