import { Router } from "express";
const router: Router = Router();
import { TokenValidation } from "../libs/validateToken";

import { signin, signup, profile } from "../controller/auth.controller";

router.post("/signin", signin);
router.post("/signup", signup);
router.get("/profile", TokenValidation, profile);

export default router;
