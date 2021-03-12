const {gql} = require('apollo-server')

const getMediaSites = gql`

  extend type Query{
    getMediaSites: [getMediaSites]
  }

  type getMediaSites {
    id: String
    url: String
    advertising_percentage: String  
  }

`;

module.exports = {
  getMediaSites
}