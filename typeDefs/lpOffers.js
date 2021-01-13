const {gql} = require('apollo-server')

const lpOffers = gql`
  
  extend type Query{
        getLpOffers: [OffersLp]   
  } 
  
  type OffersLp {
        id: Int
        name: String  
        url: String
        status: String  
        offerId: Int
  }
  
    extend type Mutation {
        createLpOffer(
            name: String!, 
            url: String!, 
            offerId: Int!, 
         ): CreateLpOffer
         
         updateLpOffer(
            id: Int!,
            name: String!, 
            url: String!, 
            offerId: Int!, 
         ): UpdateLpOffer
         
         deleteLpOffer(
            id: Int! 
         ): DeleteLpOffer         
    }
    
    type CreateLpOffer {
        id: Int
    }
      
    type UpdateLpOffer {
        id: Int
    }
    
    type DeleteLpOffer {
        id: Int
    }        
 

`;

module.exports = {
    lpOffers,
}