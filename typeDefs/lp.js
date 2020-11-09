const {gql} = require('apollo-server')

const lp = gql`
  
  extend type Query{
    lp: [Lp]    
  } 
  
  type Lp {
    id: Int
    name: String
  }
`;

module.exports = {
    lp,
};