import { useState } from "react";
import "./chat.css";

const apiKey = ""; 

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

 const getBotResponse = async (userMessage) => {
  try {
    const response = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await response.json();

    if (data.error) {
      setMessages((prev) => [
        ...prev,
        { text: "❌ Error: " + data.error, sender: "bot" },
      ]);
    } else {
      setMessages((prev) => [...prev, { text: data.reply, sender: "bot" }]);
    }
  } catch (err) {
    console.error("Request failed:", err);
    setMessages((prev) => [
      ...prev,
      { text: "⚠️ Something went wrong. Please try again.", sender: "bot" },
    ]);
  }
};


  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setMessages([...messages, { text: userMessage, sender: "user" }]);
    setInput("");
    getBotResponse(userMessage);
  };

  return (
    <>
      {/* Floating Chat Icon */}
      <div id="chatbot-icons" onClick={() => setIsOpen(true)}>
        💬
      </div>

      {/* Chatbot Container */}
      <div id="chatbot-containers" className={isOpen ? "" : "hiddens"}>
        <div id="chatbot-headers">
          <span>Chatbot</span>
          <button id="close-btns" onClick={() => setIsOpen(false)}>
            &times;
          </button>
        </div>
        <div id="chatbot-bodys">
          <div id="chatbot-messagess">
            {messages.map((msg, idx) => (
              <div key={idx} className={`messages ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
        </div>
        <div id="chatbot-input-containers">
          <input
            type="text"
            id="chatbot-inputs"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button id="send-btns" onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
