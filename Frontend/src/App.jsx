import { use, useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const API_URL = "http://localhost:5000/api/todos";


  const fetchTodos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/todos");
      setTodos(res.data);
    } catch (err) {
      toast.error("Failed to load todos 😭");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);


  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Enter a title!");

    try {
      const res = await axios.post("http://localhost:5000/api/todos", {
        title,
      });
      setTodos([...todos, res.data]);
      fetchTodos();
      setTitle("");
      toast.success("Todo added! ✅");
    } catch {
      toast.error("Error adding todo 💀");
    }
  };

 
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      fetchTodos();
      setTodos(todos.filter((t) => t._id !== id));
      toast.info("Todo deleted 🗑️");
    } catch {
      toast.error("Delete failed 💀");
    }
  };

 
  const toggleTodo = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/todos/${id}`);
      fetchTodos();
      const updatedTodo = res.data.todo;
  
      setTodos(
        todos.map((t) => (t._id === id ? updatedTodo : t))
      );
    } catch {
      toast.error("Toggle failed 💀");
    }
  };
  return (
    <div className="app">
      <h1>📝 Todo List</h1>

      
      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          placeholder="Add a new todo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      
      <ul className="todo-list">
        <AnimatePresence>
          {todos.map((todo) => (
            <motion.li
              key={todo._id}
              className={`todo-item ${todo.completed ? "done" : ""}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <span>{todo.title}</span>

              <div className="todo-actions">
                <button
                  className={`toggle-btn ${todo.completed ? "uncomplete" : "complete"}`}
                  onClick={() => toggleTodo(todo._id)}
                >
                  {todo.completed ? "✓" : "✓"}
                </button>
          
                <button
                  className="delete-btn"
                  onClick={() => deleteTodo(todo._id)}
                >
                  <FaTrash />
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <ToastContainer />
    </div>
  );
}

export default App;
