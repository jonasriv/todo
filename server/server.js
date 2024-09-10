import 'dotenv/config';
import express from "express";
import userRoutes from "./routes/userRoutes.js";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import authenticateToken from './middleware/auth.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use('/api', userRoutes);

//USE CORS TO ALLOW REQUESTS FROM THE REACT APP: 
app.use(cors());
                  
const mongoURI = 'mongodb+srv://userbruker:userpassord@test.si5gg.mongodb.net/users?retryWrites=true&w=majority';
mongoose.connect(mongoURI, {
    })
    .then(() => console.log('MongoDB connected to Atlas'))
    .catch(err => console.error('MongoDB connection error: ', err));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//USE EXPRESS STATIC TO ACCESS THE BUILD FOLDER IN THE REACT APP: 
app.use(express.static(path.join(__dirname, '../client/my-react-app/dist')));

app.get("*", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../client/my-react-app/dist/index.html'));
});

//port and server running: 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});