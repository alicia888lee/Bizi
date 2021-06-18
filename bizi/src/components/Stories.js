import React from 'react'
import Nav from './Nav'
import Business from './Business'
import StoriesSearchBar from './StoriesSearchBar'
import ImageGrid from './ImageGrid'

var width = window.innerWidth;

function Stories(){
  return (
    <div>
      <Nav light={false} />
      <h1 className = "story-header">Meet the People Behind your Favorite Business</h1>
      {/* <Business /> */}
      <div className="imageGrid">
        {/* <StoriesSearchBar /> */}
        <ImageGrid />
      </div>
    </div>
  );
}

export default Stories