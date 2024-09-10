import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    name: {type: String, required: true},
    completed: {type: Boolean, default: false}
});

const userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    tasks: [
        {
            taskType: {type: String, required: true},
            tasks: [taskSchema]
        }
    ]
});

const User = mongoose.model('User', userSchema);

export default User;