import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";
import "./style.scss";

const Slider = () => {
  const [index, setIndex] = useState(0);

  // Utilisation de byDateDesc pour obtenir les événements triés par date décroissante
  const { byDateDesc } = useData();

  // Générer une ID unique si event.id est manquant
  const eventByDateDesc = byDateDesc.map((event, idx) => ({
    ...event,
    id: event.id || `temp-id-${idx}-${new Date(event.date).getTime()}`
  }));
  console.log("Liste des événements avec leurs IDs :", eventByDateDesc.map(evt => ({
    titre: evt.title,
    id: evt.id
  })));
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIndex((prevIndex) => (prevIndex < eventByDateDesc.length - 1 ? prevIndex + 1 : 0));
    }, 5000);

    return () => clearTimeout(timer);
  }, [index, eventByDateDesc.length]);

  return (
    <div className="SlideCardList">
      {eventByDateDesc.map((event, idx) => (
        <div
          key={event.id} // Utilisation d'une ID unique
          className={`SlideCard SlideCard--${index === idx ? "display" : "hide"}`}
        >
          <img src={event.cover} alt="forum" />
          <div className="SlideCard__descriptionContainer">
            <div className="SlideCard__description">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div>{getMonth(new Date(event.date))}</div>
            </div>
          </div>
        </div>
      ))}

      {/* Pagination avec une clé unique */}
      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {eventByDateDesc.map((event, idx) => (
            <input
              key={`radio-${event.id}`} //  une ID unique 
              type="radio"
              name="radio-button"
              checked={index === idx}
              readOnly
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
