const {gql} = require('apollo-server')

const prod = gql`

  extend type Query{
    prods: [Prods]
  }

  type Prods {
    id: Int
    name: String
  }

`;

module.exports = {
    prod
}