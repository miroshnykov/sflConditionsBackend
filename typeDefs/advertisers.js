const {gql} = require('apollo-server')

const advertisers = gql`
  
  extend type Query{
        getAdvertisers: [Advertisers],  
        getSflAdvertisers: [Advertisers]
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