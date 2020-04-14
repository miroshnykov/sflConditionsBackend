const {gql} = require('apollo-server')

const campaigns = gql`
  
  extend type Query{
    campaigns: [Campaigns]
  } 
                   
  type Campaigns {
    id: Int
    name: String    
    user: String
    status: String
    userName: String
    userEmail: String
    budgetTotal: Float
    budgetDaily: Float
    cpc: Float
    landingPage: String
    landingPageValid: Boolean
  } 
      
`

module.exports = {
    campaigns: campaigns,
}