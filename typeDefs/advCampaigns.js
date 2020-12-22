const {gql} = require('apollo-server')

const advCampaigns = gql`
  
  extend type Query{
    campaigns: [AdvCampaigns]
  } 
                   
  type AdvCampaigns {
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
    noLimit: Boolean
    dateAdded: Int
    dateUpdated: String
    spentDaily: Float
    spentTotal: Float
    countClickTotal: Int
    countClickDaily: Int
  }     
    
`

module.exports = {
    advCampaigns: advCampaigns,
}