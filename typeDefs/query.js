const {gql} = require('apollo-server')

const query = gql`
  type Query {   
    _: Boolean
  }
  
  type Mutation {
    _: Boolean
  }
  
`

module.exports = {
    query,
}