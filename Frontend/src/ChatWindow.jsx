import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import server from "./envirnoment.js";

function ChatWindow({ toggleSidebar }) {
  const navigate = useNavigate();
   const {prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat} = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const getReply = async () => {
    setLoading(true);
    setNewChat(false);
   

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId
      })
    };

    try {
      const response = await fetch(`${server}/api/chat`, options);
      const res = await response.json();

      if (!response.ok) throw new Error(res.error || response.statusText);
      if (!res.reply) throw new Error("No reply received");
      setReply(res.reply);
    } catch (err) {
      console.error("Error fetching reply:", err);
    }
    setLoading(false);
   
  };

  useEffect(() => {
    if(prompt && reply) {
      setPrevChats(prevChats => (
        [...prevChats, {
          role: "user",
          content: prompt
        },{
          role: "assistant",
          content: reply
        }]
      ));
    }
    setPrompt("");
  }, [reply]);


  const handleProfileClick = () => setIsOpen(open => !open);

  return (
    <div className="chatwindow">
      <div className="navbar">
        <div className="hamburger" onClick={toggleSidebar}>
          <i className="fa-solid fa-bars"></i>
        </div>
        <span>AlphaGPT <i className="fa-solid fa-chevron-down"></i></span>
        <div className="userIconDiv" onClick={handleProfileClick}>
          <span className="userIcon"><i className="fa-solid fa-user"></i></span>
        </div>
      </div>

      {isOpen && (
        <div className="dropDown">
          <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
          <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade Plan</div>
          <div className="dropDownItem" onClick={() => navigate('/login')}><i className="fa-solid fa-arrow-right-from-bracket"></i> Login</div>
          <div className="dropDownItem" onClick={() => navigate('/signup')}><i className="fa-solid fa-user-plus"/> Signup</div>
          <div className="dropDownItem" onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }}><i className="fa-solid fa-door-open"></i>Log out</div>
        </div>
      )}
    
      <Chat />

      {loading && (
        <div className="loader-container">
          <ScaleLoader color="#fff" loading={true} height={35} width={4} radius={2} margin={2} />
        </div>
      )}

      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter'? getReply() : ''}
          />
        </div>
        <div id="submit" onClick={getReply}>
          <i className="fa-solid fa-paper-plane"></i>
        </div>
      </div>

      <p className="info">
        SigmaGPT can make mistakes. Check important info. See Cookie Preferences.
      </p>
    </div>
  );
}

export default ChatWindow;
