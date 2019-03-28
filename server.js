const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

// App Initialization
const app = express();

// Middlewares
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// DB Config
const db = require('./config/keys').mongoURI;

// Connecting with the databse
mongoose.connect(db, {
    useNewUrlParser: true
}).then(() => {
    console.log(`Database Connected Successfully ${db}`)
}).catch(err => {
    console.log(`Error in connecting Database ${err}`)
});

// Passport Middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// App routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// defning Application PORT
const PORT = process.env.PORT || 5000;
// App listener on port 5000
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});