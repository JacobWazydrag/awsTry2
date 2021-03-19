/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getArtwork = /* GraphQL */ `
  query GetArtwork($id: ID!) {
    getArtwork(id: $id) {
      id
      name
      description
      price
      image
      createdAt
      updatedAt
    }
  }
`;
export const listArtworks = /* GraphQL */ `
  query ListArtworks(
    $filter: ModelArtworkFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listArtworks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        price
        image
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
