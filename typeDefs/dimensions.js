const {gql} = require('apollo-server')

const dimensions = gql`
  
  extend type Query{
    dimensions: [Dimensions]    
  } 
  
  type Dimensions {
    id: Int
    name: String
    displayedName: String    
  }
`;

module.exports = {
    dimensions,
};