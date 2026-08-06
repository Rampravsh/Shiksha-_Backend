import helmet from "helmet";
import cors from "cors";
import { helmetConfig } from "../config/helmet";
import { corsConfig } from "../config/cors";

export const helmetMiddleware = helmet(helmetConfig);
export const corsMiddleware = cors(corsConfig);
