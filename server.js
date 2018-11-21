const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const fs = require('fs')
const pug = require('pug')

// Sätter om inställningarna av view engine, till att använda pug.
app.set('view engine', 'pug')

// Använd för att kunna hämta requests från client.
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'))

// Hämtar todo.json
const todolist = require('./public/json/todo.json')
//console.log("todolistan", todolist)

/**     ROUTES      */

// START
app.get('/', (req, res) => res.render('index', {list: todolist}));


// SEARCH IN URL
app.get('/:search', (req, res) => {
    let search = req.params.search
    let searchedObj = [];
    // Filterar ut varje objekt ur json, matchar något av objekten med vad som skrivs in i url:en. 
    todolist.filter(item => {
        if(item.todo === search){
            searchedObj.push(item)
            res.render('index', { searched: searchedObj})
        }
    })
    res.render('index', { prompt:`din sökning på ${search} hittades inte`, notMatch: search, list: todolist})

})

// SEARCH IN FORM
app.post('/', (req, res) => {
    let search = req.body.todoItem;
    let searchedObj = [];

    todolist.filter(item => {
        if(item.todo === search){
            searchedObj.push(item)
            res.render('index', { searched: searchedObj})
        }
    })

    res.render('index', { prompt:`din sökning på ${search} hittades inte`, notMatch: search, list: todolist})
   })


// ADD NEW NOTES URL
app.get('/add/notes/:todo/:date/:week/:note?', (req, res) => {
    let todo = req.params.todo
    let date = req.params.date
    let week = req.params.week
    let note = req.params.note

    if(note) {
        todolist.push({todo, date, week, note})
        let newJsonNotes = JSON.stringify(todolist, null, 2)

        fs.writeFile('./public/json/todo.json', newJsonNotes, (err) => {
            if(err) throw err;
            res.render('add')
        }) 
    }
})





















app.listen(port, () => console.log(`Example app listening on port ${port}!`))