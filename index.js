const express = require("express");
const { v4: uuidv4 } =  require('uuid');

const app = express();
app.use(express.json());

let tasks = [];

const validations = {
    title: (title)=> {
        if(!title?.length){
            return false;
        }
        return true
    },
    description: (description)=> {
        if(!description?.length){
            return false;
        }
        return true
    },
    status: (status) => {
        if(typeof status == "boolean"){
            return true
        }
        return false
    }
}

app.get("/",(req, res)=>{
    res.status(200).send("Welcome To Task Manager API Application");
})

app.get("/tasks",(req, res)=>{
    res.status(200).json(tasks);
})

app.get("/tasks/:id",(req, res)=>{
    const { id } = req.params
    const task = tasks.find((task)=>task.id === id)

    if(task){
        res.status(200).json(task)
    } else {
        res.status(404).json({message: "task not found."})
    }
})

app.post("/tasks",(req, res)=>{
    const {title, description, status} = req.body;
    const id = uuidv4();
    const newTask = {id, title, description, status};

    if(!validations.title(title)){
        res.status(400).json({message: "invalid title."})
    }
    else if(!validations.description(description)){
        res.status(400).json({message: "invalid description."})
    }
    else if(!validations.status(status)){
        res.status(400).json({message: "invalid status."})
    }
    else{
        tasks.push(newTask);
        res.status(200).json(newTask);
    }

})

app.put("/tasks/:id",(req, res)=>{
    const { id } = req.params
    const updateTask = req.body;
    let taskUpdated = false;

    const attrsToUpdate = Object.keys(updateTask);
    if(attrsToUpdate.includes(title) && !validations.title(updateTask.title)){
        res.status(400).json({message: "invalid title."})
    }
    else if(attrsToUpdate.includes(description) && !validations.description(updateTask.description)){
        res.status(400).json({message: "invalid description."})
    }
    else if(attrsToUpdate.includes(status) && !validations.status(updateTask.status)){
        res.status(400).json({message: "invalid status."})
    }
    else{
        tasks.forEach(task => {
            if (task.id === id) { // match
                Object.keys(updateTask).forEach(key => {
                    if (key in task && key !== id) {
                        task[key] = updateTask[key]
                    }
                })
            }
            taskUpdated = true;
        });
    
        if(taskUpdated) {
            const updatedTask = tasks.find((task)=>task.id === id);
            res.status(200).json(updatedTask)
        } else {
            res.status(404).json({message: "task not found."})
        }
    }

})

app.delete("/tasks/:id",(req, res)=>{
    const { id } = req.params
    const task = tasks.find((task)=>task.id === id)

    tasks = tasks.filter((task)=>task.id !== id)

    if(task){
        res.status(200).json(task)
    } else {
        res.status(404).json({message: "task not found."})
    }
})


const PORT = 5000
app.listen(PORT, () => {
    console.log("Server started at port " + PORT);
})