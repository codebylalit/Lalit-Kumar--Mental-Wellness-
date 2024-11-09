import React, { useEffect, useState } from "react";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Import the Generative AI package
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Bars3Icon } from "@heroicons/react/24/outline"; // for the menu icon
import { useLocation, useNavigate } from "react-router-dom";

const apiKey = "AIzaSyARFKpGvBEBbvmmmeHnB_cGuXppt9EmU_g";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `
    You are a mental health chatbot designed to provide supportive and informative responses to users seeking help with mental health issues. Use a friendly, calm, and compassionate tone in your replies, ensuring that your language is easy to understand and free of jargon. When users ask about general well-being, offer positive reinforcement and share coping strategies like mindfulness techniques. If a user expresses feelings of stress or anxiety, acknowledge their feelings and provide tips for managing these emotions, along with relaxation exercises. In crisis situations, if a user indicates they are in distress or having thoughts of self-harm, immediately direct them to emergency services or a crisis hotline, and avoid attempting to provide therapy. Remind users that you are not a substitute for professional mental health treatment, and encourage them to seek help from qualified professionals when necessary.
  `,
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const Dashboard = () => {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [isTyping, setIsTyping] = useState(false); // New state for typing indicator
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // New state for dark mode
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const navigate = useNavigate();
  // New states for form inputs
  const [username, setUsername] = useState("User");


 const fetchUsername = async (token) => {
   try {
     const response = await axios.get("http://localhost:2000/auth/username", {
       headers: { Authorization: `Bearer ${token}` },
     });
     setUsername(response.data.username);
   } catch (error) {
     console.error("Error fetching username:", error);
   }
 };

 useEffect(() => {
   const token = localStorage.getItem("token");
   if (token) {
     fetchUsername(token);
   }
 }, []);

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedChat = localStorage.getItem("chatHistory");
    if (savedChat) {
      setChat(JSON.parse(savedChat));
    }
  }, []);

  // Save chat history to localStorage whenever it updates
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chat));
  }, [chat]);

  const handleSend = async () => {
    if (input.trim()) {
      setIsFirstVisit(false);
      setChat([...chat, { sender: "user", message: input }]);
      setInput("");

      // Show typing indicator
      setIsTyping(true);

      // Simulate AI typing delay
      setTimeout(async () => {
        try {
          const chatSession = model.startChat({
            generationConfig,
            history: [
              {
                role: "user",
                parts: [{ text: input }],
              },
              ...chat.map((message) => ({
                role: message.sender === "user" ? "user" : "model",
                parts: [{ text: message.message }],
              })),
            ],
          });

          const result = await chatSession.sendMessage(input);
          const botMessage =
            result.response.text() || "Sorry, I didn’t understand that.";

          setChat((prevChat) => [
            ...prevChat,
            { sender: "bot", message: botMessage },
          ]);
        } catch (error) {
          console.error("Error fetching response:", error);
          setChat((prevChat) => [
            ...prevChat,
            {
              sender: "bot",
              message: "Sorry, something went wrong. Please try again later.",
            },
          ]);
        } finally {
          setIsTyping(false); // Hide typing indicator after response
        }
      }, 2000); // Delay in milliseconds (adjust as needed)
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default action (like form submission)
      handleSend(); // Call the send function
    }
  };

  const handleClearChat = () => {
    setMenuOpen(false);
    setIsFirstVisit(true);
    setChat([]);
    localStorage.removeItem("chatHistory"); // Clear localStorage as well
  };

  const handlelogout = () => {
    navigate('/') // Clear localStorage as well
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <div
      className={`min-h-screen w-full p-4 sm:p-6 ${
        isDarkMode ? "bg-gray-900" : "bg-green-200"
      } flex flex-col items-center justify-center`}
    >
      <div
        className={`w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl h-[90vh] max-h-[96vh] overflow-y-auto border border-gray-300 p-4 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        } rounded-3xl shadow-xl flex flex-col`}
      >
        {/* Menu Bar */}
        <div className="flex justify-between items-center mb-6">
          <h1
            className={`text-2xl sm:text-3xl font-bold text-green-800 text-center ${
              isDarkMode ? "text-white" : "bg-white text-gray-800"
            }`}
          >
            Calmly
          </h1>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="focus:outline-none"
            >
              <Bars3Icon
                className={`h-8 w-8 text-green-600 ${
                  isDarkMode ? "text-white" : "bg-white text-gray-800"
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div
                className={`absolute right-0 w-32 border rounded-lg shadow-lg ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-600"
                    : "bg-white border-gray-300"
                }`}
              >
                <button
                  onClick={toggleDarkMode}
                  className={`w-full px-4 py-2 font-medium hover:bg-gray-100 text-left ${
                    isDarkMode
                      ? "text-white hover:bg-gray-700"
                      : "text-green-600 hover:bg-gray-100"
                  }`}
                >
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </button>
                <button
                  onClick={handleClearChat}
                  className={`w-full px-4 py-2 font-medium hover:bg-gray-100 text-left ${
                    isDarkMode
                      ? "text-white hover:bg-gray-700"
                      : "text-green-600 hover:bg-gray-100"
                  }`}
                >
                  Clear Chat
                </button>
                <button
                  onClick={handlelogout}
                  className={`w-full px-4 py-2 font-medium hover:bg-gray-100 text-left ${
                    isDarkMode
                      ? "text-white hover:bg-gray-700"
                      : "text-green-600 hover:bg-gray-100"
                  }`}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Chat Content */}
        <div
          className={`flex-grow overflow-y-auto flex flex-col ${
            showSignIn || showSignUp
              ? "items-center justify-center"
              : "items-stretch"
          }`}
        >
          {/* Display Chat Messages or Intro */}
          {!showSignIn && !showSignUp && (
            <>
              {isFirstVisit ? (
                <div className="flex flex-col items-center justify-center text-center text-gray-800 p-4 space-y-2">
                  <DotLottieReact
                    className="w-40 h-40 sm:w-64 sm:h-64 mb-4"
                    src="https://lottie.host/a81c850f-2a40-4f85-9f76-6f4ec3e3cbcb/X4U4NURe1a.json"
                    background="transparent"
                    speed="1"
                    loop
                    autoplay
                  />
                  <div>
                    <p
                      className={`text-xl sm:text-2xl font-bold ${
                        isDarkMode ? "text-green-300" : "text-green-700"
                      }`}
                    >
                      Hello {username}
                    </p>

                    <p
                      className={`text-xl sm:text-xl mt-3 font-semibold ${
                        isDarkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      Welcome to Calmly - Your AI Therapist
                    </p>
                
                    <p
                      className={`text-base sm:text-lg font-medium mt-2 ${
                        isDarkMode ? "text-green-400" : "text-green-600"
                      }`}
                    >
                      How do you feel today?
                    </p>
                  </div>
                </div>
              ) : (
                chat.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    } mb-4`}
                  >
                    <p
                      className={`inline-block px-4 py-2 rounded-lg max-w-xs ${
                        message.sender === "user"
                          ? "bg-green-500 text-white text-right"
                          : "bg-gray-200 text-gray-800 text-left"
                      }`}
                    >
                      {message.message}
                    </p>
                  </div>
                ))
              )}

              {isTyping && (
                <div className="flex justify-start mb-2">
                  <div className="inline-block px-4 py-2 rounded-lg bg-gray-200 text-gray-800">
                    <TypingIndicator />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Input and Send Button */}
        <div className="w-full flex items-center mt-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className={`flex-grow px-4 py-2 sm:py-3 mr-2 border border-gray-300 rounded-full focus:outline-none shadow-sm ${
              isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"
            }`}
          />
          <button
            onClick={handleSend}
            className={`px-4 sm:px-6 py-2 sm:py-3 font-semibold rounded-full transition duration-200 shadow-md ${
              isDarkMode
                ? "bg-green-700 text-gray-200 hover:bg-green-600" // Dark mode styles
                : "bg-green-600 text-white hover:bg-green-500" // Light mode styles
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

// TypingIndicator Component
const TypingIndicator = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="dot animate-bounce bg-gray-500 rounded-full w-3 h-3 mx-1"></div>
      <div className="dot animate-bounce bg-gray-500 rounded-full w-3 h-3 mx-1"></div>
      <div className="dot animate-bounce bg-gray-500 rounded-full w-3 h-3 mx-1"></div>
    </div>
  );
};

export default Dashboard;
