const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const pug = require('pug')

// Sätter om inställningarna av view engine, till att använda pug.
app.set('view engine', 'pug')

// Använd för att kunna hämta requests från client.
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'))

// Hämtar todo.json
const todolist = require('./public/json/todo.json')
console.log("todolistan", todolist)

/**     ROUTES      */

// START
app.get('/', (req, res) => res.render('index', {list: todolist}));


// SÖK 
app.get('/:search', (req, res) => {
    let search = req.params.search
    let searchedObj= [];

    todolist.filter(item => {
        if(item.todo === search){
            searchedObj.push(item)
            res.render('index', { searched: searchedObj})
        }
    })

    res.render('index', { prompt:`din sökning på ${search} hittades inte`, notMatch: search, list: todolist})

})









app.listen(port, () => console.log(`Example app listening on port ${port}!`))