const {gql} = require('apollo-server')

const verticals = gql`
  
  extend type Query{
    verticals: [Verticals]    
  } 
  
  type Verticals {
    id: Int
    name: String    
  }
`

module.exports = {
    verticals,
}