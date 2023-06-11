import Image from "next/image";
import React from "react";
import logo from "../../public/assets/svgs/logo.svg";
import bgMandala from "../../public/assets/svgs/bg_mandala.svg";

import { Poppins } from "next/font/google";
import { useRouter } from "next/router";
import posthog from "posthog-js";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
const charactersToShow = ["Krishna", "Hanuman", "Shiva", "Vishnu"];
const characterImageUrls = [
  "https://cdn.discordapp.com/attachments/1029346243824078859/1117280936736870571/anjanay.png",
  "https://i.ibb.co/6YkWkqc/image-10.png",
  "https://cdn.discordapp.com/attachments/1029346243824078859/1117280872006156369/anjanay.png",
  "https://cdn.discordapp.com/attachments/1029346243824078859/1117280906051330129/anjanay.png",
];
function Characters() {
  const { push } = useRouter();
  return (
    <main
      className={`flex relative min-h-screen flex-col items-center justify-start pb-1 px-8 ${poppins.className}`}
    >
      {" "}
      <Image
        src={bgMandala}
        className="absolute rotate-180 opacity-5  bg-blend-overlay bottom-0 w-full"
        alt=""
      />
      <section className="w-full flex flex-col items-center ">
        <div className="flex items-center w-full ml-8">
          <Image src={logo} className=" w-28" alt="" />
          <span className="font-[600] tracking-wide text-orange-500 text-xl">
            Sanskriti Tales
          </span>
        </div>
      </section>
      <section className="grid grid-cols-2 gap-8 w-full">
        {charactersToShow.map((singleCharacter, index) => {
          return (
            <div
              key={singleCharacter}
              className="border-2 border-orange-200 w-full bg-white rounded-lg flex items-center flex-col"
              style={{ boxShadow: "0px 8px 0px #FCDECC" }}
              onClick={() => {
                console.log("clicked");
                push(`/story/?character=${singleCharacter}`);
                posthog.capture("character_selected", {
                  character: singleCharacter,
                });
              }}
            >
              <img src={characterImageUrls[index]} className="rounded-t-lg" />
              <span className="text-center text-gray-500 w-full font-[600]">
                {singleCharacter}
              </span>
            </div>
          );
        })}
      </section>
    </main>
  );
}

export default Characters;
