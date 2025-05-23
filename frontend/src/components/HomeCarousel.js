import { Swiper, SwiperSlide } from 'swiper/react';
import {EffectCoverflow } from 'swiper/modules';


import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/grid';



const HomeCarousel = () => {
    return (
         <Swiper
              // effect={'coverflow'}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={3}
              loop={true}
              watchOverflow={true}
              spaceBetween={10}
              coverflowEffect={{
                rotate: 30,
                stretch: 0,
                depth: 40,
                modifier: 1,
                slideShadows: true,
            }}
            modules={[EffectCoverflow]}
            className="mySwiper"
        >
        <SwiperSlide>Slide 1</SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
        <SwiperSlide>Slide 5</SwiperSlide>
        <SwiperSlide>Slide 6</SwiperSlide>
        <SwiperSlide>Slide 7</SwiperSlide>
        <SwiperSlide>Slide 8</SwiperSlide>
        <SwiperSlide>Slide 9</SwiperSlide>
      </Swiper>
  );
};

export default HomeCarousel;
