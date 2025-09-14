import Todo from "../models/todo.model.js";

const createTodo = async(req,res) => {
    try {
        const {title, description} = req.body;
        if(!title){
            return res.status(400).json({
                success: false,
                message: "Please fill out the required details"
            });
        };
    
        const newTodo = await Todo.create({
            title,
            description,
            status: "pending",
            createdBy: req.user._id
        });
    
        if(!newTodo) return res.status(400).json({
            success: false,
            message: "Error creating new Todo"
        })
    
        return res.status(200).json({
            success: true,
            message: "Todo created successfully"
        });
    } catch (error) {
        console.error("Error in createTodo function", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error, please try again later"
        })
    }

};

const getMyTodos = async (req, res) => {
    try {
        const myTodos = await Todo.find({
            createdBy: req.user._id
        });
        if(myTodos.length === 0) return res.status(200).json({
            success: true,
            message: "Your todo list is empty",
            data: []
        });
        return res.status(200).json({
            success: false,
            message: "Todos fetched successfully",
            data: myTodos
        })
    } catch (error) {
        console.error("Error in the getMyTodos function: ", error.message);

        return res.status(500).json({
            success: false,
            message: "Some unknown error occurred"
        })
    }
};

const updateStatusOfTodo = async(req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if(!todo) return res.status(404).json({
            success: false,
            message: "No todo found"
        });
        if(todo.createdBy.toString() !== req.user._id.toString()){
           return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        };
        todo.status = "completed";

        await todo.save();

        res.status(200).json({
            success: true,
            message: "Todo updated successfully",
            data: todo
        });

    } catch(error){
        console.error("Error at udpateStatusOfTodo functioin: ", error.message);
        return res.status(500).json({
            success: false,
            message: "Some unknown error occured, please try again later"
        });
    }
}

const deleteTodo = async(req, res) => {
    try{
        const todo = await Todo.findById(req.params.id);
        if(!todo) return res.status(404).json({
            success: false,
            message: "Todo not found"
        });
        if(todo.createdBy.toString() !== req.user._id.toString()){
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            })
        };
        await todo.deleteOne();
        res.status(200).json({
            success: true,
            message: "Todo deleted successfully"
        });
    } catch(error){
        console.error("Error occured at deleteTodo function: ", error.message);
        return res.status(500).json({
            success: false,
            message: "Unknown error occured, please try again later"
        })
    }
};

export {
    createTodo,
    getMyTodos,
    updateStatusOfTodo,
    deleteTodo,
}