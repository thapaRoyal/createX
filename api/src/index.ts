import { PrismaClient, User } from "@prisma/client";
import cors from "cors";
import express, { Request, Response } from "express";

const app = express();
app.use(express.json());
app.use(cors());

const prisma = new PrismaClient();

// Define the types for the request body to ensure type safety
interface CreateUserRequest {
  name: string;
  email: string;
}

interface UpdateUserRequest {
  name?: string;
  email?: string;
}

// Create a new user
app.post("/users", async (req: Request<CreateUserRequest>, res: Response) => {
  const { name, email } = req.body;
  try {
    const user: User = await prisma.user.create({
      data: { name, email },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error creating user" + error });
  }
});

// Get all users
app.get("/users", async (req: Request, res: Response) => {
  try {
    const users: User[] = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" + error });
  }
});

// Get a single user by ID
app.get("/users/:id", async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  try {
    const user: User | null = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" + error });
  }
});

// Update a user by ID
app.put(
  "/users/:id",
  async (req: Request<{ id: string }, UpdateUserRequest>, res: Response) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
      const user: User = await prisma.user.update({
        where: { id: parseInt(id) },
        data: { name, email },
      });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "Error updating user" + error });
    }
  }
);

// Delete a user by ID
app.delete(
  "/users/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    try {
      await prisma.user.delete({
        where: { id: parseInt(id) },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Error deleting user" + error });
    }
  }
);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
