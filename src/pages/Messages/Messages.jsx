import styles from "./styles.module.scss";
import Button from "@components/ui/Button/Button";
import Information from "@components/ui/Information/Information";
import Input from "@components/ui/Input/Input";
import Card from "@components/Card/Card";
import CardHeader from "@components/Card/CardHeader/CardHeader";
import CardContent from "@components/Card/CardContent/CardContent";
import classNames from "classnames";
import { conversations, messages } from "./constant";
import { LuMessageCircleMore, LuSend } from "react-icons/lu";
import { TiMessages } from "react-icons/ti";
import { GoLink } from "react-icons/go";
import { useState, useRef, useEffect } from "react";
import { HiMiniPlus } from "react-icons/hi2";

function Messages() {
  const {
    container,
    header,
    title,
    containerInformation,
    grid,
    gridCols2,
    messageWrapper,
    customerName,
    messageHeader,
    messageTitle,
    lastMessage,
    messageInfo,
    messageRight,
    messageLeft,
    chat,
    bubble,
    messageTextarea,
    containerMessageTextarea,
    messageMeta,
    messageTime,
    unreadBadge,
    active,
    avatarContainer,
    avatarFallback,
    avatarImg,
    chatDetail,
    p0,
    p20,
  } = styles;

  const [selectedConversation, setSelectedConversation] = useState(null);
  const chatEndRef = useRef(null);

  const totalConversations = conversations.length;
  const newConversations = conversations.filter(
    (msg) => msg.time >= "10:00" && msg.time <= "12:00"
  ).length;

  const informations = [
    {
      title: "Total Conversations",
      icon: <TiMessages />,
      value: totalConversations,
    },
    {
      title: "New Conversations",
      icon: <LuMessageCircleMore />,
      value: newConversations,
    },
  ];

  const selectedConv = conversations.find(
    (conv) => conv.id === selectedConversation
  );

  const filteredMessages = messages.filter(
    (msg) => msg.conversationId === selectedConversation
  );

  // useEffect(() => {
  //   chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [filteredMessages, selectedConversation]);

  const Avatar = ({ name, image, size = 40 }) => {
    const firstLetter = name?.charAt(0)?.toUpperCase();
    return (
      <div className={avatarContainer} style={{ width: size, height: size }}>
        {image ? (
          <img
            src={image}
            alt={name}
            className={avatarImg}
            style={{ width: size, height: size }}
          />
        ) : (
          <div className={avatarFallback} style={{ width: size, height: size }}>
            {firstLetter}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={container}>
      {/* Header */}
      <div className={header}>
        <div className={title}>
          <h2>Message Center</h2>
          <p>Manage and respond to messages from customers.</p>
        </div>
        <Button icon={<HiMiniPlus />} content="New Message" />
      </div>

      {/* Thống kê */}
      <div className={containerInformation}>
        {informations.map((info) => (
          <Information
            key={info.title}
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
              <p>Messages</p>
              <Input
                type="text"
                placeholder="Search conversations..."
                showIcon
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
                  <Avatar
                    name={conversation.customer}
                    image={conversation.image}
                  />
                  <div
                    className={styles.messageDetail}
                    onClick={() => (conversation.unread = 0)}
                  >
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
              <p>
                {selectedConv ? selectedConv.customer : "Choose a conversation"}
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
                      <div className={chatDetail}>
                        <Avatar
                          name={selectedConv?.customer}
                          image={selectedConv?.image}
                          size={32}
                        />
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
              <div ref={chatEndRef} />
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
