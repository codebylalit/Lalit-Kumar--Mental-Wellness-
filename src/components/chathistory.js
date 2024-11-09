import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // Optional, if using cookies for auth

const ChatComponent = ({ userId }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  // Assuming you have the JWT token stored in localStorage or Cookies
  const token = localStorage.getItem("token") || Cookies.get("token");

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!token) {
        console.log("No token found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:2000/chat/getChat/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setChats(response.data); // Response is an array of chat messages
      } catch (error) {
        console.error("Error fetching chat history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, [token, userId]);

  return (
    <div>
      <h3>Chat History</h3>
      {loading ? (
        <p>Loading chat history...</p>
      ) : chats.length === 0 ? (
        <p>No chats found.</p>
      ) : (
        <ul>
          {chats.map((chat) => (
            <li key={chat._id}>
              <strong>{chat.sender}: </strong>
              {chat.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatComponent;
