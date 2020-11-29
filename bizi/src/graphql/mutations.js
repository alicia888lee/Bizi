/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = `mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    userEmail
    userType
    userPreferences
  }
}
`;
export const updateUser = `mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
    userEmail
    userType
    userPreferences
  }
}
`;
export const deleteUser = `mutation DeleteUser($input: DeleteUserInput!) {
  deleteUser(input: $input) {
    userEmail
    userType
    userPreferences
  }
}
`;
export const createBusiness = `mutation CreateBusiness($input: CreateBusinessInput!) {
  createBusiness(input: $input) {
    businessName
    businessDescription
    policyList
    businessPhone
    businessURL
    deliveryURL
  }
}
`;
export const updateBusiness = `mutation UpdateBusiness($input: UpdateBusinessInput!) {
  updateBusiness(input: $input) {
    businessName
    businessDescription
    policyList
    businessPhone
    businessURL
    deliveryURL
  }
}
`;
export const deleteBusiness = `mutation DeleteBusiness($input: DeleteBusinessInput!) {
  deleteBusiness(input: $input) {
    businessName
    businessDescription
    policyList
    businessPhone
    businessURL
    deliveryURL
  }
}
`;
