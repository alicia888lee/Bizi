/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = `query GetUser($userEmail: String!) {
  getUser(userEmail: $userEmail) {
    userEmail
    userType
    userPreferences
  }
}
`;
export const listUsers = `query ListUsers(
  $userEmail: String
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listUsers(
    userEmail: $userEmail
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      userEmail
      userType
      userPreferences
    }
    nextToken
  }
}
`;
export const getBusiness = `query GetBusiness($id: ID!) {
  getBusiness(id: $id) {
    id
    businessName
    businessDescription
    initiatives
    policyList
    businessPhone
    businessURL
    deliveryURL
    address
    userEmail
    lat
    lng
    priceRange
    approved
  }
}
`;
export const listBusinesss = `query ListBusinesss(
  $filter: ModelBusinessFilterInput
  $limit: Int
  $nextToken: String
) {
  listBusinesss(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      businessName
      businessDescription
      initiatives
      policyList
      businessPhone
      businessURL
      deliveryURL
      address
      userEmail
      lat
      lng
      priceRange
      approved
    }
    nextToken
  }
}
`;
