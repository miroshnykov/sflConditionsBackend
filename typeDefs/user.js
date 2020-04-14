const {gql} = require('apollo-server')

const user = gql`
  
  extend type Query{
    user(email:String!): [User]    
  } 
  
  type User {
    googleId: String    
    name: String
    email: String
    givenName: String
    familyName: String
    picture: String
    link: String
    hd: String
  }
`

module.exports = {
    user: user,
}