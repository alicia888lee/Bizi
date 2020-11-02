import React from 'react'
import yogaImg from '../images/pexels-cottonbro-4056535.jpg';

function Business(){  
    return (
      <div className="business">
        <div className="business-wrapper">
          <div className="business-text">
            <h2>Meet Jessie</h2>
            <h3>Owner of Yoga with Dogs</h3>
            <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vitae tincidunt quam. Cras elementum, nulla eu ultrices porta, neque dolor egestas lectus, ac tristique risus tellus et magna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dapibus ultricies lacus, eu venenatis odio euismod sit amet. Vestibulum lacus mauris, lacinia at turpis rhoncus, dapibus accumsan nunc. Integer vel fermentum odio. Vestibulum a massa tellus.</p>
            <p> Curabitur vitae ex non ante interdum tristique sed ac tortor. Curabitur at leo ac ligula pellentesque luctus. Pellentesque tempus enim et augue hendrerit lacinia. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Suspendisse tempor lorem eu metus cursus, in lacinia nibh lacinia. Mauris ullamcorper rhoncus diam, in lacinia massa convallis et. Ut lectus purus, pretium ut est vel, dictum pulvinar nisi. Donec hendrerit leo odio, ac lobortis justo gravida sed.</p>
            <button>Read More about Jessie</button>
          </div>      
          <div className="yogaImg">
            <img src={yogaImg} alt="yoga"/>      
          </div>      
        </div>
        <div className="circles">
          <div className="circle"></div>
          <div className="circle blueCircle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
        </div>
      </div>
    )
}

export default Business