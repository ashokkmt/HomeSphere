"use client";

import axios from "axios";
import "../styles/dashChatBox.css";
import "../styles/commonChatBox.css";
import React, { useEffect, useRef, useState } from "react";
import { X } from "react-feather";
import { FailedToast } from "./utils/toast";

function DashboardChatsBox({ showChat, closeChat, seller, buyerId, propertyId }) {
    const [chat, setChat] = useState("");
    const [displayedChats, setDisplayedChats] = useState([]);
    const [inquiryId, setInquiryId] = useState(null);
    const closeRef = useRef(null);


    useEffect(() => {
        let intervalId;
        if (showChat) {
            loadExistingInquiry();

            intervalId = setInterval(() => {
                loadExistingInquiry();
            }, 2000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        }
    }, [showChat, buyerId?.id, propertyId]);


    useEffect(() => {
        function closeShowChat(e) {
            if (closeRef.current && !closeRef.current.contains(e.target)) {
                closeChat();
            }
        }
        document.addEventListener('mousedown', closeShowChat);

        return () => {
            document.removeEventListener('mousedown', closeShowChat);
        }
    }, [])


    const loadExistingInquiry = async () => {
        try {
            const query = `
        query GetAllInquiries {
          getAllInquiries {
            id
            status
            createdAt
            buyer { id fullName }
            seller { id fullName }
            messages {
              id
              message
              sender { id fullName }
            }
            property { id }
          }
        }`;

            const res = await axios.post("http://localhost:3000/api/graphql", { query });

            const inquiries = res?.data?.data?.getAllInquiries || [];

            const existing = inquiries.find(
                (inq) => inq?.buyer?.id === buyerId?.id && inq?.property?.id === propertyId
            );

            // console.log(existing);

            if (existing) {
                setInquiryId(existing.id);
                setDisplayedChats(existing.messages || []);
            } else {
                setInquiryId(null);
                setDisplayedChats([]);
            }
            // return existing?.id ?? null;
        } catch (err) {
            setInquiryId(null);
            // return null;
        }
    };

    const sendText = async () => {
        if (!chat.trim()) {
            FailedToast("Type something first");
            return;
        }

        try {

            if (inquiryId) {
                const mutation = `
          mutation SendInquiryMessage {
            sendInquiryMessage(
              input: {
                inquiryId: ${inquiryId},
                senderId: ${seller},
                message: ${JSON.stringify(chat)}
              }
            ) {
              id
              message
            }
          }`;

                await axios.post("http://localhost:3000/api/graphql", { query: mutation });

                const getMsgsQuery = `
          query GetInquiryMessages {
            getInquiryMessages(inquiryId: ${inquiryId}) {
              id
              message
              sender { id fullName }
            }
          }`;

                const msgsRes = await axios.post("http://localhost:3000/api/graphql", {
                    query: getMsgsQuery,
                });

                // console.log(msgsRes?.data?.data?.getInquiryMessages);
                setDisplayedChats(msgsRes?.data?.data?.getInquiryMessages || []);
                setChat("");
                return;
            }

            const addMutation = `
        mutation AddInquiry {
          addInquiry(
            input: {
              buyerId: ${buyerId?.id},
              message: ${JSON.stringify(chat)},
              propertyId: ${propertyId}
            }
          ) {
            id
          }
        }`;

            const addRes = await axios.post("http://localhost:3000/api/graphql", {
                query: addMutation,
            });

            const newId = addRes?.data?.data?.addInquiry?.id;

            setInquiryId(newId);

            const getMsgsQuery = `
        query GetInquiryMessages {
          getInquiryMessages(inquiryId: ${newId}) {
            id
            message
            sender { id fullName }
          }
        }`;

            const msgsRes = await axios.post("http://localhost:3000/api/graphql", {
                query: getMsgsQuery,
            });

            setDisplayedChats(msgsRes?.data?.data?.getInquiryMessages || []);
            setChat("");
        } catch (err) {
            console.log("error here : " + err);
        }
    };

    return (
        <div className={`chatOverlay2 ${showChat ? "activeOverlay2" : ""}`}>
            <div ref={closeRef} className="chatBox">
                <div className="chatHeader">
                    <div>
                        <h4>Chat with {buyerId?.fullName || "Buyer"}</h4>
                        <p className="subText">Ask anything about this property.</p>
                    </div>
                    <X size={25} onClick={() => closeChat()} className="closeBtn" />
                </div>

                <div className="chatWrapper">
                    <div className="chatBody">
                        {displayedChats.length === 0 ? (
                            <p className="chatText leftAlign">
                                Feel free to chat with {buyerId?.fullName || "Buyer"}
                            </p>
                        ) : (
                            <>
                                {
                                    displayedChats.map((msg) => {
                                        // console.log(msg)
                                        return (
                                            <p
                                                key={msg.id}
                                                className={`chatText ${Number(msg?.sender?.id) === buyerId?.id ? "leftAlign" : "rightAlign"}`}
                                            >
                                                {msg?.message}
                                            </p>
                                        )
                                    })
                                }
                            </>
                        )}
                    </div>

                    <div className="chatFooter">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            className="chatInput"
                            value={chat}
                            onChange={(e) => setChat(e.target.value)}
                        />
                        <button onClick={sendText} className="sendBtn">
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardChatsBox;
