const express = require('express')
const mongoose = require('mongoose')
const app = express()

mongoose.connect('mongodb://localhost:27017/todo').then(()=>{
    console.log('connected to  mongodb')
}).catch((e)=>{
    console.log('failed to connect to mongodb')
})


app.use(express.urlencoded())
app.use(express.static(__dirname+'/public'));

const TodoSchema = new mongoose.Schema({
    title: String,
    description: String,

})

const ToDo = mongoose.model("todo", TodoSchema)

app.post('/new', async(req, res) => {req.body.title
    if(req.body.title.length != 0){
        await new ToDo({
            title: req.body.title,
            description: req.body.description
        }).save()
        res.redirect('/')
    }
    else {
        res.redirect('/new?error=1')
    }
})

app.post('/edit', async(req, res) => {
    console.log(req.body._id)
    await ToDo.updateOne(
        {_id:req.body.id},
        {
            title: req.body.title,
            description: req.body.description
        }
    )
    res.redirect('/')
})
app.delete('/delete/:id', async(req, res) =>{
    await ToDo.deleteOne({_id: req.params.id})
    res.status(200).send('ok')
})
app.set("view engine", "ejs")


// app.get - отправляет get запрос
// res.render - как я понял он отображает страничку
app.get('/', async (req, res) => {
    const data = await ToDo.find()
    res.render("index", {data})
})

app.get('/new', (req, res) => {
    res.render("new")
})

app.get('/edit/:id', async(req, res) => {
    const ToDoData = await ToDo.findById(req.params.id)
    res.render("edit", {data: ToDoData})
    console.log({data: ToDoData})
})

const PORT = 8000
app.listen(PORT, ()=> {
    console.log(`listening on PORT : ${PORT}`)
})