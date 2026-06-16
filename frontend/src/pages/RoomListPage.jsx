import { useEffect, useState } from "react";
import { getRooms } from "../services/roomService";
import { Link } from "react-router-dom";
import { getRecommendations } from "../services/recommendationService";

function RoomListPage() {
  const [rooms, setRooms] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getRooms();
        setRooms(data);

        // const recommendationData =  await getRecommendations();

        console.log("Recommendation API: ", recommendationData);

        // setRecommendations(recommendationData.rooms || []);

        console.log("Recommendations State: ", recommendationData.rooms);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div>
      <h2> Recommended For You </h2>

      {recommendations.length > 0 ? (
        recommendations.map((room) => (
          <div key={room.id}>
            {room.cover_image && (
              <img
                src={room.cover_image}
                alt={room.title}
                style={{
                  width: "250px",
                  borderRadius: "10px",
                  marginBottom: "10px",
                }}
              />
            )}

            <p>laugh</p>

            <h3>{room.title} is</h3>

            <p>{room.description}</p>

            <Link to={`/rooms/${room.id}`}>Open Room</Link>
          </div>
        ))
      ) : (
        <p>No recommendations yet.</p>
      )}

      <h1>Available Rooms</h1>

      {rooms.map((room) => (
        <div key={room.id}>
          {room.cover_image && (
            <img
              src={room.cover_image}
              alt={room.title}
              style={{
                width: "50px",
                borderRadius: "10px",
              }}
            />
          )}
          <h3>
            <Link to={`/rooms/${room.id}`}>{room.title}</Link>
          </h3>
          <Link to={`/profiles/${room.creator}`}>
            <p> Created by: {room.creator_username} </p>
          </Link>
          <p>Created: {new Date(room.created_at).toLocaleDateString()} </p>

          <p>{room.description}</p>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default RoomListPage;
