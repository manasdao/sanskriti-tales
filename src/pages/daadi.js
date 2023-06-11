import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import logo from "../../public/assets/svgs/logo.svg";

const RobinChatBubble = ({ message }) => {
  return (
    <div
      className=" my-2 self-start rounded-lg rounded-tl border border-gray-300 px-3 py-2 text-sm text-white"
      style={{
        backgroundImage:
          "linear-gradient(110.28deg, #FB923C 0.4%, #FB423C 101.11%)",
      }}
    >
      {message}
    </div>
  );
};
const UserChatBubble = ({ message }) => {
  return (
    <div
      className="my-2 self-end rounded-lg  rounded-tr px-3 py-2 text-sm text-gray-800"
      style={{
        backgroundImage:
          "linear-gradient(110.28deg, rgba(147, 150, 179, 0.36) 0.2%, rgba(97, 98, 109, 0.12) 101.11%)",
      }}
    >
      {message}
    </div>
  );
};
function Daadi() {
  // ! Refs

  const chatModalRef = useRef(null);
  const chatBoxRef = useRef(null);
  const currentRobinAnswerRef = useRef("");
  const chatLength = useRef(1);
  // ! States
  const [currentStory, setCurrentStory] = useState(null);
  const [userChatMessage, setUserChatMessage] = useState("");
  const [robinChat, setRobinChat] = useState([
    {
      message: "Hello beta, What did you learn in this story?",
      from: "ROBIN",
    },
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  // ! Effects
  useEffect(() => {
    let story = window.localStorage.getItem("CURRENT_STORY");
    setCurrentStory(JSON.parse(story));
  }, []);
  useEffect(() => {
    chatLength.current = robinChat.length;
  }, [robinChat]);

  // ! Handlers
  const askRobinGlobal = async (prompt) => {
    setIsChatLoading(true);
    // const response = await fetch(
    //   `${process.env.NEXT_PUBLIC_API_ENDPOINT}chat`,
    //   {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       prompt,
    //       data: currentStory,
    //     }),
    //   }
    // );
    const response = await fetch(`/api/question`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: prompt,
        story: currentStory,
      }),
    });
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    // setRobinChat((prevChat) => [...prevChat, { message: "", from: "ROBIN" }]);
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        currentRobinAnswerRef.current = "";
        setIsChatLoading(false);

        break;
      }
      // Massage and parse the chunk of data
      const chunk = decoder.decode(value);
      //   console.log("chunk", chunk);
      const message = JSON.parse(chunk).choices[0].message;
      let newMessage = message.content.response
        ? message.content.response
        : message.content;
      //   setCurrentRobinAnswer((r) => newMessage);
      let currentChatIndex = chatLength.current + 1;
      //   console.log("currentChatIndex", currentChatIndex);
      //   setRobinChat((prevChat) => {
      //     let newChat = prevChat;
      //     newChat[currentChatIndex]["message"] = newMessage;
      //     return [...newChat];
      //   });
      setRobinChat((prevChat) => [
        ...prevChat,
        { message: newMessage, from: "ROBIN" },
      ]);

      currentRobinAnswerRef.current = "";
    }
  };
  const sendUserChatMessage = () => {
    setRobinChat((prevChat) => [
      ...prevChat,
      { message: userChatMessage, from: "USER" },
    ]);
    setUserChatMessage("");
    askRobinGlobal(userChatMessage);
  };
  //   console.log("robinChat", robinChat);
  return (
    <div className=" h-screen flex items-center flex-col  pt-2 pb-4 px-4">
      <div className="flex items-center w-full ">
        <Image src={logo} className=" w-16" alt="" />
        <span className="font-[600] tracking-wide text-orange-500 text-xl">
          Talk to Daadi
        </span>
      </div>
      <div className="flex flex-col h-full w-full justify-between items-center">
        <div
          ref={chatBoxRef}
          className="flex w-full flex-col items-center overflow-y-scroll text-sm"
        >
          {robinChat.map((singleChat, index) => {
            if (singleChat.from == "ROBIN")
              return (
                <RobinChatBubble
                  key={`${singleChat.message} - ${index}`}
                  message={singleChat.message}
                />
              );
            if (singleChat.from == "USER")
              return (
                <UserChatBubble
                  key={`${singleChat.message} - ${index}`}
                  message={singleChat.message}
                />
              );
          })}
        </div>
        <div className="w-full">
          <div className="relative mt-2 flex w-full items-center rounded-md  border border-gray-600">
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Ask Daadi anything"
              className="mt-0.5 block  w-full rounded-md border-none bg-transparent px-2 py-1.5 pb-2 text-xs text-gray-800 shadow-sm outline-none focus:border-none focus:outline-none focus:ring-0"
              value={userChatMessage}
              onKeyDown={(e) => {
                if (e.key == "Enter" || e.key == "Return")
                  sendUserChatMessage();
              }}
              onChange={(e) => {
                setUserChatMessage(e.target.value);
              }}
            />
            <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
              {userChatMessage && (
                <PaperAirplaneIcon
                  className="cursor-pointer text-gray-300"
                  width={24}
                  onClick={sendUserChatMessage}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Daadi;
