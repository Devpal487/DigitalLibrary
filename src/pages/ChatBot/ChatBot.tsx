import React, { useEffect, useRef, useState } from "react";
import { Paper, Dialog } from "@mui/material";
import { Chat } from "../../utils/Url"; // Your API helper

import "./ChatBot.css";
import { useNavigate } from "react-router-dom";

interface ChatBotProps {
  open: boolean;
  onClose: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ open, onClose }) => {
  const el = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<JSX.Element[]>([]);  
  const [Chattext, setChattext] = useState<string>("");  

  
  const getChatBot = (message: string) => {

    const collectData = {
      input_text : message
    }
    
    Chat.post(`project1/`,collectData).then((res:any) => {

      console.log('res',res)
      const ChatRes = res?.data?.response; 
      if (ChatRes) {
        setMessages((prevMessages) => [
          ...prevMessages,
          <BotMessage key={prevMessages.length + 1} message={ChatRes} />,
        ]);
      }
    }).catch((error) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        <BotMessage key={prevMessages.length + 1} message="Sorry, I couldn't understand that." />,
      ]);
    });
  };

  
  useEffect(() => {
    getChatBot("hii"); 
  }, []);

  
  const sendMessage = async (text: string) => {
    if (text.trim()) {
      
      setMessages((prevMessages) => [
        ...prevMessages,
        <UserMessage key={prevMessages.length + 1} text={text} />,
      ]);
      
      
      setChattext("");
      
     
      setTimeout(() => {
        getChatBot(text);
      }, 500);
    }
  };

  
  useEffect(() => {
    el.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Dialog open={open} onClose={onClose}>
      <Paper>
        <div className="chatbot">
          <div className="header">
            ChatBot
          </div>
          <div className="messages">
            {messages}
            <div ref={el} />
          </div>
          <InputField text={Chattext} setText={setChattext} onSend={sendMessage} />
        </div>
      </Paper>
    </Dialog>
  );
};


const UserMessage = ({ text }: { text: string }) => (
  <div className="message-container">
    <div className="user-message">{text}</div>
  </div>
);


const BotMessage = ({ message }: { message: string }) => {
  return (
    <div className="message-container">
      <div className="bot-message">{message}</div>
    </div>
  );
};


const InputField = ({
  text,
  setText,
  onSend,
}: {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  onSend: (text: string) => void;
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setText(e.target.value);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    onSend(text);  
  };

  return (
    <div className="input">
      <form onSubmit={handleSend}>
        <input
          type="text"
          onChange={handleInputChange}
          value={text}
          placeholder="Enter your message here"
        />
        <button>
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 500 500"
          >
            <g>
              <g>
                <polygon points="0,497.25 535.5,267.75 0,38.25 0,216.75 382.5,267.75 0,318.75" />
              </g>
            </g>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatBot;
