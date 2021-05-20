const express = require('express')
const app = express()
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBSession = require('connect-mongodb-session')(session)
const jwt = require('jsonwebtoken')

// Load in the mongoose models
const { Task } = require('./db/models/task.model')
const { User } = require('./db/models/user.model')

// DB connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TaskManager', { useNewUrlParser: true }).then(() => {
    console.log("Connected to MongoDB successfully!")
}).catch((e) => {
    console.log("Error while attempting to connect to MongoDB")
    console.log(e)
})

// To prevent deprectation warnings (from MongoDB native driver)
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)

/* MIDDLEWARE  */

// parser
app.use(express.urlencoded({ extended: false }))  // might need body-parser

// CORS HEADERS MIDDLEWARE
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id")

    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    )

    next()
})

// authentication check
const authenticationCheck = (req, res, next) => {
    let token = req.header('x-access-token')

    // verify the JWT
    jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
        if (err) {
            // there was an error
            // jwt is invalid - * DO NOT AUTHENTICATE *
            res.status(401).send(err)
        } else {
            // jwt is valid
            req.user_id = decoded._id
            next()
        }
    });
}

// Verify Refresh Token Middleware (which will be verifying the session)
let verifySession = (req, res, next) => {
    // grab the refresh token from the request header
    let refreshToken = req.header('x-refresh-token')

    // grab the _id from the request header
    let _id = req.header('_id')

    User.findByIdAndToken(_id, refreshToken).then((user) => {
        if (!user) {
            // user couldn't be found
            return Promise.reject({
                'error': 'User not found. Make sure that the refresh token and user id are correct'
            });
        }


        // if the code reaches here - the user was found
        // therefore the refresh token exists in the database - but we still have to check if it has expired or not

        req.user_id = user._id
        req.userObject = user
        req.refreshToken = refreshToken

        let isSessionValid = false

        user.sessions.forEach((session) => {
            if (session.token === refreshToken) {
                // check if the session has expired
                if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
                    // refresh token has not expired
                    isSessionValid = true
                }
            }
        })

        if (isSessionValid) {
            // the session is VALID - call next() to continue with processing this web request
            next()
        } else {
            // the session is not valid
            return Promise.reject({
                'error': 'Refresh token has expired or the session is invalid'
            })
        }

    }).catch((e) => {
        res.status(401).send(e)
    })
}

/* END MIDDLEWARE  */


/* ROUTE HANDLERS */

/* TASK ROUTES */

/**
 * GET /tasks
 * Purpose: View all tasks of currently authenticated user
 */
app.get('/tasks', authenticationCheck, (req, res) => {
    Task.find({
        author: req.user_id
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
        author: req.user_id
    })

    newTask.save()
})

// GET /tasks/:slug NOT SURE IF NEEDED ATM
// Purpose: View a task (including description etc)
/* app.get('/tasks/:slug', authenticationCheck, (req,res) => {
    Task.find({
        slug: req.params.slug
    }).then((task) => {
        res.send(task)
    })
}) */


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
    let body = req.body
    let newUser = new User(body)

    newUser.save().then(() => {
        return newUser.createSession()
    }).then((refreshToken) => {
        // Session created successfully - refreshToken returned
        // now we geneate an access auth token for the user

        return newUser.generateAccessAuthToken().then((accessToken) => {
            // access auth token generated successfully, now we return an object containing the auth tokens
            return { accessToken, refreshToken }
        });
    }).then((authTokens) => {
        // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
        res
            .header('x-refresh-token', authTokens.refreshToken)
            .header('x-access-token', authTokens.accessToken)
            .send(newUser)
    }).catch((e) => {
        res.status(400).send(e)
    })
})

// POST /login
// Purpose: Login
app.post('/login', (req, res) => {
    let email = req.body.email
    let password = req.body.password

    User.findByCredentials(email, password).then((user) => {
        return user.createSession().then((refreshToken) => {
            // Session created successfully - refreshToken returned.
            // now we geneate an access auth token for the user

            return user.generateAccessAuthToken().then((accessToken) => {
                // access auth token generated successfully, now we return an object containing the auth tokens
                return { accessToken, refreshToken }
            });
        }).then((authTokens) => {
            // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
            res
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(user)
        })
    }).catch((e) => {
        res.status(400).send(e)
    })
})

// POST /logout
// logout processing
app.post('/logout', (req, res) => {

})

/**
 * GET /users/me/access-token
 * Purpose: generates and returns an access token
 */
app.get('/users/me/access-token', verifySession, (req, res) => {
    // we know that the user/caller is authenticated and we have the user_id and user object available to us
    req.userObject.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-token', accessToken).send({ accessToken });
    }).catch((e) => {
        res.status(400).send(e);
    });
})


app.listen(5000, () => {
    console.log("Server listening on 5000.")
})