import { XCircleOutline } from "heroicons-react";
import { useAppState } from "hooks/useAppState";
import { isMobile } from "react-device-detect";
import { TwitterShareButton } from "react-twitter-embed";
import {
  goToTokenExplorer,
  shortenAddress,
  goToWalletExplorer,
  shortenText,
} from "utils";

export function NFTDetailModal() {
  const { selectedNft, setSelectedNft, project, selectedExhibit } =
    useAppState();

  return (
    <>
      {selectedNft && (
        <div className="absolute z-20 w-screen h-screen bg-black bg-opacity-75 flex flex-col">
          <main className="card w-full h-full mx-auto my-auto overflow-auto bg-black md:w-4/5 lg:card-side lg:h-auto">
            <section className="p-3 mx-auto">
              {selectedNft.imageType === "image" && (
                <img
                  className="rounded"
                  src={selectedNft.image}
                  width={512}
                  height={512}
                  alt={selectedNft.name}
                />
              )}
              {selectedNft.imageType === "video" && (
                <video
                  loop={!isMobile}
                  autoPlay={!isMobile}
                  controls
                  crossOrigin="anonymous"
                  width={512}
                  height={512}
                >
                  <source
                    src={selectedNft.image}
                    type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
                  />
                </video>
              )}
              {selectedNft.imageType === "html" && (
                <iframe
                  height={window.innerWidth}
                  width={window.innerWidth}
                  src={selectedNft.externalUrl}
                  frameBorder="0"
                />
              )}
            </section>

            <section className="card-body gap-5 lg:w-1/2">
              <div className="relative flex items-center justify-between">
                <h1 className="card-title text-center flex-grow">
                  {selectedNft.name.length > 24
                    ? shortenText(selectedNft.name, 24)
                    : selectedNft.name}
                </h1>
                <button
                  className="btn btn-ghost btn-sm btn-circle"
                  onClick={() => setSelectedNft(null)}
                >
                  <XCircleOutline />
                </button>
              </div>

              {selectedNft.description && (
                <div tabIndex={0} className="collapse collapse-arrow border">
                  <div className="collapse-title font-bold">Description</div>
                  <div className="collapse-content">
                    <p>{selectedNft.description}</p>
                  </div>
                </div>
              )}

              {!!selectedNft.attributes?.length && (
                <div tabIndex={0} className="collapse collapse-arrow border">
                  <div className="collapse-title font-bold">Attributes</div>
                  <div className="collapse-content">
                    {selectedNft.attributes.map((it) => (
                      <div
                        key={
                          it.name + Math.floor(Math.random() * 1000).toString()
                        }
                        className="badge mr-3 badge-primary"
                      >
                        {shortenText(`${it.name}: ${it.value}`, 32)}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <section className="grid gap-3">
                <div className="flex justify-center gap-3">
                  <div>
                    <span className="font-bold">Mint: </span>
                    <button
                      className="link"
                      onClick={() => goToTokenExplorer(selectedNft.mint!)}
                    >
                      {shortenAddress(selectedNft.mint!)}
                    </button>
                  </div>

                  <div>
                    <span className="font-bold">Owner: </span>
                    <button
                      className="link"
                      onClick={() => goToWalletExplorer(selectedNft.owner!)}
                    >
                      {shortenAddress(selectedNft.owner!)}
                    </button>
                  </div>
                </div>

                <div className="flex justify-center items-center gap-3">
                  {selectedNft.externalUrl && (
                    <a
                      href={selectedNft.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="link"
                    >
                      Visit
                    </a>
                  )}
                  {selectedExhibit && project && (
                    <div className="">
                      <TwitterShareButton
                        url={""}
                        options={{
                          text: `✨ Check out this exhibition in the ${project.twitterHandle} MetaGallery! ✨\n\n“${selectedExhibit.title}” - curated by ${selectedExhibit.curator}\n\n`,
                        }}
                      />
                    </div>
                  )}
                </div>
              </section>
            </section>
          </main>
        </div>
      )}
    </>
  );
}
