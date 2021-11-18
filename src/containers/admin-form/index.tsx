import axios from "axios";
import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import Box from "src/components/Box";
import LabelledInput from "src/components/LabelledInput";
import LabelledTextarea from "src/components/LabelledTextarea";
import Text from "src/components/Text";
import If from "src/components/If";
import theme from "src/styleguide/theme";
import { PINATA_KEY, PINATA_KEY_SECRET, PINATA_URL } from "src/utils/constants";
import PaymentSplit, { IPayment } from "./components/PaymentSplit";
import Roadmap from "./components/Roadmap";
import RoadmapModal, { IRoadmap } from "./components/RoadmapModal";
import Team from "./components/Team";
import { ISocialLinks, ITeam, SocialMedia } from "./components/TeamModal";
import LabelledDateTime from "src/components/LabelledDateTime";
import useListeners from "src/ethereum/useListeners";
import { StatesContext } from "src/components/StatesContext";
import useContract from "src/ethereum/useContracts";
import Modal from "src/components/Modal";

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

  const [socialLinks, setSocialLinks] = useState<ISocialLinks[]>([]);
  const [socialLink, setSocialLink] = useState("");
  const [social, setSocial] = useState<SocialMedia[]>([
    SocialMedia.Twitter,
    SocialMedia.Facebook,
    SocialMedia.Discord,
    SocialMedia.Instagram,
    SocialMedia.Linkedin,
  ]);
  const [selectInput, setSelectInput] = useState(social[0]);

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
  const [upfrontFee, setUpfrontFee] = useState({});

  const [paymentSplit, setPaymentSplit] = useState<IPayment>({
    payees: [],
    shares: [],
    nftify: "0xd18Cd50a6bDa288d331e3956BAC496AAbCa4960d",
    nftifyShares: ethers.utils.parseUnits("15", 16),
  });

  const [revealTime, setRevealTime] = useState("");
  const [projectUri, setProjectUri] = useState("");
  const [reservedTokens, setReservedTokens] = useState("");

  const [isCreated, setIsCreated] = useState(false);

  const [contractAddress, setContractAddress] = useState("");

  const [metadataCID, setMetadataCID] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const state = useContext(StatesContext);

  const CollectionFactory = useContract("CollectionFactory", state.provider);

  useEffect(() => {
    const getContractInfo = async () => {
      const nftfyAddress = await CollectionFactory.callStatic.nftify();
      const nftfySharesBN = await CollectionFactory.callStatic.nftifyShares();
      const nftfyShares = ethers.utils.formatUnits(nftfySharesBN, 16);
      const upfrontFee = await CollectionFactory.callStatic.upfrontFee();
      const upfrontFeeInETH = ethers.utils.formatUnits(upfrontFee, 18);
      setUpfrontFee(upfrontFee);
    };
    if (CollectionFactory) {
      getContractInfo();
    }
  }, [CollectionFactory]);

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   e.preventDefault();
  //   setFiles(e.target.files);
  // };

  useEffect(() => {
    if (contractAddress.length > 0) {
      // console.log({ contractAddress });
      setIsCreated(true);
    }
  }, [contractAddress]);

  const handleCreate = async () => {
    setIsLoading(true);

    const shares = paymentSplit?.shares.map((share) => {
      return ethers.utils.parseUnits(share, 16);
    });

    const jsonBody = {
      collectionDetails: {
        name: name,
        symbol: symbol,
        smallDescription: smalldescription,
        bigDescription: bigDescription,
        teamDescription: teamDescription,
        valueProposition: valueProposition,
        roadmap: roadmap,
        team: team,
        logoUrl: logoUrl,
        bannerImageUrl: bannerImageUrl,
        contactEmail: contactEmail,
        socialLinks: socialLinks,
        collectionUrl: collectionUrl,
      },
      tokenDetails: {
        basic: {
          name: tokenName,
          symbol: tokenSymbol,
          admin: adminAddress,
          maximumTokens: maximumTokens,
          maxPurchase: maxPurchase,
          maxHolding: maxHolding,
          price: ethers.utils.parseUnits(price, 18),
          publicSaleStartTime: publicStartTime,
          loadingURI: loadingUrl,
        },
        presale: {
          presalePrice: ethers.utils.parseUnits(presalePrice, 18),
          presaleStartTime: presaleStartTime,
          presaleReservedTokens: presaleReservedTokens,
          presaleMaxHolding: presaleMaxHolding,
          presaleWhitelist: presaleWhitelistAll,
        },
        paymentSplitter: {
          payees: paymentSplit.payees,
          shares: shares,
          nftify: paymentSplit.nftify,
          nftifyShares: paymentSplit.nftifyShares,
        },
        revealable: {
          revealAfterTimestamp: revealTime,
          projectURIProvenance: ethers.utils.keccak256(
            ethers.utils.defaultAbiCoder.encode(["string"], [projectUri])
          ),
        },
        reservable: {
          tokensToBeReserved: reservedTokens,
        },
      },
    };
    const res = await axios.post(
      `${PINATA_URL}pinning/pinJSONToIPFS`,
      jsonBody,
      {
        headers: {
          pinata_api_key: PINATA_KEY,
          pinata_secret_api_key: PINATA_KEY_SECRET,
        },
      }
    );
    const transaction = await CollectionFactory.connect(
      state.signer
    ).createProject(
      jsonBody.tokenDetails.basic, // _basicCollection
      jsonBody.tokenDetails.presale, // _presaleable
      jsonBody.tokenDetails.paymentSplitter, // _paymentSplitter
      jsonBody.tokenDetails.revealable, // _revealable
      res.data.IpfsHash, // _metadata
      { value: upfrontFee.toString() }
    );
    const event = (await transaction.wait())?.events?.filter(
      (event) => event.event == "CollectionCreated"
    )[0]?.args;
    setMetadataCID(res.data.IpfsHash);
    setContractAddress(event?.project);

    // console.log({ jsonBody, res, event });
  };

  const onAdd = () => {
    setSocialLinks([
      ...socialLinks,
      { socialMedia: selectInput, url: socialLink },
    ]);
    const newSocial = social.filter((el) => el != selectInput);
    setSocialLink("");

    setSelectInput(newSocial[0]);
    setSocial(newSocial);
  };

  // const upload = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   for (let i = 0; i < files.length; i++) {
  //     formData.append("file", files[i]);
  //   }

  //   const metadata = JSON.stringify({
  //     name: "test",
  //   });
  //   formData.append("metadata", metadata);

  //   const res = await axios.post(
  //     `${PINATA_URL}pinning/pinFileToIPFS`,
  //     formData,
  //     {
  //       maxBodyLength: Infinity,
  //       headers: {
  //         "Content-Type": `multipart/form-data`,
  //         pinata_api_key: PINATA_KEY,
  //         pinata_secret_api_key: PINATA_KEY_SECRET,
  //       },
  //     }
  //   );

  //   console.log({ res });
  // };

  return (
    <div>
      <Box mx="8rem" my="4rem" fontSize="3.2rem" row between maxWidth="50rem">
        Admin Page
      </Box>
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
          Social Media Links
        </Text>
        <If
          condition={!!social.length}
          then={
            <Box row alignItems="center">
              <Box
                as="select"
                pl="0.4rem"
                outline="none"
                py="1rem"
                value={selectInput}
                onChange={(e) => {
                  setSelectInput(e.target.value);
                }}
                mr="2rem"
              >
                {social.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Box>
              <LabelledInput
                label="Enter Link:"
                data={socialLink}
                set={setSocialLink}
              />
              <Box
                fontSize="1.6rem"
                bg="primary-blue"
                color="white"
                py="1rem"
                px="2.4rem"
                borderRadius="4px"
                cursor="pointer"
                ml="2rem"
                onClick={onAdd}
              >
                Add
              </Box>
            </Box>
          }
        />
        {socialLinks.map((item: ISocialLinks) => (
          <Box key={item.url} row alignItems="center">
            <Text fontSize="1.4rem" fontWeight="bold" minWidth="10rem">
              {item.socialMedia}:
            </Text>
            <Text fontSize="1.2rem">{item.url}</Text>
          </Box>
        ))}
        {/* <LabelledInput label="Twitter" set={setTwitter} data={twitter} />
        <LabelledInput label="Facebook" set={setFacebook} data={facebook} />
        <LabelledInput label="Discord" set={setDiscord} data={discord} />
        <LabelledInput label="Instagram" set={setInstagram} data={instagram} />
        <LabelledInput label="Linkedin" set={setLinkedin} data={linkedin} /> */}
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
        <LabelledInput
          label="Price of Token(in ETH)"
          set={setPrice}
          data={price}
        />
        <LabelledDateTime
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
          label="Presale Price(in ETH)"
          set={setPresalePrice}
          data={presalePrice}
        />
        <LabelledDateTime
          label="Presale Start Time"
          data={presaleStartTime}
          set={setPresaleStartTime}
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
        <PaymentSplit
          paymentSplit={paymentSplit}
          setPaymentSplit={setPaymentSplit}
        />
        <Divider />
        <Text color="grey" fontSize="1.6rem" mb="3.2rem">
          REVEALABLES
        </Text>
        <LabelledDateTime
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
        <Box
          py="1rem"
          borderRadius="4px"
          px="3.2rem"
          bg={isCreated ? "primary-green" : "primary-blue"}
          color="white"
          cursor="pointer"
          onClick={isLoading ? null : handleCreate}
        >
          {isLoading
            ? isCreated
              ? "Success"
              : "Transaction is processing..."
            : "Create"}
        </Box>
      </Box>
      <If
        condition={isCreated}
        then={
          <Modal>
            <Box column fontSize="3.2rem" mb="4rem">
              Thank you for choosing NFTfy!
              <Text fontSize="1.6rem">
                Your contract has been created and deployed.
              </Text>
            </Box>
            <Text fontSize="1.8rem">Metadata URL:</Text>
            <a href={`ipfs://${metadataCID}`}>
              <Text fontSize="1.6rem" mb="1rem" textDecoration="underline">
                ipfs://{metadataCID}
              </Text>
            </a>
            <Text fontSize="1.8rem">Contract Address:</Text>
            <Text fontSize="1.6rem" mb="1rem">
              {contractAddress}
            </Text>
            <Text fontSize="1.8rem">Project URL</Text>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${process.browser && window.location.protocol}//
              ${process.browser && window?.location.host}/project/
              ${contractAddress}`}
            >
              <Text fontSize="1.6rem" textDecoration="underline" mb="4rem">
                {`${process.browser && window.location.protocol}//
                ${process.browser && window?.location.host}/project/
                ${contractAddress}`}
              </Text>
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${process.browser && window.location.protocol}//${
                process.browser && window?.location.host
              }/admin/${contractAddress}`}
            >
              <Box row justifyContent="center">
                <Box
                  fontSize="1.8rem"
                  px="2rem"
                  py="1rem"
                  bg="primary-green"
                  borderRadius="4px"
                  cursor="pointer"
                >
                  Go to Dashboard
                </Box>
              </Box>
            </a>
            {/* <Box onClick={() => setIsCreated(false)}>Close</Box> */}
          </Modal>
        }
      />
    </div>
  );
};

export default HomeComp;
