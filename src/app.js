import express from "express"
import authRouter from "./routes/auth.route.js";
import todoRouter from "./routes/todo.route.js";
const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/auth', authRouter);
app.use('/api/todos', todoRouter);

app.get('/', (req, res) => {
    res.status(200).json({
        name: "Todo-API",
        baseURL: "/api",
        status: "running",
        endpoints: {
            register: "POST /api/auth/register",
            login: " POST /api/auth/login",
            createtodo: "POST /api/todos/create-todo",
            getMyTodos: "GET /api/todos/my-todos",
            updateStatus: "PATCH /api/todos/my-todos/:id/status",
            deleteTodo: "DELETE /api/todos/my-todos/:id/delete"
        }
    })
    console.log("HELLO")
})

export default app;
