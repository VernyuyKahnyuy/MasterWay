import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getRecommendations,
} from "../services/recommendationService";

function RecommendationsPage() {

  const [rooms, setRooms] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchRecommendations =
      async () => {

        try {

          const data =
            await getRecommendations();

          setRooms(data.rooms);

        } catch (error) {

            setRooms([]);

          console.error(error);

        } finally {

          setLoading(false);
        }
      };

    fetchRecommendations();

  }, []);

  if (loading) {

    return (
      <p>
        Loading recommendations...
      </p>
    );
  }

  return (

    <div>

      <h1>
        Recommended For You
      </h1>

      {rooms.map((room) => (

        <div
          key={room.id}
          style={{
            border: "1px solid #ccc",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >

          <h2>
            {room.title}
          </h2>

          <p>
            {room.description}
          </p>

          <p>
            Created by:
            {" "}
            {room.creator}
          </p>

          <Link
            to={`/rooms/${room.id}`}
          >
            Open Room
          </Link>

          {rooms.length === 0 && (

            <p>
              No recommendations available.
              Add your personalized interests to your profile to get better recommendations!
            </p>

        )}

        </div>


      ))}

    </div>

  );
}

export default RecommendationsPage;