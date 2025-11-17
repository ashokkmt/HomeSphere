"use client";

import axios from "axios";
import "../styles/propertyChatsBox.css";
import "../styles/commonChatBox.css";
import React, { useEffect, useState } from "react";
import { ArrowRight } from "react-feather";
import { FailedToast } from "./utils/toast";

function PropertyChatsBox({ showChat, closeChat, seller, buyerId, propertyId }) {
  const [chat, setChat] = useState("");
  const [displayedChats, setDisplayedChats] = useState([]);
  const [inquiryId, setInquiryId] = useState(null);


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

      const res = await axios.post("http://localhost:3000/api/graphql", { query });

      const inquiries = res?.data?.data?.getAllInquiries || [];

      const existing = inquiries.find(
        (inq) => inq?.buyer?.id === buyerId && inq?.property?.id === propertyId
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
                senderId: ${buyerId},
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
              buyerId: ${buyerId},
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
    <div className={`chatOverlay ${showChat ? "activeOverlay" : ""}`}>
      <div className="chatBox">
        <div className="chatHeader">
          <div>
            <h4>Chat with {seller?.fullName || "Seller"}</h4>
            <p className="subText">Ask anything about this property.</p>
          </div>
          <ArrowRight size={35} onClick={() => closeChat()} className="closeBtn" />
        </div>

        <div className="chatWrapper">
          <div className="chatBody">
            {
              displayedChats.length === 0 ? (
                <p className="chatText leftAlign">
                  Feel free to chat with {seller?.fullName || "Seller"}
                </p>
              ) : (
                <>
                  {
                    displayedChats.map((msg) => {
                      // console.log(msg)
                      return (
                        <p
                          key={msg.id}
                          className={`chatText ${Number(msg?.sender?.id) === buyerId ? "leftAlign" : "rightAlign"}`}
                        >
                          {msg?.message}
                        </p>
                      )
                    })
                  }
                </>
              )
            }
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

export default PropertyChatsBox;
