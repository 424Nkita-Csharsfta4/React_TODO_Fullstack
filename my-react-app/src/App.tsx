import React, { useEffect, useState } from 'react';
import ListHeader from './components/ListHeader';
import ListItem from './components/ListItem';
import Auth from './components/Auth';
import { useCookies } from 'react-cookie';

interface Task {
  id: string;
  user_email: string;
  title: string;
  progress: number;
  date: Date;
}

interface AppProps {}

const App: React.FC<AppProps> = () => {
  const [cookies,, ] = useCookies(['AuthToken', 'Email']);
  const authToken = cookies.AuthToken;
  const userEmail = cookies.Email;
  const [tasks, setTasks] = useState<Task[] | null>(null);

  const getData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${userEmail}`);
      const json = await response.json();
      setTasks(json);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (authToken) {
      getData();
    }
  }, []);

  console.log(tasks);

  // Sort by date
  const sortedTasks = tasks?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="app">
      {!authToken && <Auth listName={''} getData={function (): void {
        throw new Error('Function not implemented.');
      } } />}
      {authToken && (
        <>
          <ListHeader listName="🏝️ Holiday tick list" getData={getData} />
          <p className="user-email">Welcome back {userEmail}</p>
          {sortedTasks?.map((task) => (
            <ListItem key={task.id} task={task} getData={getData} />
          ))}
        </>
      )}
      <p className="copyright">2023 Никита Камень</p>
    </div>
  );
};

export default App;
