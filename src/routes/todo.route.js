import { Router } from "express";
import { createTodo, deleteTodo, getMyTodos, updateStatusOfTodo } from "../controllers/todo.controller.js";
import { authorize} from "../middlewares/auth.middleware.js";
const todoRouter = Router();

todoRouter.post('/create-todo', authorize, createTodo)
todoRouter.get('/my-todos', authorize, getMyTodos)
todoRouter.patch('/my-todos/:id/status', authorize, updateStatusOfTodo)
todoRouter.delete('/my-todos/:id/delete',authorize, deleteTodo)

export default todoRouter;