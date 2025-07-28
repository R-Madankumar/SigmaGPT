import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import server from "./envirnoment.js";

function ChatWindow() {
  const navigate = useNavigate();
  const {
    prompt,
    setPrompt,
    currentThreadId,
    setPrevChats,
    setNewChat
  } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const getReply = async () => {
    const trimmed = prompt.trim();
    if (!trimmed) return;

    setLoading(true);
    setNewChat(false);
    setPrompt(""); // Clear input immediately

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: trimmed,
        threadId: currentThreadId
      })
    };

    try {
      const response = await fetch(`${server}/api/chat`, options);
      const res = await response.json();

      if (!response.ok) throw new Error(res.error || response.statusText);
      if (!res.reply) throw new Error("No reply received");

      setPrevChats(prev => [
        ...prev,
        { role: "user", content: trimmed },
        { role: "assistant", content: res.reply }
      ]);
    } catch (err) {
      console.error("Error fetching reply:", err);
      setPrevChats(prev => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Try again later." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      getReply();
    }
  };

  const toggleProfile = () => setIsOpen(open => !open);

  return (
    <div className="chatwindow">
      <div className="navbar">
        <span>SigmaGPT <i className="fa-solid fa-chevron-down"></i></span>
        <div className="userIconDiv" onClick={toggleProfile}>
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
            onKeyDown={handleKeyDown}
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
