import React, { useState, useEffect } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import PopupWithForm from './PopupWithForm';
import api from '../utils/api';


function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [cards, setCards] = useState([]);

  useEffect(() => {
    api.getUserInformation()
    .then((data) => {      
        setCurrentUser(data);      
    })
    .catch((error) => {
      console.log(error)
    })
  }, []);

  useEffect(() => {
    api.getInitialCards()
    .then((data) => {      
        setCards(data.map((item) => item));      
    })
    .catch((error) => {
      console.log(error)
    })
  }, []);

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard({name: '', src: ''})
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true)
  }
  
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true)
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true)
  }

  const handleCardClick = (src, name) => {
    setSelectedCard(src, name);
  }

  const handleCardLike = (card) => {
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    if (isLiked) {
      api.deleteLike(card._id)
      .then(data => {
          setCards((state) => state.map((c) => c._id === card._id ? data : c));
        })
      .catch((error) => {
        console.log(error);
      })
    } else {
      api.addLike(card._id)
      .then(data => {
        setCards((state) => state.map((c) => c._id === card._id ? data : c));
    })
      .catch((error) => {
        console.log(error);
      })
    }
  }

  const handleCardDelete = (card) => {
    api
        .deleteCard(card._id)
        .then(() => {
          setCards((state) => state.filter((c) => c._id !== card._id ));
        })
        .catch((error) => {
          console.log(error);
        });
  }

  const handleUpdateUser = (data) => {
    api
    .changeUserInformation(data)
    .then((data) => {
      setCurrentUser(data);
      closeAllPopups();
    })
    .catch((error) => {
      console.log(error);
    })
  }

  const handleUpdateAvatar = (link) => {
    api
    .changeProfileAvatar(link)
    .then((data) => {
      setCurrentUser(data);
      closeAllPopups();
    })
    .catch((error) => {
      console.log(error);
    })
  }
 
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header />
        <Main
          onEditProfile={handleEditProfileClick}
          onAddPlace={handleAddPlaceClick}
          onEditAvatar={handleEditAvatarClick}
          onCardClick={handleCardClick}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
          cards={cards}
        />
        <Footer />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <PopupWithForm
          name={`card`} 
          text={`Новое место`} 
          btnText={`Создать`}  
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
        >       
          <fieldset className="popup__field">
            <input type="text" className="popup__form-input card-popup-name" id="card-name-input" name="name" 
              placeholder="Название" minLength="2" maxLength="30" defaultValue='' required />
            <span className="error card-name-input-error"></span>
            <input type="url" className="popup__form-input card-popup-activity" id="card-activity-input" name="link"
              placeholder="Ссылка на картинку" defaultValue='' required />
            <span className="error card-activity-input-error"></span>
          </fieldset>        
        </PopupWithForm>
        <PopupWithForm 
          name={`deleteCard`} 
          text={`Вы уверены?`} 
          btnText={`Да`} 
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <ImagePopup 
        card={selectedCard}
        onClose={closeAllPopups}      
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
