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
export const getBusiness = `query GetBusiness($businessName: String!) {
  getBusiness(businessName: $businessName) {
    businessName
    businessDescription
    policyList
    businessPhone
    businessURL
    deliveryURL
    address
  }
}
`;
export const listBusinesss = `query ListBusinesss(
  $businessName: String
  $filter: ModelBusinessFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listBusinesss(
    businessName: $businessName
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      businessName
      businessDescription
      policyList
      businessPhone
      businessURL
      deliveryURL
      address
    }
    nextToken
  }
}
`;
