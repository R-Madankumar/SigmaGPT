import { useContext, useEffect, useState } from "react";
import "./Chat.css"
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"

function Chat() {
    const {newChat , prevChats, reply} = useContext(MyContext);
    const [latestReply , setLatestReply] = useState(null);

    useEffect(()=>{

        if(reply ===null){
            setLatestReply(null);
            return;
        }
        if(!prevChats?.length || !reply) return;
        const content = reply.split(" ");
        let idx = 0;
        const interval = setInterval(()=>{
            setLatestReply(content.slice(0, idx + 1).join(" "));
            idx++;
            if(idx >= content.length) clearInterval(interval);
        },40);

        return ()=> clearInterval(interval);
    },[prevChats, reply])

    return ( 
        <div className="chat-container">
            {newChat && <h1>Start new Chat</h1>}
            <div className="chats">
                {
                    prevChats?.slice(0,-1).map((chat,idx)=>
                        <div className={chat.role === "user" ? "userDiv":"gptDiv"} key={idx}>
                            {
                                chat.role === "user" ?
                                <div className="userMessage">{chat.content}</div>:
                                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
                            }
                        </div>
                    )
                }

                {
                    prevChats.length > 0 && (
                        latestReply === null ? (
                        <div className="gptDiv" key="non-typing">
                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                            {prevChats[prevChats.length - 1].content}
                            </ReactMarkdown>
                        </div>
                        ) : (
                       <div className="gptDiv" key="typing">
                            <div className="gptMessage">
                                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                {latestReply}
                                </ReactMarkdown>
                            </div>
                        </div>

                        )
                    )
                }
            </div>
        </div>
    );
}

export default Chat;