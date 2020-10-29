const {gql} = require('apollo-server')

const segments = gql`
  
  extend type Query{
    segments: [Segments]
  } 

  type Segments {
    id: Int
    name: String    
    status: String
    position: Int
    dateAddedUnixTime: Int
    dateAdded: String
  }  
  
  extend type Mutation {
    ordering(reordering: [OrderInput]): [Order]            
  }
   
  type Order {
      id:Int
      position:Int
  }
  
  input OrderInput {
    id:Int
    position:Int
  }
  
    
`


module.exports = {
    segments: segments,
}