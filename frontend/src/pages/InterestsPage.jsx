import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  getInterests, createInterest, deleteInterest 
} from "../services/interestService";

function InterestsPage() {
    
  const [interest, setInterest] = useState("");
  const [interests, setInterests] = useState([]);

  const fetchInterests = async () => {
    try {
      const data = await getInterests();
      setInterests(data);
    } catch (error) {
      console.error(error);
    }
  };

    useEffect(() => {
        fetchInterests();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createInterest(interest);
            setInterest("");
            fetchInterests();
            
        } catch (error) {
            console.error(error);
            console.log('failed at await createInterest(interest); setInterest(""); fetchInterests()');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteInterest(id);

            fetchInterests();

        } catch (error) {
            console.error(error);

        }
    }

    return (
        <div>
            <h1>Your Interests</h1>

            <form onSubmit={handleSubmit}> 
                <input
                    type="text" 
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    placeholder="One Word Please"
                />
                <button type="submit">Add Interest</button>
            </form>

            <hr />

            {interests.map(
                (item) => (
                    <div key = {item.id} 
                        style={{marginBottom: "10px"
                        }}
                    >
                        
                        {item.interest}

                        <button 
                            onClick={() => 
                                handleDelete(item.id)
                            }
                        
                        >
                            Remove Interest

                        </button>
                    
                    </div>
                )
            )}

        </div>
    );
}

export default InterestsPage;
