/* eslint-disable @typescript-eslint/no-unused-vars */
import Navbar from "./Navbar"
import GGPLogo from "./assets/logo.jpeg"
import Howitwork from "./assets/GGP_howitworks.png"

function App() {
  return (
    <>
      <Navbar />
      <div className="md:px-10 mb-10">
        <img src={GGPLogo} alt="logo" width={200} height={200} className="mx-auto mt-8" />
        <p className="mt-8 text-center px-8">
          <span className="text-lg">
            <b>Good Game Points</b> is an in-game token(ERC4626 & ERC20) designed to sustain the GameFi economy within Voxelverses. Backed by StakeStone or LST, GGP aims to address the key challenges faced by traditional GameFi projects by creating a sustainable and long-term economic model.
          </span>
          <br/><br/>
          <b className="text-lg">Problems of GameFi:</b><br/><br/>

          1. <b>Unsustainable Game Economics:</b> Many GameFi projects suffer from unstable and unsustainable economic models, leading to inflation or deflation of in-game assets.<br/>
          2. <b>Short-Term Life Cycle:</b> Traditional GameFi projects often have a short-lived existence due to the lack of long-term value and utility for their tokens.<br/>
          3. <b>Lack of Real Utility for Tokens:</b> Most GameFi tokens lack tangible utility, making them speculative assets rather than integral parts of the game ecosystem.<br/><br/>

          <b className="text-lg">How it works:</b><br/><br/>
          <img src={Howitwork} className="w-full md:px-10" />
        </p>
      </div>
    </>
  )
}

export default App
