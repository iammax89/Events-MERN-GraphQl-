const express = require("express");
const bodyParser = require("body-parser");
const graphqlHTTP = require("express-graphql");
const mongoose = require("mongoose");

const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");

const isAuth = require("./middlewares/auth");
const app = express();

app.use(bodyParser.json());

app.use(isAuth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER_NAME}:${process.env.MONGO_PASSWORD}@cluster0-qly8b.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() =>
    app.listen(5000, () => {
      console.log("Server started at port 5000");
    })
  )
  .catch((err) => console.log(err));
