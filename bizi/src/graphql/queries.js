/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = `query GetUser($userEmail: String!) {
  getUser(userEmail: $userEmail) {
    userEmail
    userType
    userPreferences
    bookmarks
    coupons {
      businessID
      discountIndex
      used
      timeUsed
    }
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
      bookmarks
      coupons {
        businessID
        discountIndex
        used
        timeUsed
      }
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
    businessSubHeading
    businessEmail
    initiatives
    policyList
    businessPhone
    businessURL
    deliveryURL
    reservationURL
    address
    userEmail
    lat
    lng
    priceRange
    schedule
    imgPath
    discounts
    reviews {
      userEmail
      userName
      imgPath
      rating
      text
    }
    approved
    story {
      storyImg1
      storyImg2
      storyPerson
      storyPersonTitle
      storySlide1
      storySlide2
      storySlide3
    }
    searchTags
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
      businessSubHeading
      businessEmail
      initiatives
      policyList
      businessPhone
      businessURL
      deliveryURL
      reservationURL
      address
      userEmail
      lat
      lng
      priceRange
      schedule
      imgPath
      discounts
      reviews {
        userEmail
        userName
        imgPath
        rating
        text
      }
      approved
      story {
        storyImg1
        storyImg2
        storyPerson
        storyPersonTitle
        storySlide1
        storySlide2
        storySlide3
      }
      searchTags
    }
    nextToken
  }
}
`;
export const getCredentials = `query GetCredentials($id: ID!) {
  getCredentials(id: $id) {
    geocodeAPIKey
    mapAPIKey
    accessKey
    secretKey
  }
}
`;
export const listCredentialss = `query ListCredentialss(
  $filter: ModelCredentialsFilterInput
  $limit: Int
  $nextToken: String
) {
  listCredentialss(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      geocodeAPIKey
      mapAPIKey
      accessKey
      secretKey
    }
    nextToken
  }
}
`;
