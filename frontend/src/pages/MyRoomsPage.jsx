import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyRooms } from "../services/roomService";

function MyRoomsPage() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getMyRooms();
        setRooms(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div>
      <h1>My Rooms</h1>

      {rooms.length === 0 ? (
        <p>You haven't enrolled in any rooms yet.</p>
      ) : (
        rooms.map((room) => (
          <div key={room.id}>
            {room.cover_image && (
              <img
                src={room.cover_image}
                alt={room.title}
                style={{
                  width: "250px",
                  marginBottom: "10px",
                }}
              />
            )}
            <h3> {room.title} </h3>
            <p>{room.description}</p>
            <Link to={`/rooms/${room.id}`}>View Room</Link>

            <Link to={`/expert/room/${room.id}`}>Manage Room</Link>

            <br />

            {/* <Link
                        to={`/expert/rooms/${room.id}/edit`}
                    >
                        Edit Room
                    </Link> */}

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default MyRoomsPage;
