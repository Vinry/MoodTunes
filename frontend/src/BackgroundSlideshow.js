import React from 'react';
//import { Carousel } from 'react-responsive-carousel';
//import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './BackgroundSlideshow.css';
import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'

const BackgroundSlideshow = ({ images }) => {
  console.log('Images:', images);

  return (
    <div className="slide-container">
      <Fade
        duration={5000} // Duration of each slide in milliseconds
        transitionDuration={1000} // Duration of the transition between slides in milliseconds
        arrows={false} // Disable arrows for navigation
      >
        {images.map((image, index) => (
          <div key={index}>
            <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={image} />
          </div>
        ))}
      </Fade>
    </div>
  );
};
/*
function BackgroundSlideshow() {
  return (
    <div className="background-slideshow">
      <Carousel
        showThumbs={false}
        showStatus={false}
        showIndicators={false}
        autoPlay
        infiniteLoop
        interval={5000}
        transitionTime={1000}
      >
        <div>
          <img src="image1.jpeg" alt="Background 1" />
        </div>
        <div>
          <img src="image2.jpeg" alt="Background 2" />
        </div>
        <div>
          <img src="image3.jpeg" alt="Background 3" />
        </div>
      </Carousel>
    </div>
  );
}
*/
export default BackgroundSlideshow;
