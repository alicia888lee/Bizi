import React from 'react'
import { IoMdText, IoIosAdd } from "react-icons/io";

function AddReview() {
    return(
        <div className="add-review-wrapper">            
            <h2 className="add-review-header"><IoMdText className="review-icon"/> Leave a Review</h2>
            <div className="review-wrapper">
                <div className="review-upload">
                    <h3>Upload Photo</h3>
                    <IoIosAdd className="review-add-icon" />
                </div>
                <div className="review-description">
                    <textarea rows="4" className="reviewText" placeholder="Write a review..."/>
                </div>
            </div>
            <button className="reviewBtn">Post</button>
        </div>
    )
}

export default AddReview