import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import ReactAudioPlayer from "react-audio-player";
import bgMandala from "../../public/assets/svgs/bg_mandala.svg";

import { Poppins } from "next/font/google";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import Image from "next/image";
import posthog from "posthog-js";
function Story() {
  // ! Hooks init
  const { query, push } = useRouter();
  const audioRef = useRef(null);
  // ! Local states
  const [isLandscape, setIsLandscape] = useState(false);
  const [storyline, setStoryline] = useState(null);
  const [currentStorylineIndex, setCurrentStorylineIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  // ! Effects
  useEffect(() => {
    let portrait = window.matchMedia("(orientation: portrait)");
    if (!portrait.matches) setIsLandscape(true);
    console.log("portrait", portrait);
    portrait.addEventListener("change", function (e) {
      if (e.matches) {
        // Portrait mode
        setIsLandscape(false);
      } else {
        // Landscape
        setIsLandscape(true);
        setTimeout(() => {
          setIsLoaded(true);
        }, 600);
        posthog.capture("story_started", {
          character: query.character,
        });
      }
    });
  }, []);
  useEffect(() => {
    if (storyline) {
      posthog.capture("watching_story", {
        slide_number: currentStorylineIndex,
      });
    }
  }, [currentStorylineIndex, storyline]);

  useEffect(() => {
    if (query.character) {
      let selectedLanguage = window.localStorage.getItem("SELECTED_LANGUAGE");
      let selectedQuality = window.localStorage.getItem("SELECTED_QUALITY");
      axios
        .get(
          `/api/get-story/?language=${selectedLanguage}&quality=${selectedQuality}&character=${query.character}`
        )
        .then((res) => {
          console.log("res", res.data);
          setStoryline(res.data);
        })
        .catch((err) => console.log("err", err));
    }
  }, [query]);
  // useEffect(() => {

  // }, []);

  // ! Handlers
  const getAudio = () => {
    switch (currentStorylineIndex) {
      case 0:
        return "https://audio.jukehost.co.uk/Dobg7WldEHHLEYwOZWSx8h42dYlPtOSe";
      case 1:
        return "https://audio.jukehost.co.uk/RS53eacavfp5y9mU8kfNzjsLSa7Qsuqo";
      case 2:
        return "https://audio.jukehost.co.uk/X9CEJ48jsGc7cjn7fKTS2P801YZp4aka";
      case 3:
        return "https://audio.jukehost.co.uk/ufmH7xwP1y6mHe7G420ngO5axD6298g9";
      case 4:
        return "https://audio.jukehost.co.uk/nAMW5BaaNsWpjjqPzOEhuZmdK1UpAICb";
      case 5:
        return "https://audio.jukehost.co.uk/zosqsu53XlrxHt5wCkfzGMDR4JhWmOaz";
      default:
        return "https://audio.jukehost.co.uk/zosqsu53XlrxHt5wCkfzGMDR4JhWmOaz";
    }
  };
  if (!isLandscape)
    return (
      <main
        className={`flex relative min-h-screen flex-col items-center justify-center py-36 px-8 ${poppins.className}`}
      >
        <Image
          src={bgMandala}
          className="absolute opacity-5  bg-blend-overlay top-0 w-full"
          alt=""
        />
        <Image
          src={bgMandala}
          className="absolute rotate-180 opacity-5  bg-blend-overlay bottom-0 w-full"
          alt=""
        />
        <h2 className="text-orange-500 font-[600] text-xl pb-2">
          Please rotate your phone
        </h2>
        <p className="text-gray-500 text-sm text-center">
          The story is best experienced in landscape mode.
        </p>
      </main>
    );
  if (isLandscape)
    return (
      <div className="w-screen h-screen relative">
        {storyline && (
          <img
            className="w-full h-full object-cover"
            // height={"100%"}
            // width={"100%"}
            src={storyline[currentStorylineIndex].image}
          />
        )}
        {currentStorylineIndex !== 0 && (
          <ArrowLeftCircleIcon
            width={36}
            onClick={() => {
              setCurrentStorylineIndex((prevIndex) => {
                if (prevIndex == 0) return prevIndex;
                return prevIndex - 1;
              });
            }}
            className="absolute text-orange-400 bg-white rounded-full top-[50%] -translate-y-[50%] left-5"
          />
        )}
        {currentStorylineIndex !== storyline?.length - 1 && (
          <ArrowRightCircleIcon
            width={36}
            onClick={() => {
              setCurrentStorylineIndex((prevIndex) => {
                if (prevIndex == storyline.length - 1) return prevIndex;
                return prevIndex + 1;
              });
            }}
            className="absolute text-orange-400 bg-white rounded-full top-[50%] -translate-y-[50%] right-5"
          />
        )}
        {storyline && (
          <div
            style={{ boxShadow: "0px 8px 0px #FCDECC" }}
            className="absolute bg-white bottom-8 px-4 py-2 left-[50%] -translate-x-[50%] w-[90%] rounded-lg border-2 border-orange-200"
          >
            {storyline[currentStorylineIndex].line}
          </div>
        )}
        {currentStorylineIndex == storyline?.length - 1 && (
          <button
            type="button"
            className="absolute top-3 right-3 inline-flex items-center gap-x-2 rounded-md bg-orange-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
            onClick={() => {
              push("/daadi");
              posthog.capture("ask_daadi");
              window.localStorage.setItem(
                "CURRENT_STORY",
                JSON.stringify(storyline)
              );
            }}
          >
            Ask Daadi
            <ChevronRightIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
          </button>
        )}
        {/* {storyline && (
          <AudioPlayer
            autoPlay
            src={getAudio()}
            onPlay={(e) => console.log("onPlay")}
            ref={audioRef}
            onLoadedData={function (e) {
              audioRef.current.handlePlay();
              console.log("audio", e, this);
            }}
          />
        )} */}
        {storyline && (
          <ReactAudioPlayer
            src={getAudio()}
            ref={(element) => {
              // this.rap = element;
              // element.audioEl.current.play();
            }}
            autoPlay
            controls
            onError={(err) => {
              console.log(err);
            }}
            onLoadedMetadata={function (e) {
              console.log("audio", e, this);
            }}
          />
        )}
      </div>
    );
}

export default Story;
