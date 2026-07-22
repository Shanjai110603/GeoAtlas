export const typeDefs = `#graphql
  type AdminLevel {
    id: ID!
    country_code: String!
    level_number: Int!
    local_term: String
    parent_id: ID
    name: String!
    native_name: String
    source: String
    children: [AdminLevel!]!
    ancestors: [AdminLevel!]!
    entities(type: String): [Entity!]!
  }

  type Entity {
    id: ID!
    entity_type: String!
    name: String!
    native_name: String
    admin_level_id: ID
    confidence_score: Float
    source: String
    attributes: String
    reviews: [Review!]!
  }

  type Review {
    id: ID!
    rating: Int!
    text: String
    photos: String
    created_at: String
    display_name: String
  }

  type Query {
    adminUnit(id: ID!): AdminLevel
    entity(id: ID!): Entity
    searchEntities(q: String!, type: String): [Entity!]!
    entitiesInRadius(lat: Float!, lng: Float!, radiusMeters: Float!, type: String): [Entity!]!
  }
`;
