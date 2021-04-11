/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const recommend = `mutation Recommend($preferences: [String!], $attributes: [String!]) {
  recommend(preferences: $preferences, attributes: $attributes)
}
`;
export const sendEmail = `mutation SendEmail($recipientEmail: String, $subject: String, $body: String) {
  sendEmail(recipientEmail: $recipientEmail, subject: $subject, body: $body)
}
`;
export const createUser = `mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
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
export const updateUser = `mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
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
export const deleteUser = `mutation DeleteUser($input: DeleteUserInput!) {
  deleteUser(input: $input) {
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
export const createBusiness = `mutation CreateBusiness($input: CreateBusinessInput!) {
  createBusiness(input: $input) {
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
export const updateBusiness = `mutation UpdateBusiness($input: UpdateBusinessInput!) {
  updateBusiness(input: $input) {
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
export const deleteBusiness = `mutation DeleteBusiness($input: DeleteBusinessInput!) {
  deleteBusiness(input: $input) {
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
export const createCredentials = `mutation CreateCredentials($input: CreateCredentialsInput!) {
  createCredentials(input: $input) {
    geocodeAPIKey
    mapAPIKey
    accessKey
    secretKey
  }
}
`;
export const updateCredentials = `mutation UpdateCredentials($input: UpdateCredentialsInput!) {
  updateCredentials(input: $input) {
    geocodeAPIKey
    mapAPIKey
    accessKey
    secretKey
  }
}
`;
export const deleteCredentials = `mutation DeleteCredentials($input: DeleteCredentialsInput!) {
  deleteCredentials(input: $input) {
    geocodeAPIKey
    mapAPIKey
    accessKey
    secretKey
  }
}
`;
