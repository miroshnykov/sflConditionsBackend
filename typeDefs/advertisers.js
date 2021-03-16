const {gql} = require('apollo-server')

const advertisers = gql`
  
  extend type Query{
        getAdvertisers: [Advertisers],  
        getSflAdvertisers: [Advertisers],
        getSflAdvertisersManagers: [AdvManager]
  } 
                  
                  
  type AdvManager {
        id: Int
        firstName: String    
        lastName: String    
        email: String    
        role: String    
  }                
  type Advertisers {
        id: Int
        name: String    
        description: String    
        website: String    
  }

`

module.exports = {
    advertisers,
};