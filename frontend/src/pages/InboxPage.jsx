import { useEffect, useState } from "react";

import { getInbox } from "../services/messageService";

function InboxPage() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const data = await getInbox();

        setMessages(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchInbox();
  }, []);

  return (
    <div>
      <h1>Inbox</h1>

      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        messages.map((message) => (
          <div key={message.id}>
            <h4>From: {message.sender_username}</h4>

            <p>{message.content}</p>

            <small>{new Date(message.created_at).toLocaleString()}</small>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default InboxPage;
