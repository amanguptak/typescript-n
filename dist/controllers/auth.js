"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const bcrypt_1 = require("bcrypt");
const register = async (req, res) => {
    const { name, email, password, phoneNumber } = req.body;
    console.log(req.body, "data otuput");
    try {
        let user = await prisma_1.default.user.findFirst({
            where: {
                email,
            },
        });
        if (user) {
            return res.status(400).json({ message: "User Already Exists" });
        }
        user = await prisma_1.default.user.create({
            data: {
                name,
                email,
                password: (0, bcrypt_1.hashSync)(password, 10),
                phoneNumber,
            },
        });
        const { password: _, ...newUser } = user;
        return res
            .status(201)
            .json({ message: "user registerd succesfully", user: newUser });
    }
    catch (err) {
        console.log(err);
        return res.status(500);
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma_1.default.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }
        if (!(0, bcrypt_1.compareSync)(password, user.password)) {
            return res.status(400).json({ message: "Wrong Details" });
        }
    }
    catch (err) {
        console.log(err);
    }
};
exports.login = login;
