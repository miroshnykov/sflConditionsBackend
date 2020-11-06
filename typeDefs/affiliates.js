const {gql} = require('apollo-server')

const affiliates = gql`
  
  extend type Query{
    affiliates: [Affiliates]    
  } 
  
  type Affiliates {
    id: Int
    name: String    
    countryCode: String
  }
`;

module.exports = {
    affiliates,
};