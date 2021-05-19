const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session')
const MongoDBSession = require('connect-mongodb-session')(session)

// Load in the mongoose models
const { Task } = require('./db/models/task.model');
const { User } = require('./db/models/user.model');

// DB connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TaskManager', { useNewUrlParser: true }).then(() => {
    console.log("Connected to MongoDB successfully!");
}).catch((e) => {
    console.log("Error while attempting to connect to MongoDB");
    console.log(e);
});

// To prevent deprectation warnings (from MongoDB native driver)
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

// set place for sessions to be stored
const save_session = new MongoDBSession({
    uri: 'mongodb+srv://christian:WtAss3RC75@cluster0.b3wqm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    collection: 'sessions'
  })


/* MIDDLEWARE  */

// parser
app.use(express.urlencoded({ extended: false }))

// CORS HEADERS MIDDLEWARE
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");

    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );

    next();
})

// session middleware
app.use(
    session({
        secret: "myRandomSecret123",
        resave: false,
        saveUninitialized: false,
        store: save_session
    })
)

// authentication check
const authenticationCheck = (req, res, next) => {
    if(req.session.isAuthenticated) {
        next()
    } else {
        res.redirect('/login')
    }
}

/* END MIDDLEWARE  */


/* ROUTE HANDLERS */


/* TASK ROUTES */

/**
 * GET /tasks
 * Purpose: View all tasks
 */
app.get('/tasks', authenticationCheck, (req, res) => {
    Task.find({
        // all tasks
        // where user = session user
        // where filter
    }).then((tasks) => {
        res.send(tasks)
    })
})


/**
 * POST /tasks
 * Purpose: Create a new task
 */
app.post('/tasks', authenticationCheck, (req, res) => {
    let newTask = new Task({
        title: req.body.title,
        description: req.body.description,
        completeBy: req.body.completeBy,
        priority: req.body.priority,
        users: req.body.users // array of user references
    })

    newTask.save()
})

// GET /tasks/:slug
// Purpose: View a task (including description etc)
app.get('/tasks/:slug', authenticationCheck, (req,res) => {
    Task.find({
        slug: req.params.slug
    }).then((task) => {
        res.send(task)
    })
})


/**
 * PATCH /tasks/:slug
 * Purpose: Update an existing task
 */
app.patch('/tasks/:slug', authenticationCheck, (req, res) => {
    Task.findOneAndUpdate({
        slug: req.params.slug
    }, {
        $set: req.body // might not be working, might have to set fields individually
    })
})

/**
 * DELETE /tasks/:taskId
 * Purpose: Delete a task
 */
app.delete('/tasks/:taskId', authenticationCheck, (req, res) => {
    Task.findOneAndRemove({
        slug: req.body.slug
    })
})


/* USER ROUTES */

// POST /register
// Purpose: Sign up
app.post('/register', (req, res) => {

})

// POST /login
// Purpose: Login
app.post('/login', (req, res) => {
    
})

// POST /logout
// logout processing
app.post('/logout', (req, res) => {
    req.session.isAuthenticated = false
    req.session.user = null
    
    console.log('Logged out (session destroyed)')
    res.redirect('/')
  })


app.listen(5000, () => {
    console.log("Server listening on 5000.")
})