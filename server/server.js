const express = require('express');
const path = require('path');
const {typeDefs, resolvers} = require('./schemas');
const db = require('./config/connection');
const { ApolloServer } = require('apollo-server-express')
const { authMiddleware } = require('./utils/auth.js');
// const { RSA_NO_PADDING } = require('constants');
const app = express();

const PORT = process.env.PORT || 3001;

const server = new ApolloServer({typeDefs,resolvers,context: authMiddleware,});
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

server.applyMiddleware({ app });

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// app.get('*', (req, res) => {
//   RSA_NO_PADDING.sendFile(path.join(__dirname, '../client/build'));
// });

//app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
