import React, { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import SearchOverlay from "./SearchOverlay";
import socketAPI from "../api/socket.js";
import { useNavigate } from "react-router-dom";

export default function StartChat({ onPaired }) {
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  const identity = React.useMemo(
    () => JSON.parse(localStorage.getItem("ap-guest-identity") || "{}"),
    []
  );

  useEffect(() => {
    if (!identity.guestName) {
      console.error("Identity missing, redirecting to onboarding");
      navigate("/onboarding");
      return;
    }
    console.log("Loaded identity:", identity);
  }, [identity, navigate]);

  // Handler to run when a paired event arrives
  const handlePairedEvent = useCallback(
    (data) => {
      console.log("Received paired event:", data);
      setSearching(false);
      if (onPaired) onPaired(data);
    },
    [onPaired]
  );

  // Setup socket listeners once when component mounts
  useEffect(() => {
    if (!identity.guestName) return;

    // Connect socket with identity (no-op if already connected)
    try {
      socketAPI.connect(identity);
    } catch (err) {
      console.warn("socketAPI.connect error:", err);
    }

    // Register paired listener
    const offPaired = socketAPI.on("paired", handlePairedEvent);

    // Optional: listen for disconnects or errors for UX
    const offDisconnect = socketAPI.on("disconnect", () => {
      console.warn("Socket disconnected");
      setSearching(false);
    });

    const offConnectError = socketAPI.on("connect_error", (err) => {
      console.warn("Socket connect_error", err);
      setSearching(false);
    });

    return () => {
      // cleanup listeners
      if (offPaired) offPaired();
      if (offDisconnect) offDisconnect();
      if (offConnectError) offConnectError();
    };
  }, [identity, handlePairedEvent]);

  const handleStartChat = () => {
    console.log("Start Chat button clicked in StartChat component");
    if (!identity.guestName) {
      console.error("Identity missing, redirecting to onboarding");
      navigate("/onboarding");
      return;
    }

    setSearching(true);

    try {
      // Ensure socket is initialized
      const s = socketAPI.connect(identity);

      // If already connected, emit immediately
      if (s && s.connected) {
        socketAPI.findRandom();
        console.log("Emitting find_random with:", identity);
        return;
      }

      // Otherwise wait for the connect event once, then emit
      if (s && typeof s.once === "function") {
        s.once("connect", () => {
          console.log("Socket connected (delayed), now emitting find_random");
          socketAPI.findRandom();
          console.log("Emitting find_random with:", identity);
        });

        // Optional: timeout fallback if connect never happens
        setTimeout(() => {
          const current = socketAPI.getSocket && socketAPI.getSocket();
          if (!current || !current.connected) {
            console.warn("Socket did not connect in time; cancelling search");
            setSearching(false);
          }
        }, 8000); // 8s timeout
      } else {
        // Fallback: try to emit (safeEmit will handle disconnected state)
        socketAPI.findRandom();
        console.log("Emitting find_random (fallback) with:", identity);
      }
    } catch (err) {
      console.error("Error emitting find_random:", err);
      setSearching(false);
    }
  };

  const handleSkip = () => {
    console.log("Skip clicked");
    try {
      socketAPI.skipRandom();
    } catch (err) {
      console.error("Error emitting skip_random:", err);
    }
  };

  const handleExit = () => {
    console.log("Exit clicked");
    setSearching(false);
    try {
      socketAPI.stopRandom();
    } catch (err) {
      console.error("Error emitting exit:", err);
    }
  };

  if (searching) {
    return <SearchOverlay onSkip={handleSkip} onExit={handleExit} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-gray-900 to-cyan-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">Ready to Connect?</h1>
        <Button
          size="lg"
          className="px-12 py-4 text-xl font-semibold rounded-full shadow-lg hover:scale-105 transition-all duration-300 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
          onClick={handleStartChat}
        >
          Start Chat
        </Button>
      </div>
    </div>
  );
}
