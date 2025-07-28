import "./Sidebar.css"
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import {v1 as uuidv1} from "uuid";
import server from "./envirnoment";

function Sidebar() {
    const {allThreads , setAllThreads,currThreadId,setNewChat,setPrompt,setReply,setCurrThreadId,setPrevChats} = useContext(MyContext);

    const getAllThreads = async ()=>{
        try{
           const response = await fetch(`${server}/api/thread`);
           const res =await response.json();
           const filteredData = res.map(thread =>({ threadId:thread.threadId,title:thread.title}))
           console.log(filteredData);
           setAllThreads(filteredData);

        }catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        getAllThreads();
    },[currThreadId])

    const createNewChat = ()=>{
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(`${server}/api/thread/${newThreadId}`);

            if (response.status === 429) {
            console.error("Rate limit exceeded. Please try again later.");
            return;
            }

            if (!response.ok) {
            console.error("Error fetching thread:", response.status, response.statusText);
            return;
            }

            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        } catch (err) {
            console.error("Fetch failed:", err);
        }
    };

    const deleteThread = async (threadId) => {
        try{
            const response = await fetch(`${server}/api/thread/${threadId}`,{method:"DELETE"});
            const res = await response.json();
            console.log(res);
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
            if(threadId === currThreadId){
                createNewChat();
            }
        }catch(err){
            console.log(err);
        }
    }


    return ( 
       <section className="Sidebar">
            <button onClick={createNewChat}>
                <img src="src/assets/blacklogo.png" alt="GPT logo" className="logo" />
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>
         

            <ul className="history">
               {
                allThreads?.map((thread,idx)=>(
                    <li key={idx} 
                        onClick={(e)=> changeThread(thread.threadId)}
                        className={thread.threadId === currThreadId ?"highlighted":""}> 
                        {thread.title}
                        <i className="fa-solid fa-trash" 
                            onClick={(e)=>{
                                e.stopPropagation();
                                deleteThread(thread.threadId);
                            }}
                        ></i>
                    </li>
                ))
               }
            </ul>

            <div className="sign">
                <p>By Apna College</p>
            </div>
       </section>
    );
}

export default Sidebar;