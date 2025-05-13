import { useEffect, useState } from "react";
import { WS_URL } from "../../config";

export function useSocket () {
    const [loading , setLoading] = useState(true);
    const [socket , setSocket] = useState<WebSocket>();

    useEffect(() =>{
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ZTNmMDBkMC1hYWFhLTQwNmYtYjQ5MS01YjRkYTQ4ZmYwZmMiLCJpYXQiOjE3NDY5ODA1Mjl9.HIkC0wyKd0m2vdQBNNRgpDtEuw1t9u1GKZeJOWzTyko`);

        ws.onopen = () => {
            setLoading(false);
            setSocket(ws)
        }

    }, []);

    return {
        socket,
        loading
    }
    
} 