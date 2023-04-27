const express = require("express"); // For our API
const mongoose = require("mongoose"); // For our Database
const cors = require("cors");

const app = express();

app.use(express.json()); //lets us use json in our api
app.use(cors()); //helps stop cross origin errors.

//npm i -D nodemon "this allows us to run a server"
// Go to the package.json and add the following in the scripts section "start": "nodemon server.js"

mongoose
    .connect("mongodb://localhost:27017/mern-todo", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("connected to DB"))
    .catch(console.error);

const Todo = require("./models/Todo");

//make a request to 3001/todos then it finds all of the todos we need from the mongoos database.

app.get("/todos", async (req, res) => {
    const todos = await Todo.find();

    res.json(todos);
});

app.post("/todo/new", (req, res) => {
    const todo = new Todo({
        text: req.body.text,
    });

    todo.save();
    res.json();
});

//id is known as url parameter
app.delete('/todo/delete/:id', async(req,res) => {
    // findByIdAndDelete is built into mongoose
    const result = await Todo.findByIdAndDelete(req.params.id);
    res.json(result);
})

app.get('/todo/complete/:id' , async (req,res) => {
    const todo = await Todo.findById(req.params.id);

    todo.complete = !todo.complete;

    todo.save()
    res.json(todo);
})

app.listen(3001, () => console.log("Server started on port 3001"));

//npm start to start server
