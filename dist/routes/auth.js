"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const validateToken_1 = require("../libs/validateToken");
const auth_controller_1 = require("../controller/auth.controller");
router.post("/signin", auth_controller_1.signin);
router.post("/signup", auth_controller_1.signup);
router.get("/profile", validateToken_1.TokenValidation, auth_controller_1.profile);
exports.default = router;
//# sourceMappingURL=auth.js.map