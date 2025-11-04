import styles from "./styles.module.scss";
import Button from "@components/ui/Button/Button";
import Information from "@components/ui/Information/Information";
import { LuMessageCircleMore, LuSend } from "react-icons/lu";
import { TiMessages } from "react-icons/ti";
import Input from "@components/ui/Input/Input";
import Card from "@components/Card/Card";
import CardHeader from "@components/Card/CardHeader/CardHeader";
import CardContent from "@components/Card/CardContent/CardContent";
import classNames from "classnames";
import { conversations, messages } from "./constant";
import { GoLink } from "react-icons/go";
import { useState } from "react";

function Messages() {
  const {
    container,
    header,
    title,
    containerInformation,
    grid,
    gridCols1,
    gridCols2,
    messageWrapper,
    customerName,
    messageHeader,
    messageTitle,
    lastMessage,
    customerImg,
    messageList,
    messageDetail,
    messageInfo,
    messageRight,
    messageLeft,
    chat,
    bubble,
    messageTextarea,
    p0,
    p20,
    containerMessageTextarea,
    messageMeta,
    messageTime,
    unreadBadge,
    active,
  } = styles;
  const informations = [
    {
      title: "Total Messages",
      icon: <TiMessages />,
      value: 120,
    },
    {
      title: "New Messages",
      icon: <LuMessageCircleMore />,
      value: 15,
    },
  ];

  const [selectedConversation, setSelectedConversation] = useState(null);
  const selectedConv = conversations.find(
    (conv) => conv.id === selectedConversation
  );
  const filteredMessages = messages.filter(
    (msg) => msg.conversationId === selectedConversation
  );
  return (
    <div className={container}>
      <div className={header}>
        <div className={title}>
          <h2>Message Center</h2>
          <p>Manage and respond to messages from customers.</p>
        </div>
        <Button showIcon={true} content="New Message" />
      </div>
      <div className={containerInformation}>
        {informations.map((info) => (
          <Information
            title={info.title}
            icon={info.icon}
            content={info.value}
          />
        ))}
      </div>
      <div className={classNames(grid, gridCols2)}>
        {/* Danh sách hội thoại */}
        <Card className={p0}>
          <CardHeader>
            <div className={messageHeader}>
              <p>Message</p>
              <Input
                type="text"
                placeholder="Tìm kiếm hội thoại..."
                showIcon={true}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className={messageWrapper}>
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={classNames(messageInfo, {
                    [active]: selectedConversation === conversation.id,
                  })}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className={customerImg}>
                    <img src="/src/assets/img/product1.jpg" alt="" />
                  </div>
                  <div className={messageDetail}>
                    <div className={messageTitle}>
                      <p className={customerName}>{conversation.customer}</p>
                      <div className={messageMeta}>
                        <span className={messageTime}>{conversation.time}</span>
                        {conversation.unread > 0 && (
                          <span className={unreadBadge}>
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className={lastMessage}>{conversation.lastMessage}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chi tiết hội thoại */}
        <Card className={p0}>
          <CardHeader>
            <div className={messageHeader}>
              {/* {conversations.map((conversation) => (
                <p key={conversation.id}>{conversation.customer}</p>
              ))} */}
              <p>
                {selectedConv ? selectedConv.customer : "choose a conversation"}
              </p>
            </div>
          </CardHeader>
          <CardContent className={p20}>
            <div className={messageWrapper}>
              {filteredMessages.length > 0 ? (
                filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={classNames(chat, {
                      [messageLeft]: msg.sender === "customer",
                      [messageRight]: msg.sender === "admin",
                    })}
                  >
                    {msg.sender === "customer" && (
                      <div className={customerImg}>
                        <img src="/src/assets/img/product1.jpg" alt="" />
                      </div>
                    )}

                    <div className={bubble}>
                      <p>{msg.content}</p>
                      <span>{msg.time}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: "center", color: "#777" }}>
                  No messages in this conversation.
                </p>
              )}
            </div>
          </CardContent>
          <div className={containerMessageTextarea}>
            <div className={messageTextarea}>
              <Button content={<GoLink />} />
              <Input type="textarea" placeholder="Type your message..." />
              <Button content={<LuSend />} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Messages;
