import axios from "axios";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Box from "src/components/Box";
import LabelledInput from "src/components/LabelledInput";
import LabelledTextarea from "src/components/LabelledTextarea";
import Text from "src/components/Text";
import theme from "src/styleguide/theme";
import { PINATA_KEY, PINATA_KEY_SECRET, PINATA_URL } from "src/utils/constants";
import PaymentSplit from "./components/PaymentSplit";
import Roadmap from "./components/Roadmap";
import RoadmapModal, { IRoadmap } from "./components/RoadmapModal";
import Team from "./components/Team";
import { ITeam } from "./components/TeamModal";

const Divider = () => (
  <Box my="4rem" bg={`${theme.colors["secondary-black"]}20`} height="0.1rem" />
);

const HomeComp = () => {
  const [files, setFiles] = useState<FileList>(null);
  const [roadmap, setRoadmap] = useState<IRoadmap[]>([]);
  const [team, setTeam] = useState<ITeam[]>([]);

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [smalldescription, setSmallDescription] = useState("");
  const [bigDescription, setBigDescription] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [valueProposition, setValueProposition] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [collectionUrl, setCollectionUrl] = useState("");

  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [adminAddress, setAdminAddress] = useState("");
  const [maximumTokens, setMaximumTokens] = useState("");
  const [maxPurchase, setMaxPurchase] = useState("");
  const [maxHolding, setMaxHolding] = useState("");
  const [price, setPrice] = useState("");
  const [publicStartTime, setPublicStartTime] = useState("");
  const [loadingUrl, setLoadingUrl] = useState("");
  const [presalePrice, setPresalePrice] = useState("");
  const [presaleStartTime, setPresaleStartTime] = useState("");
  const [presaleReservedTokens, setPresaleReservedTokens] = useState("");
  const [presaleMaxHolding, setPresaleMaxHolding] = useState("");
  const [presaleWhitelist, setPresaleWhitelist] = useState("");
  const [presaleWhitelistAll, setPresaleWhitelistAll] = useState([]);
  const [revealTime, setRevealTime] = useState("");
  const [projectUri, setProjectUri] = useState("");
  const [reservedTokens, setReservedTokens] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    // console.log(e.target.dir);
    setFiles(e.target.files);

    //   setSrc(e.target.value)
  };

  // useEffect(() => {
  //   if (price.length) {
  //     const wei = ethers.utils.parseUnits(price, 18);
  //     console.log({ wei });
  //   }
  // }, [price]);

  const upload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }

    const metadata = JSON.stringify({
      name: "test",
    });
    formData.append("metadata", metadata);

    const res = await axios.post(
      `${PINATA_URL}pinning/pinFileToIPFS`,
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": `multipart/form-data`,
          pinata_api_key: PINATA_KEY,
          pinata_secret_api_key: PINATA_KEY_SECRET,
        },
      }
    );

    console.log({ res });
  };
  return (
    <div>
      <h1>Admin Page</h1>
      <Box
        boxShadow="0 0 1px rgba(68, 68, 68, 0.6);"
        borderRadius="12px"
        mx="8rem"
        py="4rem"
        px="4rem"
        mb="4rem"
      >
        <Text fontSize="2rem" mb="3.2rem">
          Collection Details
        </Text>
        <LabelledInput label="Collection Name" set={setName} data={name} />
        <LabelledInput
          label="Collection Symbol"
          set={setSymbol}
          data={symbol}
        />
        <LabelledTextarea
          data={smalldescription}
          set={setSmallDescription}
          label="Short Description"
          placeholder="Short description about the project (max 100 characters)"
        />
        <LabelledTextarea
          data={bigDescription}
          set={setBigDescription}
          label="Long Description"
          placeholder="Long description about the project (max 250 characters) "
        />
        <LabelledTextarea
          data={teamDescription}
          set={setTeamDescription}
          label="Team Description"
          placeholder="Description about the Team (max 250 characters) "
        />
        <LabelledTextarea
          data={valueProposition}
          set={setValueProposition}
          label="Value Proposition"
        />
        <Divider />
        <Roadmap {...{ roadmap, setRoadmap }} />
        <Divider />
        <Team team={team} setTeam={setTeam} />
        <Divider />
        <LabelledInput
          data={logoUrl}
          set={setLogoUrl}
          label="Project Logo URL"
        />
        <LabelledInput
          data={bannerImageUrl}
          set={setBannerImageUrl}
          label="Banner Image URL"
        />
        <LabelledInput
          data={contactEmail}
          set={setContactEmail}
          label="Contact E-mail"
        />
        <LabelledInput
          data={collectionUrl}
          set={setCollectionUrl}
          label="Project Website URL"
        />
        <Divider />
        <Text fontSize="2rem" mb="3.2rem">
          Token Details
        </Text>
        <LabelledInput label="Token Name" set={setTokenName} data={tokenName} />
        <LabelledInput
          label="Token Symbol"
          set={setTokenSymbol}
          data={tokenSymbol}
        />
        <LabelledInput
          label="Admin Wallet Address"
          set={setAdminAddress}
          data={adminAddress}
        />
        <LabelledInput
          label="Maximum Tokens in Collection"
          set={setMaximumTokens}
          data={maximumTokens}
        />
        <LabelledInput
          label="Maximum Purchases per sale"
          set={setMaxPurchase}
          data={maxPurchase}
        />
        <LabelledInput
          label="Maximum Tokens held by one user"
          set={setMaxHolding}
          data={maxHolding}
        />
        <LabelledInput label="Price of Token" set={setPrice} data={price} />
        <LabelledInput
          label="Public Sale Start Time"
          set={setPublicStartTime}
          data={publicStartTime}
        />
        <LabelledInput
          label="Loading Image URL"
          set={setLoadingUrl}
          data={loadingUrl}
        />
        <Divider />
        <Text fontSize="2rem" mb="3.2rem">
          Presale
        </Text>
        <LabelledInput
          label="Presale Price"
          set={setPresalePrice}
          data={presalePrice}
        />
        <LabelledInput
          label="Presale Start Time"
          set={setPresaleStartTime}
          data={presaleStartTime}
        />
        <LabelledInput
          label="Number of Presale Reserved Tokens"
          set={setPresaleReservedTokens}
          data={presaleReservedTokens}
        />
        <LabelledInput
          label="Presale Maximum Holding by one User"
          set={setPresaleMaxHolding}
          data={presaleMaxHolding}
        />
        <Text color="grey" fontSize="1.6rem" mb="3.2rem">
          PRESALE WHITELIST
        </Text>
        <Box row alignItems="center">
          <LabelledInput
            label="Enter wallet address of user to whitelist (Ensure wallet address is correct)"
            data={presaleWhitelist}
            set={setPresaleWhitelist}
          />
          <Box
            ml="2rem"
            py="1rem"
            borderRadius="4px"
            px="3.2rem"
            bg="primary-blue"
            color="white"
            cursor="pointer"
            onClick={() => {
              setPresaleWhitelistAll([
                ...presaleWhitelistAll,
                presaleWhitelist,
              ]);
              setPresaleWhitelist("");
            }}
          >
            + Add
          </Box>
        </Box>
        {presaleWhitelistAll.map((w) => (
          <Box key={w} fontSize="1.2rem" mb="0.8rem">
            {w}✅
          </Box>
        ))}
        <Divider />
        <PaymentSplit />
        <Divider />
        <Text color="grey" fontSize="1.6rem" mb="3.2rem">
          REVEALABLES
        </Text>
        <LabelledInput
          label="Reveal Time"
          data={revealTime}
          set={setRevealTime}
        />
        <LabelledInput
          label="Project URI"
          data={projectUri}
          set={setProjectUri}
        />
        <Divider />
        <Text color="grey" fontSize="1.6rem" mb="3.2rem">
          RESERVABLES
        </Text>
        <LabelledInput
          label="No. of Tokens to Reserve"
          data={reservedTokens}
          set={setReservedTokens}
        />
        <LabelledInput
          label="Receiver Address"
          data={receiverAddress}
          set={setReceiverAddress}
        />
      </Box>
      {/* <form>
        <input type="text" placeholder="Enter name of project" />
        <input type="text" placeholder="Enter project symbol" />
        <input type="text" placeholder="Enter wallet address of admin" />
        <input
          type="text"
          placeholder="Enter max number of tokens in collection"
        />
        <input
          type="text"
          placeholder="Enter max number of tokens that can be bought in a single transaction"
        />
        <input
          type="text"
          placeholder="Enter max number of tokens to be held by a single collector"
        />
        <input type="text" placeholder="Primary sale price" />
        <input type="text" placeholder="Primary Sale Date" />
        <input type="text" placeholder="Primary Sale Date" />
        <input type="text" placeholder="Primary Sale Date" />
        <input type="text" placeholder="Primary Sale Date" />
        <input type="text" placeholder="Primary Sale Date" />
        <input type="text" placeholder="Primary Sale Date" />
        <input
          onChange={handleChange}
          type="file"
          directory=""
          mozdirectory=""
          webkitdirectory=""
        />
        <button onClick={upload}>Upload</button>
      </form>
      <Box
        bg="red"
        height="10rem"
        width="10rem"
        css={`
          border: 1px solid black;
        `}
      ></Box> */}
    </div>
  );
};

export default HomeComp;
