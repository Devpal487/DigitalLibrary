import React, { useEffect, useRef, useState } from "react";
import { Card, Box, Divider, Paper, Dialog } from "@mui/material";
import { ConfirmDialog } from "primereact/confirmdialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import { faTimes } from "@fortawesome/free-solid-svg-icons";
import CloseIcon from '@mui/icons-material/Close';

import "./ChatBot.css";
import { useNavigate } from "react-router-dom";
interface ChatBotProps {
  open: boolean; // The modal open state
  onClose: () => void; // Function to close the modal
}

// Mock API for chatbot responses
const API = {
  GetChatbotResponse: async (message: string) => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(
          message === "hi" ? "Welcome to the chatbot!" : `echo: ${message}`
        );
      }, 2000);
    });
  },
};

const ChatBot: React.FC<ChatBotProps> = ({ open, onClose }) => {
  const el = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const loadWelcomeMessage = async () => {
      const welcomeMessage = await API.GetChatbotResponse("hi");
      setMessages([<BotMessage key="0" message={welcomeMessage} />]);
    };
    loadWelcomeMessage();
  }, []);

  const sendMessage = async (text: string) => {
    setMessages((prev) => [
      ...prev,
      <UserMessage key={prev.length + 1} text={text} />,
      <BotMessage
        key={prev.length + 2}
        fetchMessage={() => API.GetChatbotResponse(text)}
      />,
    ]);
  };

  useEffect(() => {
    el.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Dialog open={open} onClose={onClose} >
      <Paper>
       
        <div className="chatbot">
          <div className="header">
            ChatBot
            {/* <span className="close-icon" onClick={onClose}>
              <CloseIcon />
            </span> */}
          </div>
          <div className="messages">
            {messages}
            <div ref={el} />
          </div>
          <InputField onSend={sendMessage} />
        </div>
      </Paper>
    </Dialog>
  );
};
// UserMessage Component
const UserMessage = ({ text }: { text: string }) => (
  <div className="message-container">
    <div className="user-message">{text}</div>
  </div>
);

// BotMessage Component
const BotMessage = ({
  fetchMessage,
  message,
}: {
  fetchMessage?: () => Promise<string>;
  message?: string;
}) => {
  const [isLoading, setLoading] = useState(!message);
  const [msg, setMsg] = useState<string>(message || "");

  useEffect(() => {
    if (fetchMessage) {
      const loadMessage = async () => {
        const response = await fetchMessage();
        setLoading(false);
        setMsg(response);
      };
      loadMessage();
    }
  }, [fetchMessage]);

  return (
    <div className="message-container">
      <div className="bot-message">{isLoading ? "..." : msg}</div>
    </div>
  );
};

// InputField Component
const InputField = ({ onSend }: { onSend: (text: string) => void }) => {
  const [text, setText] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setText(e.target.value);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSend(text);
      setText("");
    }
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
