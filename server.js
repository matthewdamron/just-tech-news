const express = require('express');
const session = require('express-session');
const path = require('path');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const exphbs = require('express-handlebars');
const helpers = require('./utils/helpers');
const hbs = exphbs.create({ helpers });

require('dotenv').config();

// Local PORT or Heroku
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// turn on public
app.use(express.static(path.join(__dirname, 'public')));

// turn on handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Save sessions in cookies
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
  secret: process.env.COOKIE_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({ db: sequelize })
};

app.use(session(sess));

// turn on routes
app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening' + ' ' + PORT));
});