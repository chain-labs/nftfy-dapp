import axios from "axios";
import Box from "src/components/Box";
import Image from "next/image";
import Text from "src/components/Text";
import { format } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import useCustomContract from "src/ethereum/useCustomContract";
import { StatesContext } from "src/components/StatesContext";
import If from "src/components/If";
import theme from "src/styleguide/theme";
const data = require("src/json/metadata.json");

const statusList = {
  PRESALE_NEXT: "PRESALE_NEXT",
  PRESALE_ACTIVE: "PRESALE_ACTIVE",
  PUBLIC_SALE_NEXT: "PUBLIC_SALE_NEXT",
  PUBLIC_SALE_ACTIVE: "PUBLIC_SALE_ACTIVE",
  SOLDOUT: "SOLDOUT",
};

const ProjPageComp = ({ cid }) => {
  const [noOfTokens, setNoOfTokens] = useState(0);
  const [metaData, setMetaData] = useState<any>();
  const [status, setStatus] = useState("");
  const [cId, setCId] = useState<String>();
  const [price, setPrice] = useState("0");
  const state = useContext(StatesContext);
  const [contractInfo, setContractInfo] = useState<any>();
  const [isPresaleBuyButtonActive, setIsPresaleBuyButtonActive] =
    useState<boolean>(false);
  const [isPublicSaleBuyButtonActive, setIsPublicSaleBuyButtonActive] =
    useState<boolean>(false);
  const [presaleTimerActive, setpresaleTimerActive] = useState<boolean>(false);

  const [isSaleEnded, setIsSaleEnded] = useState<boolean>(false);
  const Collection = useCustomContract("Collection", cid, state.provider);

  const buyNft = async () => {
    const prices = {
      PRESALE_ACTIVE: metaData?.tokenDetails?.presale?.presalePrice,
      PUBLIC_SALE_ACTIVE: metaData?.tokenDetails?.basic?.price,
    };

    const buyFunctionName = {
      PRESALE_ACTIVE: "presaleBuy(uint256)",
      PUBLIC_SALE_ACTIVE: "buy(uint256)",
    };

    const bigNo = BigNumber.from(prices[status]).mul(
      BigNumber.from(noOfTokens)
    );

    console.log(
      BigNumber.from(prices[status]).mul(BigNumber.from(noOfTokens)).toString()
    );
    Collection.connect(state.signer)[buyFunctionName[status]](noOfTokens, {
      value: bigNo,
    });
  };

  useEffect(() => {
    if (metaData) {
      const now = parseInt((Date.now() / 1000).toString());
      const presaleStartTime =
        metaData?.tokenDetails?.presale?.presaleStartTime;
      const publicSaleStartTime =
        metaData?.tokenDetails?.basic?.publicSaleStartTime;

      if (now < presaleStartTime) {
        setStatus(statusList.PRESALE_NEXT);
      } else if (now > presaleStartTime && now < publicSaleStartTime) {
        setStatus(statusList.PRESALE_ACTIVE);
      } else if (now > publicSaleStartTime) {
        setStatus(statusList.PUBLIC_SALE_ACTIVE);
      }
    }
  }, [metaData, setStatus]);

  useEffect(() => {
    console.log(cid);
  }, [cid]);

  useEffect(() => {
    const getContractInfo = async () => {
      try {
        const cid = await Collection.callStatic.metadata();
        const isPresaleAllowed = await Collection.callStatic.isPresaleAllowed();
        const presaleStartTime = await Collection.callStatic.presaleStartTime();
        const isPresaleActive = await Collection.callStatic.isPresaleActive();
        const publicSaleStartTime =
          await Collection.callStatic.publicSaleStartTime();
        const isSaleActive = await Collection.callStatic.isSaleActive();
        const tokensCount = await Collection.callStatic.tokensCount();
        const startingTokenIndex =
          await Collection.callStatic.startingTokenIndex();
        const maximumTokens = await Collection.callStatic.maximumTokens();
        const currentTime = Date.now();
        setContractInfo({
          isPresaleAllowed: isPresaleAllowed,
          presaleStartTime: presaleStartTime * 1000,
          isPresaleActive: isPresaleActive,
          publicSaleStartTime: publicSaleStartTime * 1000,
          isSaleActive: isSaleActive,
          tokensCount: ethers.utils.formatUnits(tokensCount, 0),
          startingTokenIndex: ethers.utils.formatUnits(startingTokenIndex, 0),
          maximumTokens: ethers.utils.formatUnits(maximumTokens, 0),
          currentTime: currentTime,
        });
        console.log(cid);
        setCId(cid);
      } catch (e) {
        console.log(e);
      }
    };
    if (Collection) {
      getContractInfo();
    }
  }, [Collection]);

  useEffect(() => {
    const fetchMetadata = async () => {
      if (cId) {
        const res = await axios.get(`https://nftfy.mypinata.cloud/ipfs/${cId}`);
        console.log(res);
        setMetaData(res.data);
      }
    };

    if (cId) {
      fetchMetadata();
    }
  }, [cId]);

  useEffect(() => {
    console.log(contractInfo);
    if (contractInfo) {
      const {
        isSaleActive,
        isPresaleActive,
        isPresaleAllowed,
        presaleStartTime,
        publicSaleStartTime,
      } = contractInfo;

      if (isPresaleActive) {
        setStatus(statusList.PRESALE_ACTIVE);
      } else if (isPresaleAllowed && presaleStartTime > Date.now()) {
        setStatus(statusList.PRESALE_NEXT);
      } else if (isSaleActive) {
        setStatus(statusList.PUBLIC_SALE_ACTIVE);
      } else if (!isPresaleActive && publicSaleStartTime > Date.now()) {
        setStatus(statusList.PUBLIC_SALE_NEXT);
      } else if (!isPresaleActive && !isSaleActive) {
        setStatus(statusList.SOLDOUT);
      }
    }
  }, [contractInfo]);

  useEffect(() => {
    if (
      status === statusList.PRESALE_ACTIVE ||
      status === statusList.PRESALE_NEXT
    ) {
      const presalePrice = metaData?.tokenDetails?.presale?.presalePrice;
      const presalePriceInEth = ethers.utils.formatUnits(presalePrice ?? 0, 18);
      const total = parseFloat(presalePriceInEth) * noOfTokens;
      setPrice(total.toString());
    }
    if (
      status === statusList.PUBLIC_SALE_ACTIVE ||
      (status === statusList.PUBLIC_SALE_NEXT &&
        status !== statusList.PRESALE_ACTIVE)
    ) {
      const publicSalePrice = metaData?.tokenDetails?.basic?.price;
      const publicSalePriceInEth = ethers.utils.formatUnits(
        publicSalePrice ?? 0,
        18
      );
      const total = parseFloat(publicSalePriceInEth) * noOfTokens;
      setPrice(total.toString());
    }
  }, [
    noOfTokens,
    isPresaleBuyButtonActive,
    isPublicSaleBuyButtonActive,
    metaData,
    status,
  ]);

  const getTime = (presaleTime) => {
    const start = new Date(presaleTime.toString());
    console.log({ start });

    const time = format(new Date(presaleTime), "dd MMM yyyy | HH:mm:ss");

    return time;
  };

  if (!metaData) return <div>Loading...</div>;

  return (
    <Box>
      {/* <-------------BANNER BACKGROUND----------------> */}
      <Box width="100vw" height="100vh" top={{ mobS: 0, tabS: -10 }}>
        <Box
          as="img"
          src={metaData?.collectionDetails?.bannerImageUrl}
          alt={data?.collectionDetails?.bannerImageUrl}
          height="100vh"
          width="100vw"
          position="relative"
        ></Box>
      </Box>
      <Box
        position="absolute"
        top="10"
        left="50%"
        transform="translateX(-50%)"
        row
        center
      >
        <Box row>
          <Text fontSize="2rem" color="white-10" mr="4rem">
            About
          </Text>
          <Text fontSize="2rem" color="white-10" mr="4rem">
            Gallery
          </Text>
          <Text fontSize="2rem" color="white-10" mr="4rem">
            Roadmap
          </Text>
        </Box>
        <Box
          borderRadius="50%"
          height="8rem"
          width="8rem"
          position="relative"
          overflow="hidden"
        >
          {/* <Image src="/static/images/logo.jpeg" layout="fill" /> */}
        </Box>
        <Box row ml="4rem">
          <Text fontSize="2rem" color="white-10" mr="4rem">
            About
          </Text>
          <Text fontSize="2rem" color="white-10" mr="4rem">
            Gallery
          </Text>
          <Text fontSize="2rem" color="white-10">
            Roadmap
          </Text>
        </Box>
      </Box>
      <Box
        position="absolute"
        top="30%"
        left="50%"
        transform="translateX(-50%)"
        column
        center
        minWidth="70%"
        zIndex={3}
      >
        <Text
          id="headline"
          color="white"
          fontSize={{ mobS: "3.6rem", tabS: "7.2rem" }}
          textShadow="0 0 10px #000000"
          fontWeight="extra-bold"
          mb="20rem"
          textTransform="uppercase"
          textAlign="center"
          zIndex={3}
        >
          {metaData?.collectionDetails?.name}
        </Text>
        {/* Buy Box */}
        <Box
          bg={`${theme.colors["purple-black"]}b0`}
          p="mxl"
          borderRadius="4px"
        >
          <Box row alignItems="center" mb="2rem">
            <Box
              as="input"
              value={`${noOfTokens}`}
              type="number"
              borderRadius="4px"
              border="none"
              mr="mxxl"
              px="1rem"
              py="1rem"
              onChange={(e) => setNoOfTokens(e.target.value)}
            ></Box>
            <Box>
              <Text
                fontSize="2rem"
                color="primary-white"
                fontWeight="extra-bold"
              >
                = {price} ETH
              </Text>
            </Box>
          </Box>
          <Box row>
            <If
              condition={
                status === statusList.PRESALE_NEXT ||
                status === statusList.PRESALE_ACTIVE
              }
              then={
                <Box
                  bg="accent-green"
                  px="2rem"
                  py="0.4rem"
                  borderRadius="4px"
                  cursor="pointer"
                  className="cta-btn"
                  onClick={buyNft}
                  as="button"
                  disabled={status != statusList.PRESALE_ACTIVE}
                >
                  <Text fontSize="1.6rem" color="black-20" fontWeight="bold">
                    Presale Buy
                  </Text>
                </Box>
              }
            />
            <If
              condition={
                status === statusList.PUBLIC_SALE_NEXT ||
                status === statusList.PUBLIC_SALE_ACTIVE
              }
              then={
                <Box
                  bg="accent-green"
                  px="2rem"
                  py="0.4rem"
                  borderRadius="4px"
                  cursor="pointer"
                  className="cta-btn"
                  onClick={buyNft}
                  as="button"
                  disabled={!!(status != statusList.PUBLIC_SALE_ACTIVE)}
                >
                  <Text fontSize="1.6rem" color="black-20" fontWeight="bold">
                    Buy
                  </Text>
                </Box>
              }
            />
            <Box
              bg={`${theme.colors["primary-red"]}30`}
              border="1px solid white"
              borderRadius="4px"
              px="1rem"
              py="1rem"
              ml="4rem"
              display={
                status === statusList.PUBLIC_SALE_ACTIVE ? "none" : "block"
              }
            >
              <If
                condition={status === statusList.PRESALE_NEXT}
                then={
                  <Text
                    fontSize="1.2rem"
                    color="primary-white"
                    fontWeight="medium"
                    maxWidth="20rem"
                  >
                    Presale starts at
                    <br /> {`${getTime(contractInfo?.presaleStartTime)}`}
                  </Text>
                }
              />
              <If
                condition={
                  status === statusList.PRESALE_ACTIVE ||
                  status === statusList.PUBLIC_SALE_NEXT
                }
                then={
                  <Text
                    fontSize="1.2rem"
                    color="primary-white"
                    fontWeight="medium"
                    maxWidth="20rem"
                  >
                    Sale starts at
                    <br /> {`${getTime(contractInfo?.publicSaleStartTime)}`}
                  </Text>
                }
              />
            </Box>
          </Box>
          {isSaleEnded ? <Text color="white"> Sale is Ended</Text> : ""}
        </Box>
      </Box>
      {/* <-------------BANNER BACKGROUND ENDS--------------------> */}

      {/* <------------- WEBSITE BODY STARTS HERE ----------------> */}
      <Box color="white" className="body" bg="purple-black">
        <Box display="flex" pt="20rem" center pl="20rem" pr="15rem">
          <Box mt="2rem">
            <Text
              fontSize="4.8rem"
              color="yellow-10"
              mb="0"
              fontWeight="extra-bold"
            >
              Team <br />
              Description
            </Text>
            <Text
              fontSize="2rem"
              color="grey"
              mb="4.8rem"
              maxWidth="50rem"
              fontWeight="thin"
            >
              {metaData?.collectionDetails?.teamDescription}
            </Text>
          </Box>
          <Box ml="8rem">
            <Image
              src="/static/images/spaceman-4.png"
              height="490"
              width="490"
              quality="75"
            />
          </Box>
        </Box>
        <Box display="flex" pt="20rem" center pl="20rem" pr="15rem">
          <Box mt="2rem">
            <Text
              fontSize="4.8rem"
              color="red-10"
              mb="0"
              fontWeight="extra-bold"
            >
              Value <br />
              Propositions
            </Text>
            <Text
              fontSize="2rem"
              color="grey"
              mb="4.8rem"
              maxWidth="50rem"
              fontWeight="thin"
            >
              {metaData?.collectionDetails?.valueProposition}
            </Text>
          </Box>
          <Box ml="8rem">
            <Image
              src="/static/images/spaceman-1.png"
              height="490"
              width="490"
              quality="75"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProjPageComp;
