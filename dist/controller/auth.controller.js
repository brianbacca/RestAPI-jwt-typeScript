"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profile = exports.signin = exports.signup = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//reguister
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        //saving a new user
        const user = new User_1.default({
            username: username,
            email: email,
            password: password,
        });
        user.password = yield user.encryptPassword(user.password);
        const savedUser = yield user.save();
        console.log("User Created -->", savedUser);
        //token
        const token = jsonwebtoken_1.default.sign({ _id: savedUser._id }, process.env.TOKEN_SECRET || "tokenTest");
        return res
            .header("auth-token", token)
            .status(200)
            .json({ msg: "The user has been created" });
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ msg: "error at created the user" });
    }
});
exports.signup = signup;
//login
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield User_1.default.findOne({ email: email });
    if (!user)
        return res.status(400).json({ msg: "Email or password is wrong" });
    const correctPassword = yield user.validtePassword(password);
    if (!correctPassword)
        return res.status(400).json({ msg: "Invalidate password" });
    const token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.TOKEN_SECRET || "tokenTest", {
        expiresIn: 60 * 60 * 24,
    });
    return res.header("auth-token", token).json(user);
});
exports.signin = signin;
//Validation profile
const profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(req.userId, { password: 0 });
    if (!user)
        return res.status(400).json({ msg: "No User found" });
    return res.json(user);
});
exports.profile = profile;
//# sourceMappingURL=auth.controller.js.map