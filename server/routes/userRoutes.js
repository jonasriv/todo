import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const JWT_SECRET = "DusteteTokenEllerHva";

const router = express.Router();

//Register-rute: 
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required'});
    }
    try {
        //check if the username already exists: 
        const existingUser = await User.findOne({ username });
        if (existingUser){
            return res.status(400).json({message : 'Username already exists' });
        }

        //Hash the password: 
        const salt = await bcrypt.genSalt(10);
        console.log('Generated salt:', salt);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("Generated password:", hashedPassword);

        //Create a new user: 
        const newUser = new User({
            username, 
            password: hashedPassword, //store hashed password
            tasks: [
                        {taskType: "Med en gang", tasks: [] },
                        {taskType: "Snart", tasks: [] },
                        {taskType: "Om en stund", tasks: [] }
                    ] // Empty tasks array for now
        });

        //Save user to the database: 
        await newUser.save();
        res.status(201).json({ message: 'User registered sucessfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        //FInd the user by username: 
        const user = await User.findOne({ username });
        if(!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        //Compare the provided password with the stored hashed password: 
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password'});
        }

        //Generate a JWT token to be implemented in the next steps: 
        const token = jwt.sign(
            {userId: user._id, username: user.username },
            JWT_SECRET,
            {expiresIn: '1h' }
        );

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/tasks', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('tasks');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error'});
    }
});

router.patch("/tasks/:taskstype/:taskname", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found'});
        }
        const taskType = user.tasks.find(t => t.taskType === req.params.taskstype);
        if (taskType) {
            const task = taskType.tasks.find(t => t.name === req.params.taskname);
            if (task) {
                task.completed = !task.completed;
                await user.save();
                return res.status(200).json({ message: 'Task updated' });
            }
        }
        res.status(404).json({ message: 'Task not found'});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error'});
    }
    
});

router.put("/tasks/:taskstype/:taskname", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found'});
        }
        const taskType = user.tasks.find(t => t.taskType === req.params.taskstype);
        if (taskType){
            const existsTask = taskType.tasks.find(task => task.name === req.params.taskname);
            if (existsTask) {
                return res.status(400).send("Task already exists!");
            }
            taskType.tasks.push({name: req.params.taskname, completed: false});
            await user.save();
            return res.status(201).json({ message: 'Task added'});
        }
        res.status(404).json({ message: 'Task type not found'});
    } catch (err){
        console.error(err);
        return res.status(500).json({ message: 'Server error'});
    }
});

router.delete("/tasks/:taskstype/:taskname", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found'});
        }
        const taskType = user.tasks.find(t => t.taskType === req.params.taskstype);
        if (taskType){
            taskType.tasks = taskType.tasks.filter(task => task.name !== req.params.taskname);
            
            await user.save();
            return res.status(201).json({ message: 'Task deleted successfully'});
        }
        res.status(404).json({ message: 'Task type not found'});
    } catch (err){
        console.error(err);
        return res.status(500).json({ message: 'Server error'});
    }
});

export default router;