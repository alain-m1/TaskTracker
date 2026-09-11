import { useState } from 'react';
import Login from './components/Login.jsx';
import TaskList from './components/TaskList.jsx';

export default function App() {
  const [token, setToken] = useState(null);

  return token ? <TaskList /> : <Login onLogin={setToken} />;
}
