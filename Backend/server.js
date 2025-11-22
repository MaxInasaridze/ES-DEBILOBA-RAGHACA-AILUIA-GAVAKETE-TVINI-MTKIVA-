import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

// -------------------------------------------- MIDDLEWARE --------------------------------------------
const app = express();
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// -------------------------------------------- DATABASE CONNECTION --------------------------------------------
async function connectDB() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

connectDB();

// -------------------------------------------- TODO MODEL --------------------------------------------
const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
});

const Todo = mongoose.model("Todo", todoSchema);

// -------------------------------------------- GET ALL TODOS --------------------------------------------
app.get("/api/todos", async (req, res) => {
    try {
        const todos = await Todo.find();
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// -------------------------------------------- CREATE A TODO --------------------------------------------
app.post("/api/todos", async (req, res) => {
    try {
        if (!req.body.title || req.body.title.trim() === "") {
            return res.status(400).json({ message: "Title is required" });
        }

        const newTodo = new Todo({
            title: req.body.title,
            completed: false,
        });

        await newTodo.save();
        res.status(201).json({ message: "Todo created successfully", todo: newTodo });
    } catch (error) {
        res.status(500).json({ message: "server error", error: error.message });
    }
});

// -------------------------------------------- DELETE A TODO --------------------------------------------
app.delete("/api/todos/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const todo = await Todo.findById(id);

        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        await Todo.findByIdAndDelete(id);
        res.status(200).json({ message: "Todo deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "server error" });
    }
});

// -------------------------------------------- UPDATE A TODO (title + completed) --------------------------------------------
app.put("/api/todos/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const todo = await Todo.findById(id);

        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        todo.completed = !todo.completed;

        await todo.save();

        res.status(200).json({ message: "Todo toggled successfully", todo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error" });
    }
});


// -------------------------------------------- START SERVER --------------------------------------------
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
