const {gql} = require('apollo-server')

const countries = gql`
  
  extend type Query{
    countries: [Countries]    
  } 
  
  type Countries {
    code: String
    name: String    
  }
`

module.exports = {
    countries,
}