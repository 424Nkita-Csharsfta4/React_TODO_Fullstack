import React, { useState } from 'react';
import Modal from './Modal';
import { useCookies } from 'react-cookie';

interface ListHeaderProps {
  listName: string;
  getData: () => void;
}

const ListHeader: React.FC<ListHeaderProps> = ({ listName, getData }) => {
  const [, , removeCookie] = useCookies(['Email', 'AuthToken']);
  const [showModal, setShowModal] = useState(false);

  const signOut = () => {
    console.log('signout');
    removeCookie('Email');
    removeCookie('AuthToken');
    window.location.reload();
  };

  return (
    <div className="list-header">
      <h1>{listName}</h1>
      <div className="button-container">
        <button className="create" onClick={() => setShowModal(true)}>
          Добавить запись
        </button>
        <button className="signout" onClick={signOut}>
          Вход
        </button>
      </div>
      {showModal && <Modal mode="create" setShowModal={setShowModal} getData={getData} task={undefined} />}
    </div>
  );
};

export default ListHeader;
