import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useCookies } from 'react-cookie';

interface ModalProps {
  mode: string;
  setShowModal: (show: boolean) => void;
  getData: () => void;
  task?: {
    id: string;
    user_email: string;
    title: string;
    progress: number;
    date: Date;
  };
}

const Modal: React.FC<ModalProps> = ({ mode, setShowModal, getData, task }) => {
  const [cookies,] = useCookies(['Email']);
  const editMode = mode === 'edit';

  const [data, setData] = useState({
    user_email: editMode ? task?.user_email || '' : cookies.Email || '',
    title: editMode ? task?.title || '' : '',
    progress: editMode ? task?.progress || 50 : 50,
    date: editMode ? task?.date || new Date() : new Date(),
  });

  const postData = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.status === 200) {
        console.log('WORKED');
        setShowModal(false);
        getData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const editData = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${task?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.status === 200) {
        setShowModal(false);
        getData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    console.log(data);
  };

  return (
    <div className="overlay">
      <div className="modal">
        <div className="form-title-container">
          <h3>Let's {mode} your task</h3>
          <button onClick={() => setShowModal(false)}>X</button>
        </div>

        <form>
          <input
            required
            maxLength={30}
            placeholder="Your task goes here"
            name="title"
            value={data.title}
            onChange={handleChange}
          />
          <br />
          <label htmlFor="range">Drag to select your current progress</label>
          <input
            required
            type="range"
            id="range"
            min="0"
            max="100"
            name="progress"
            value={data.progress}
            onChange={handleChange}
          />
          <input className={mode} type="submit" onClick={editMode ? editData : postData} />
        </form>
      </div>
    </div>
  );
};

export default Modal;
