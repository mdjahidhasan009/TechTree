import React, { useEffect } from "react";

import './stylesheets/Carousel.css';

const Carousel = () => {
  useEffect(() => {
    if(Glide)
      new Glide(".images",{
      type: 'carousel',
    }).mount();

  }, [])
  return (
      <div className="images glide">
        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides">
            <li className="glide__slide">
              <img src="images/carouselImages/1.jpg" alt="" />
            </li>

            <li className="glide__slide">
              <img src="images/carouselImages/2.jpg" alt="" />
            </li>

            <li className="glide__slide">
              <img src="images/carouselImages/3.jpg" alt="" />
            </li>

            <li className="glide__slide">
              <img src="images/carouselImages/4.jpg" alt="" />
            </li>

            <li className="glide__slide">
              <img src="images/carouselImages/5.jpg" alt="" />
            </li>

            <li className="glide__slide">
              <img src="images/carouselImages/6.jpg" alt="" />
            </li>
          </ul>
        </div>

        <div className="glide__arrows" data-glide-el="controls">
          <button className="glide__arrow glide__arrow--left" data-glide-dir="<"><i className="fas fa-arrow-left" />
          </button>
          <button className="glide__arrow glide__arrow--right" data-glide-dir=">"><i className="fas fa-arrow-right" />
          </button>
        </div>
      </div>
  )
}
export default Carousel;
