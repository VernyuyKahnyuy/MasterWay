import { useEffect, useState } from "react";
import { getRooms } from "../services/roomService";
import { Link } from "react-router-dom";

function RoomListPage() {

  const [rooms, setRooms] = useState([]);

  useEffect(() => {

    const fetchRooms = async () => {

      try {

        const data =
          await getRooms();

        setRooms(data);

      } catch (error) {

        console.error(error);
      }
    };

    fetchRooms();

  }, []);

  return (
    <div>

      <h1>Available Rooms</h1>

      {rooms.map((room) => (

        <div key={room.id}>

          <h3>
            <Link to={`/rooms/${room.id}`}>
              {room.title}
            </Link>
          </h3>

          <p>{room.description}</p>

          <hr />

        </div>

      ))}

    </div>
  );
}

export default RoomListPage;