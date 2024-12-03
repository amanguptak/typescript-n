"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const authRoutes = (0, express_1.Router)();
authRoutes.post('/register', auth_1.register);
authRoutes.post('/login', auth_1.login);
exports.default = authRoutes;
