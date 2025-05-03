import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

export const useSocket = () => {
  const socketRef = useRef(null);
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    if (!token) return;

    // Initialize socket connection with authentication
    socketRef.current = io(import.meta.env.VITE_API_URL, {
      auth: { token },
      transports: ['websocket'],
      autoConnect: true,
    });

    // Connection event handlers
    socketRef.current.on('connect', () => {
      console.log('Socket connected');
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [token]);

  return socketRef.current;
};

export default useSocket; 