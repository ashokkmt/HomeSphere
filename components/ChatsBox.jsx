"use client";

import axios from "axios";
import "../styles/chatsBox.css";
import React, { useEffect, useState } from "react";
import { ArrowRight } from "react-feather";
import { FailedToast } from "./utils/toast";

function ChatsBox({ showChat, closeChat, seller, buyerId, propertyId }) {
  const [chat, setChat] = useState("");
  const [displayedChats, setDisplayedChats] = useState([]);
  const [inquiryId, setInquiryId] = useState(null);

  // Load inquiry + messages
  useEffect(() => {
    if (showChat) {
      loadExistingInquiry();
    }
  }, [showChat, buyerId, propertyId]);

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

      const res = await axios.post("http://localhost:3000/api/graphql", {
        query,
      });

      const inquiries = res?.data?.data?.getAllInquiries || [];

      const existing = inquiries.find(
        (inq) =>
          inq?.buyer?.id === buyerId &&
          inq?.property?.id === propertyId
      );

      if (existing) {
        console.log("Existing inquiry found:", existing.id);
        setInquiryId(existing.id);
        setDisplayedChats(existing.messages || []);
      } else {
        console.log("No existing inquiry for this buyer + property");
        setInquiryId(null);
        setDisplayedChats([]);
      }

      return existing?.id ?? null;
    } catch (err) {
      console.error("loadExistingInquiry error:", err.response?.data || err);
      setInquiryId(null);
      return null;
    }
  };

  const sendText = async () => {
    if (!chat.trim()) {
      FailedToast("Type something first");
      return;
    }

    try {
      let eid = inquiryId;

      // nhi pta inquiry, check once
      if (!eid) {
        eid = await loadExistingInquiry();
      }

      // inquiry ha
      if (eid) {
        const mutation = `
          mutation SendInquiryMessage {
            sendInquiryMessage(
              input: {
                inquiryId: ${eid},
                senderId: ${buyerId},
                message: ${JSON.stringify(chat)}
              }
            ) {
              id
              message
            }
          }`;

        const sendRes = await axios.post(
          "http://localhost:3000/api/graphql",
          { query: mutation }
        );

        if (sendRes.data?.errors) {
          console.error("sendInquiryMessage errors:", sendRes.data.errors);
        }

        const getMsgsQuery = `
          query GetInquiryMessages {
            getInquiryMessages(inquiryId: ${eid}) {
              id
              message
              sender { id fullName }
            }
          }`;

        const msgsRes = await axios.post(
          "http://localhost:3000/api/graphql",
          { query: getMsgsQuery }
        );

        if (msgsRes.data?.errors) {
          console.error("getInquiryMessages errors:", msgsRes.data.errors);
        }

        setDisplayedChats(msgsRes?.data?.data?.getInquiryMessages || []);
        setChat("");
        return;
      }

      // no inquiry
      const addMutation = `
        mutation AddInquiry {
          addInquiry(
            input: {
              buyerId: ${buyerId},
              message: ${JSON.stringify(chat)},
              propertyId: ${propertyId}
            }
          ) {
            id
            status
            createdAt
          }
        }`;

      const addRes = await axios.post(
        "http://localhost:3000/api/graphql",
        { query: addMutation }
      );

      if (addRes.data?.errors) {
        console.error("addInquiry errors:", addRes.data.errors);
        return;
      }

      const newId = addRes?.data?.data?.addInquiry?.id;
      console.log("New inquiry created:", newId);

      if (!newId) {
        console.error("addInquiry returned no id:", addRes.data);
        return;
      }

      setInquiryId(newId);

      const getMsgsQuery = `
        query GetInquiryMessages {
          getInquiryMessages(inquiryId: ${newId}) {
            id
            message
            sender { id fullName }
          }
        }`;

      const msgsRes = await axios.post(
        "http://localhost:3000/api/graphql",
        { query: getMsgsQuery }
      );

      if (msgsRes.data?.errors) {
        console.error("getInquiryMessages errors:", msgsRes.data.errors);
      }

      setDisplayedChats(msgsRes?.data?.data?.getInquiryMessages || []);
      setChat("");
    } catch (err) {
      console.error("sendText error:", err.response?.data || err);
    }
  };

  return (
    <div className={`pq-chat-overlay ${showChat ? "active" : ""}`}>
      <div className="pq-chat-box">
        <div className="pq-chat-header">
          <div>
            <h4>Chat with {seller?.fullName || "Seller"}</h4>
            <p className="pq-small">Ask anything about this property.</p>
          </div>
          <ArrowRight
            size={35}
            onClick={closeChat}
            className="pq-chat-close"
          />
        </div>

        <div className="chats">
          <div className="pq-chat-body">
            {displayedChats.length === 0 ? (
              <p className="pq-text left">
                Feel free to chat with {seller?.fullName || "Seller"}
              </p>
            ) : (
              <>
                {displayedChats.map((msg) => (
                  <p
                    key={msg.id}
                    className={`pq-text ${msg?.sender?.id === buyerId ? "left" : "right"
                      }`}
                  >
                    {msg?.message}
                  </p>
                ))}
              </>
            )}
          </div>

          <div className="pq-chat-footer">
            <input
              type="text"
              placeholder="Type your message..."
              className="pq-chat-input"
              value={chat}
              onChange={(e) => setChat(e.target.value)}
            />
            <button
              onClick={sendText}
              className="pq-btn-primary pq-chat-send"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatsBox;
