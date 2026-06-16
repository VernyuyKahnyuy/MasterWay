import { useState } from "react";
import { useParams } from "react-router-dom";
import { sendMessage } from "../services/messageService";

function SendMessagePage() {
  const [content, setContent] = useState("");

  const { receiverId } = useParams();

  const receiver = receiverId;

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Receiver ID:", receiver);

    try {
      await sendMessage({
        receiver,
        content,
      });

      alert("Message Sent");

      setContent("");
    } catch (error) {
      console.error(error.response?.data);
    }
  };

  return (
    <div>
      <h1>Send Message</h1>

      <form onSubmit={handleSubmit}>
        {/* <input
          type="number"
          placeholder="Receiver ID"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
        /> */}

        <br />
        <br />

        <textarea
          placeholder="Type message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <br />
        <br />

        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default SendMessagePage;
