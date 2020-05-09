import "./IndexView.css";

import React from "react";
import { Carousel } from "antd";

export const IndexView = () => {
  return (
    <div className="index-carousel">
      <div className="logo-image" />
      <h1 className="index-title">Witamy w smakowitym kąsku</h1>
      <span className="index-description">
        Pragniemy zaprosić wszystkich Państwa do przeżycia niezapomnianej przygody kulinarnej rozkoszując się smakami z całego świata. Dokładamy wszelkich
        starań, aby nasze dania były najwyższej jakości. Wyselekcjonowane składniki, odpowiednio skomponowane smaki i forma podania będą stanowić ucztę dla
        wszystkich zmysłów.
      </span>
      <h2 className="index-suffix">A tak prezentujemy się od środka: </h2>
      <div>
        <Carousel autoplay>
          <div>
            <img src={`/images/1.jpg`} alt="loading" className="index-image" />
          </div>
          <div>
            <img src={`/images/2.jpg`} alt="loading" className="index-image" />
          </div>
          <div>
            <img src={`/images/3.jpg`} alt="loading" className="index-image" />
          </div>
          <div>
            <img src={`/images/4.jpg`} alt="loading" className="index-image" />
          </div>
          <div>
            <img src={`/images/5.jpg`} alt="loading" className="index-image" />
          </div>
        </Carousel>
      </div>
    </div>
  );
};
