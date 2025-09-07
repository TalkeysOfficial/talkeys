"use client";
import React, { useRef, useState, useEffect } from "react";
import { io } from "socket.io-client";

const ROOM_ID = "room1";
const USER_ID = Math.floor(Math.random() * 1000).toString();

const socket = io("http://localhost:5000");

export default function WebRTCChat() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [isLive, setIsLive] = useState(false);
  useEffect(() => {
    socket.emit("join-room", { roomId: ROOM_ID, userId: USER_ID });
  }, []);

  const startCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setLocalStream(stream);
    localVideoRef.current.srcObject = stream;

    const peer = new RTCPeerConnection();
    peerRef.current = peer;

    stream.getTracks().forEach(track => peer.addTrack(track, stream));

    peer.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("candidate", { roomId: ROOM_ID, candidate: event.candidate });
      }
    };

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    socket.emit("offer", { roomId: ROOM_ID, offer });

    setIsLive(true);
  };

  const joinStream = async () => {
  if (peerRef.current) return; 

  const peer = new RTCPeerConnection();
  peerRef.current = peer;

  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  setLocalStream(stream);
  localVideoRef.current.srcObject = stream;

  stream.getTracks().forEach(track => peer.addTrack(track, stream));

  peer.ontrack = (event) => {
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
  };

  peer.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("candidate", { roomId: ROOM_ID, candidate: event.candidate });
    }
  };
};



  useEffect(() => {
socket.on("offer", async ({ roomId, offer }) => {
  if (!peerRef.current) await joinStream();

  const pc = peerRef.current;
  await pc.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  socket.emit("answer", { roomId, answer });
});

    socket.on("answer", async ({ roomId, answer }) => {
      if (peerRef.current) {
        await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });
    socket.on("candidate", async ({ roomId, candidate }) => {
      if (peerRef.current) {
        try {
          await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error("Error adding ICE candidate:", err);
        }
      }
    });

    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("candidate");
    };
  }, [localStream]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">WebRTC Test</h1>
      <div className="flex gap-4">
        <button
          onClick={startCall}
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
          disabled={isLive}
        >
          Go Live
        </button>
        <button
          onClick={joinStream}
          className="px-4 py-2 bg-[#102542] text-white rounded-lg"
        >
          Join Stream
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-full border rounded-lg"
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full border rounded-lg"
        />
      </div>
    </div>
  );
}
// re