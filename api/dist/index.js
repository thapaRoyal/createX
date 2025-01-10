"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const prisma = new client_1.PrismaClient();
// Create a new user
app.post("/users", async (req, res) => {
    const { name, email } = req.body;
    try {
        const user = await prisma.user.create({
            data: { name, email },
        });
        res.status(201).json(user);
    }
    catch (error) {
        res.status(500).json({ error: "Error creating user" });
    }
});
// Get all users
app.get("/users", async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching users" });
    }
});
// Get a single user by ID
app.get("/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
        });
        if (user) {
            res.status(200).json(user);
        }
        else {
            res.status(404).json({ error: "User not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching user" });
    }
});
// Update a user by ID
app.put("/users/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { name, email },
        });
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ error: "Error updating user" });
    }
});
// Delete a user by ID
app.delete("/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).end();
    }
    catch (error) {
        res.status(500).json({ error: "Error deleting user" });
    }
});
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
