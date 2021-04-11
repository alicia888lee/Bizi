/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = `subscription OnCreateUser {
  onCreateUser {
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
export const onUpdateUser = `subscription OnUpdateUser {
  onUpdateUser {
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
export const onDeleteUser = `subscription OnDeleteUser {
  onDeleteUser {
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
export const onCreateBusiness = `subscription OnCreateBusiness {
  onCreateBusiness {
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
export const onUpdateBusiness = `subscription OnUpdateBusiness {
  onUpdateBusiness {
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
export const onDeleteBusiness = `subscription OnDeleteBusiness {
  onDeleteBusiness {
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
export const onCreateCredentials = `subscription OnCreateCredentials {
  onCreateCredentials {
    geocodeAPIKey
    mapAPIKey
    accessKey
    secretKey
  }
}
`;
export const onUpdateCredentials = `subscription OnUpdateCredentials {
  onUpdateCredentials {
    geocodeAPIKey
    mapAPIKey
    accessKey
    secretKey
  }
}
`;
export const onDeleteCredentials = `subscription OnDeleteCredentials {
  onDeleteCredentials {
    geocodeAPIKey
    mapAPIKey
    accessKey
    secretKey
  }
}
`;
