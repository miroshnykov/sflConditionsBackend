const {gql} = require('apollo-server')

const publisherTargeting = gql`
  

  extend type Query{
    publisherTargeting: [PublisherTargeting]       
  } 
        
  type PublisherTargeting {
    id: Int
    geo: String
    platformAndroid: Boolean
    platformIos: Boolean
    platformWindows: Boolean
    sourceTypeSweepstakes: Boolean
    sourceTypeVod: Boolean    
    cpc: Float
  }
     
`

module.exports = {
    publisherTargeting: publisherTargeting,
}