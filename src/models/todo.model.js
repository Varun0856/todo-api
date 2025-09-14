import { model, Schema } from "mongoose";

const todoSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "Title is required"],
        minLength: 5,
        maxLength: 40,
    },
    description: {
        type: String,
        trim: true,
    }, 
    status: {
        type: String,
        required: true,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const Todo = model('Todo', todoSchema);

export default Todo;