import './App.css';
import { MyContext } from "./MyContext.jsx";
import { useState } from 'react';
import { v1 as uuidv1 } from "uuid";
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes.jsx'; // ⬅️ This handles all routing now

function App() {
  const [prompt , setPrompt] = useState("");
  const [reply , setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats , setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads , setAllThreads] = useState([]);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads
  };

  return (
    <Router>
      <MyContext.Provider value={providerValues}>
        <AppRoutes />
      </MyContext.Provider>
    </Router>
  );
}

export default App;
