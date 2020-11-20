/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = `query GetUser($userEmail: String!) {
  getUser(userEmail: $userEmail) {
    userEmail
    userType
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
    }
    nextToken
  }
}
`;
