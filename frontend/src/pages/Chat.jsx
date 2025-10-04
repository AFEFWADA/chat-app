import { useState } from "react";
import "./chat.css";

const apiKey = "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"; 

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const getBotResponse = async (userMessage) => {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: userMessage }],
          max_tokens: 150,
        }),
      });

      const data = await response.json();

      if (data.error) {
        console.error("API error:", data.error);
        setMessages((prev) => [
          ...prev,
          { text: "❌ API Error: " + data.error.message, sender: "bot" },
        ]);
      } else {
        const botMessage = data.choices[0].message.content;
        setMessages((prev) => [...prev, { text: botMessage, sender: "bot" }]);
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
