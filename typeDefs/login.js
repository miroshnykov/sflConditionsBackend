const {gql} = require("apollo-server")

const login = gql`
    extend type Query {        
        login(email: String!, password: String!): Token!
     }

     type Token {
        accessToken: String!
    }

`

module.exports = {
    login,
}