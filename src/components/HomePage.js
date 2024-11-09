import React, { useEffect, useState } from "react";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Import the Generative AI package
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  Bars3Icon,
  SpeakerWaveIcon,
  MicrophoneIcon,
} from "@heroicons/react/24/outline"; // for the menu icon
import { useNavigate } from "react-router-dom";


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

const HomePage = () => {
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // For Sign-Up form
  const [errorMessage, setErrorMessage] = useState(""); // State to hold error messages
  const [isSubmitted, setIsSubmitted] = useState(false); // Track submission
  const [isRecording, setIsRecording] = useState(false);
  const MAX_MESSAGES = 20;
  const [messageCount, setMessageCount] = useState(0); // Track the number of messages sent

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

  const handleSignInClick = async (event) => {
    event.preventDefault();
    setErrorMessage(""); // Reset error message on new attempt

    try {
      const response = await axios.post("http://localhost:2000/auth/signin", {
        email,
        password,
      });

      if (response.status === 200) {
        const { token, username } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        navigate("/dashboard", { state: { username } });
        setIsSubmitted(false); // Reset submitted state on successful sign-in
      }
    } catch (error) {
      setIsSubmitted(true); // Keep this true to show error message on failure
      if (error.response) {
        console.error("Sign-in error:", error.response.data);
        setErrorMessage(
          error.response.data.message ||
            "Sign-in failed. Please check your credentials."
        );
      } else {
        console.error("Sign-in error:", error.message);
        setErrorMessage("An error occurred. Please try again.");
      }
    }

    setMenuOpen(false);
    setShowSignIn(true);
    setShowSignUp(false);
  };

  const handleSignUpClick = async (event) => {
    event.preventDefault();
    setErrorMessage(""); // Reset error message on new attempt

    try {
      const response = await axios.post("http://localhost:2000/auth/signup", {
        username,
        email,
        password,
      });
      if (response.status === 201) {
        const { token, username } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        navigate("/dashboard", { state: { username } });
      }
    } catch (error) {
      setIsSubmitted(false); // Set to false when there's an error
      if (error.response) {
        console.error("Sign-up error:", error.response.data);
        setErrorMessage(
          error.response.data.message ||
            "Sign-up failed. Please check your details."
        );
      } else {
        console.error("Sign-up error:", error.message);
        setErrorMessage("An error occurred. Please try again.");
      }
    }

    setMenuOpen(false);
    setShowSignUp(true);
    setShowSignIn(false);
  };

  const handleCloseForms = () => {
    setShowSignIn(false);
    setShowSignUp(false);
    if (chat.length === 0) {
      setIsFirstVisit(true);
    }
  };

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

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const handleDownloadChat = () => {
    const chatContent = chat
      .map((message) => `${message.sender}: ${message.message}`)
      .join("\n\n");
    const blob = new Blob([chatContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "chat_report.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  // Function to speak the message
  const handleSpeak = (message) => {
    const speech = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(speech);
  };

  // Speech Recognition Setup
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  const handleVoiceInput = () => {
    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  recognition.onresult = (event) => {
    const speechResult = event.results[0][0].transcript;
    setInput(speechResult); // Set the speech result as input
    setIsRecording(false);
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    setIsRecording(false);
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
                } z-50`} // Add z-index here to bring it above other elements like the chat
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
                  onClick={handleSignInClick}
                  className={`w-full px-4 py-2 font-medium hover:bg-gray-100 text-left ${
                    isDarkMode
                      ? "text-white hover:bg-gray-700"
                      : "text-green-600 hover:bg-gray-100"
                  }`}
                >
                  Login/Register
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
                  onClick={handleDownloadChat}
                  className={`w-full px-4 py-2 font-medium hover:bg-gray-100 text-left ${
                    isDarkMode
                      ? "text-white hover:bg-gray-700"
                      : "text-green-600 hover:bg-gray-100"
                  }`}
                >
                  Download Chat
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Chat Content */}
        <div
          className={`flex-grow overflow-y-auto flex flex-col  ${
            showSignIn || showSignUp
              ? "items-center justify-center"
              : "items-stretch"
          }`}
        >
          {/* Sign In Form */}

          {showSignIn && (
            <div
              className={`mb-4 p-4 w-full max-w-sm flex flex-col items-center mt-24 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h2
                className={`text-xl font-bold ${
                  isDarkMode ? "text-green-300" : "text-green-800"
                } text-center mb-4`}
              >
                Sign In
              </h2>
              <form
                onSubmit={handleSignInClick}
                className="flex flex-col items-center w-full"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className={`w-full p-2 border mb-2 border-gray-300 rounded focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-green-500"
                      : "bg-white text-gray-900"
                  }`}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className={`w-full p-2 border mb-2 border-gray-300 rounded focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-green-500"
                      : "bg-white text-gray-900"
                  }`}
                />
                <button
                  type="submit"
                  className={`w-full py-2 rounded-lg transition duration-200 ${
                    isDarkMode
                      ? "bg-green-500 text-gray-200 hover:bg-green-600"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={handleCloseForms}
                  className={`text-red-600 mt-2 ${
                    isDarkMode ? "hover:text-red-400" : ""
                  }`}
                >
                  Close
                </button>
                <div className="w-full flex justify-center">
                  <button
                    type="button"
                    onClick={handleSignUpClick}
                    className={`mt-2 ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    Join Calmly today –{" "}
                    <span
                      className={`font-semibold ${
                        isDarkMode ? "text-green-400" : "text-green-800"
                      }`}
                    >
                      Sign Up!
                    </span>
                  </button>
                </div>
                {errorMessage && (
                  <p className="text-red-500 mt-2 text-center">
                    {errorMessage}
                  </p>
                )}
              </form>
            </div>
          )}

          {/* Sign Up Form */}
          {showSignUp && (
            <div
              className={`mb-4 p-4 w-full max-w-sm flex flex-col items-center mt-24 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h2
                className={`text-xl font-bold ${
                  isDarkMode ? "text-green-300" : "text-green-800"
                } text-center mb-4`}
              >
                Sign Up
              </h2>
              <form
                onSubmit={handleSignUpClick}
                className="flex flex-col items-center w-full"
              >
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className={`w-full p-2 border mb-2 border-gray-300 rounded focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-green-500"
                      : "bg-white text-gray-900"
                  }`}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className={`w-full p-2 border mb-2 border-gray-300 rounded focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-green-500"
                      : "bg-white text-gray-900"
                  }`}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className={`w-full p-2 border mb-2 border-gray-300 rounded focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-green-500"
                      : "bg-white text-gray-900"
                  }`}
                />
                <button
                  type="submit"
                  className={`w-full py-2 rounded-lg transition duration-200 ${
                    isDarkMode
                      ? "bg-green-500 text-gray-200 hover:bg-green-600"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={handleCloseForms}
                  className={`text-red-600 mt-2 ${
                    isDarkMode ? "hover:text-red-400" : ""
                  }`}
                >
                  Close
                </button>
                <div className="w-full flex justify-center">
                  <button
                    type="button"
                    onClick={handleSignInClick}
                    className={`mt-2 ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    Already have an account?{" "}
                    <span
                      className={`font-semibold ${
                        isDarkMode ? "text-green-400" : "text-green-800"
                      }`}
                    >
                      Sign In!
                    </span>
                  </button>
                </div>
                {errorMessage && ( // Show only after form submit
                  <p className="text-red-500 mt-2 text-center">
                    {errorMessage}
                  </p>
                )}
              </form>
            </div>
          )}

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
                      Hi, I'm Calmly - Your AI Therapist
                    </p>
                    <p
                      className={`text-base sm:text-lg ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Let’s take a step together to bring clarity and calm into
                      your life.
                    </p>
                    <p
                      className={`text-base sm:text-lg ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      I’m here to listen and help however I can.
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
                    <div className="relative inline-block">
                      <p
                        className={`inline-block px-4 py-2 rounded-lg max-w-xs ${
                          message.sender === "user"
                            ? "bg-green-500 text-white text-right"
                            : "bg-gray-200 text-gray-800 text-left"
                        }`}
                      >
                        {message.message}
                      </p>

                      {message.sender === "bot" && (
                        <button
                          onClick={() => handleSpeak(message.message)}
                          className="absolute bottom-0 right-0 mb-2 mr-2 flex items-center space-x-2 text-sm text-black hover:text-blue-800"
                        >
                          <SpeakerWaveIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
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
              {messageCount >= MAX_MESSAGES && (
                <div className="text-red-600 font-semibold text-sm mt-2">
                  You have exceeded the Daily maximum message limit.{" "}
                  <button
                    // onClick={() => setShowPlans(true)}
                    className={`px-4 sm:px-6 py-2 sm:py-3 font-semibold rounded-full transition duration-200 shadow-md ${
                      isDarkMode
                        ? "bg-green-700 text-gray-200 hover:bg-green-600"
                        : "bg-green-600 text-white hover:bg-green-500"
                    }`}
                  >
                    Upgrade
                  </button>
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
          <button onClick={handleVoiceInput} className="p-2">
            <MicrophoneIcon
              className={`h-6 w-6 ${
                isRecording ? "text-red-500" : "text-green-500"
              }`}
            />
          </button>
          <button
            onClick={handleSend}
            className={`px-4 sm:px-6 py-2 sm:py-3 font-semibold rounded-full transition duration-200 shadow-md ${
              isDarkMode
                ? "bg-green-500 text-white hover:bg-green-600" // Dark mode styles
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
    <div className="flex items-center space-x-2">
      <div className="h-2.5 w-2.5 rounded-full bg-gray-400 animate-pulse"></div>
      <div className="h-2.5 w-2.5 rounded-full bg-gray-400 animate-pulse delay-200"></div>
      <div className="h-2.5 w-2.5 rounded-full bg-gray-400 animate-pulse delay-400"></div>
    </div>
  );
};



export default HomePage;
