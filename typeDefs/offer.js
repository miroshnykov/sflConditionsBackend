const {gql} = require('apollo-server')

const offer = gql`
  
          
  extend type Mutation {
    createOffer(
        name: String!, 
     ): CreateOffer
     
    delOffer(
        id: Int!
    ): DelOffer
             
  }
  
    type CreateOffer {
        id: Int
    }    
  
    type DelOffer {
        id: Int  
    }
      
`

module.exports = {
    offer,
}