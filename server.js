const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const fs = require('fs')
const pug = require('pug')
const path = require('path')

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
  // Filterar ut varje objekt ur json, matchar något av objekten med vad som skrivs in i formuläret. 
    todolist.filter(item => {
        if(item.todo === search){
            searchedObj.push(item)
            res.render('index', { searched: searchedObj})
        }
    })

    res.render('index', { prompt:`din sökning på ${search} hittades inte`, notMatch: search, list: todolist})
   })


// ADD NEW NOTES URL
app.get('/add/notes/:todo/:date/:note?', (req, res) => {
    let todo = req.params.todo
    let date = req.params.date
    let note = req.params.note

// Pushar in et nytt objekt till todolist 
    if(note) {
        todolist.push({todo, date, note})
        let newJsonNotes = JSON.stringify(todolist, null, 2)

        fs.writeFile('./public/json/todo.json', newJsonNotes, (err) => {
            if(err) throw err;
            res.render('add')
        }) 
    }
})

// ROUTE TO ADD-FORM
app.get('/add/notes', (req, res) => {  
    res.render('add')
})

// ADD NEW NOTES FROM FORM 
app.post('/add/notes', (req, res) => {
    let todo = req.body.newtodo
    let date = req.body.newdate
    let note = req.body.newnote

// Pushar in et nytt objekt till todolist 
    if(note) {
        todolist.push({todo, date, note})
            let newJsonNotes = JSON.stringify(todolist, null, 2)

        fs.writeFile('./public/json/todo.json', newJsonNotes, (err) => {
            if(err) throw err;
            
        }) 
        res.redirect('/')
        
    } else {  
        res.render('add', {message: 'Vänligen fyll i alla fällt'})
    }
})


// REMOVE NOTES IN URL
app.get('/remove/notes/:removenote', (req, res) => {
    let removenote = req.params.removenote
   
    // Filtrerar ut alla objekt i listan som inte matchar det som skrivs in i url:en och sparar i en ny array och skriver sedan om todolist
    let array = todolist.filter(item => item.todo !== removenote)

    let newJsonNotes = JSON.stringify(array, null, 2)

        fs.writeFile('./public/json/todo.json', newJsonNotes, (err) => {
            if(err) throw err; 
            
        })
    
        res.redirect('/')
})

// REMOVE IN CLIENT
app.post('/delete/note', (req, res) => {
    let removenote = req.body.removenote   

        // Filtrerar ut alla objekt i listan som inte matchar det som skrivs in i url:en och sparar i en ny array och skriver sedan om todolist
        let array = todolist.filter(item => item.todo !== removenote)
        let newJsonNotes = JSON.stringify(array, null, 2)

        fs.writeFileSync('./public/json/todo.json', newJsonNotes, (err) => {
            if(err) throw err;  
            
        })

        res.redirect('/')
        res.render('index', {list: array})
      
})


// UPDTATE IN URL
app.get('/update/notes/:updatenote/:note?', (req, res) => {
    let updatenote = req.params.updatenote
    let newnote = req.params.note

    // Filtrar ut det objekt som har samma "todo" som det som skrivs in i url:en
    
    let change = todolist.filter(item => item.todo === updatenote)

    if(change) {

    // Uppdaterar objektet som har det index som filtreras ut och uppdaterar med newnote. 
       let objIndex = todolist.findIndex((obj => obj.todo === updatenote))

       todolist[objIndex].note = newnote
        
        let newJsonNotes = JSON.stringify(todolist, null, 2)

        fs.writeFileSync('./public/json/todo.json', newJsonNotes, (err) => {
            if(err) throw err;  
          
        })
        res.redirect('/')
  
    }
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))