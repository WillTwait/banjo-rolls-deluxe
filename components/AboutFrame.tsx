import Image from "next/image";
import HyperButton from "./HyperButton";
import Frame from "./frame";

export default function AboutFrame() {
  return (
    <Frame>
      <div className="flex p-4 flex-col md:flex-row gap-4 items-center">
        {/* Icon Section */}
        <div className="flex-shrink-0">
          <div className="relative w-24 h-24 md:w-32 md:h-32">
            <Image
              src="/icon.png"
              alt="Banjo Rolls Deluxe Icon"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-grow">
          <p className="mb-2 text-sm">
            I hope you are enjoying this tool and all of its deluxe features.
          </p>

          <div className="text-xs space-y-1">
            <p className="font-bold">Tips:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>If sound stops working, turn it off and on again.</li>
              <li>If metronome stops working, turn it off and on again.</li>
              <li>If anything stops working, turn it off and on again.</li>
              <li>If that doesn't work, refresh the page.</li>
              <li>If that doesn't work, yell at me online.</li>
            </ul>

            <div className="pt-1">
              For feedback or feature requests, contact me via{" "}
              <HyperButton
                text="email"
                onClick={() => {
                  window.location.href = "mailto:will.twait@gmail.com";
                }}
              />{" "}
              or{" "}
              <HyperButton
                text="twitter"
                onClick={() => {
                  window.location.href = "https://x.com/willtwait";
                }}
              />
              .
            </div>
            <div>
              Source code for this project can be found on{" "}
              <HyperButton
                text="github"
                onClick={() => {
                  window.location.href =
                    "https://github.com/WillTwait/banjo-rolls-deluxe";
                }}
              />
              .
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}
