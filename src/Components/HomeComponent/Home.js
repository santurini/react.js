import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay'; // Import autoplay CSS
import './Home.css';

// Import required modules
import { Pagination, Autoplay } from 'swiper/modules';

const Home = () => {
  // Carousel slide data
  const slidesData = [
    {
      id: 1,
      image: '/assets/ahrntal-1.jpg',
      title: "Scopri la Magia della Valle Aurina",
      subtitle: "Immersa tra le maestose Alpi e incorniciata da verdi vallate, la Valle Aurina offre un paradiso per gli amanti della natura e delle avventure all'aria aperta. Scopri i suoi sentieri incontaminati e i panorami mozzafiato.",
    },
    {
      id: 2,
      image: '/assets/ahrntal-2.jpg',
      title: 'Gusta i Sapori della Tradizione Locale',
      subtitle: "Dai piatti tipici preparati con ingredienti freschi e locali ai tradizionali eventi gastronomici, la Valle Aurina è un angolo di Italia dove il cibo è una celebrazione di sapori e tradizioni. Assapora la nostra cucina genuina e deliziosa.",
    },
    {
      id: 3,
      image: '/assets/ahrntal-3.jpg',
      title: 'Vivi la Cultura e le Tradizioni Autentiche',
      subtitle: "Scopri la ricca eredità culturale della Valle Aurina attraverso i suoi eventi storici, le tradizioni artigianali e le feste locali. Ogni angolo racconta una storia unica che arricchisce l’esperienza di ogni visitatore.",
    },
  ];

  return (
    <div className="home-container">
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 6000, // Slide transition delay in milliseconds
          disableOnInteraction: false, // Keep autoplay active after user interaction
        }}
        speed={2000} // Slide transition speed in milliseconds
        modules={[Pagination, Autoplay]}
        className="mySwiper"
      >
        {slidesData.map((slide) => (
          <SwiperSlide key={slide.id} style={{ backgroundColor: slide.backgroundColor }}>
            <div className="slide-content">
              <img src={slide.image} alt={`Slide ${slide.id}`} />
              <div className="text-card">
                <h2>{slide.title}</h2>
                <p>{slide.subtitle}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Home;
