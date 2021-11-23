import axios from "axios";
import Box from "src/components/Box";
import Image from "next/image";
import Text from "src/components/Text";
import { useContext, useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { formatUnits } from "@ethersproject/units";
import useCustomContract from "src/ethereum/useCustomContract";
import { StatesContext } from "src/components/StatesContext";
import If from "src/components/If";

const ProjPageComp = ({ cid }) => {
  const data = require("src/json/metadata.json");
  const [noOfTokens, setNoOfTokens] = useState<Number>();
  const [metaData, setMetaData] = useState<any>();
  const [cId, setCId] = useState<String>();
  const [price, setPrice] = useState<Number>();
  const state = useContext(StatesContext);
  const [contractInfo, setContractInfo] = useState<any>();
  const [isPresaleBuyButtonActive, setIsPresaleBuyButtonActive] =
    useState<boolean>(false);
  const [isPublicSaleBuyButtonActive, setIsPublicSaleBuyButtonActive] =
    useState<boolean>(false);
  const [presaleStartTime, setPreSaleStartTime] = useState<Date>();
  const [presaleTimerActive, setpresaleTimerActive] = useState<boolean>(false);
  const [publicSaleStartTime, setPublicSaleStartTime] = useState<Date>();
  const [publicSaleTimerActive, setPublicSaleTimerActive] =
    useState<boolean>(false);
  const [isSaleEnded, setIsSaleEnded] = useState<boolean>(false);
  const Collection = useCustomContract("Collection", cid, state.provider);
  const fetchMetadata = async () => {
    if (cId) {
      const res = await axios.get(`https://nftfy.mypinata.cloud/ipfs/${cId}`);
      console.log(res);
      setMetaData(res.data);
    }
  };
  const buyNft = async () => {
    console.log(noOfTokens);
    const bigNo = BigNumber.from(metaData?.tokenDetails.basic.price).mul(
      BigNumber.from(noOfTokens)
    );
    console.log(
      BigNumber.from(metaData?.tokenDetails.basic.price)
        .mul(BigNumber.from(noOfTokens))
        .toString()
    );
    const ethNo = formatUnits(bigNo, 18);
    setPrice(parseFloat(ethNo));
    if (isPresaleBuyButtonActive)
      Collection.connect(state.signer)["presaleBuy(uint256)"](noOfTokens, {
        value: bigNo,
      });
    if (isPublicSaleBuyButtonActive)
      Collection.connect(state.signer)["buy(uint256)"](noOfTokens, {
        value: bigNo,
      });
  };

  useEffect(() => {
    console.log(cid);
  }, [cid]);
  useEffect(() => {
    const getContractInfo = async () => {
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
        tokensCount: tokensCount,
        startingTokenIndex: startingTokenIndex,
        maximumTokens: maximumTokens,
        currentTime: currentTime,
      });
      console.log(cid);
      setCId(cid);
    };
    if (Collection) {
      getContractInfo();
    }
  }, [Collection]);

  useEffect(() => {
    fetchMetadata();
  }, [cId]);

  useEffect(() => {
    console.log(contractInfo?.presaleStartTime);
    if (
      contractInfo?.isPresaleAllowed &&
      contractInfo?.currentTime < contractInfo?.presaleStartTime
    ) {
      setpresaleTimerActive(true);
      setPreSaleStartTime(contractInfo.presaleStartTime);
    }
    if (contractInfo?.isPresaleAllowed && contractInfo?.isPresaleActive) {
      setpresaleTimerActive(false);
      setIsPresaleBuyButtonActive(true);
    }
    if (contractInfo?.isPresaleActive) setIsPresaleBuyButtonActive(false);
    if (
      !presaleTimerActive &&
      !isPresaleBuyButtonActive &&
      contractInfo?.currentTime < contractInfo?.publicSaleStartTime
    ) {
      setPublicSaleTimerActive(true);
      setPublicSaleStartTime(contractInfo.publicSaleStartTime);
    }
    if (contractInfo?.isSaleActive) {
      setPublicSaleTimerActive(false);
      setIsPublicSaleBuyButtonActive(true);
    }
    if (
      contractInfo?.tokensCount + contractInfo?.startingTokenIndex ==
      contractInfo?.maximumTokens
    ) {
      setIsSaleEnded(true);
      setIsPublicSaleBuyButtonActive(false);
    }
  }, [contractInfo]);

  return (
    <Box>
      {/* <-------------BANNER BACKGROUND----------------> */}
      <Box width="100vw" height="100vh" top={{ mobS: 0, tabS: -10 }}>
        <Box
          as="img"
          src={data.collectionDetails.bannerImageUrl}
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
          fontWeight="extra-bold"
          mb="20rem"
          textTransform="uppercase"
          textAlign="center"
        >
          {metaData?.collectionDetails?.name}
        </Text>
        <Box bg="purple-black" padding="mxl">
          <Box center>
            <Box
              as="input"
              value={`${noOfTokens}`}
              type="number"
              mb="mxxl"
              mr="mxxl"
              px="4.8rem"
              py="1rem"
              onChange={(e) => setNoOfTokens(e.target.value)}
            ></Box>
            {isPresaleBuyButtonActive ? (
              <Box
                bg="accent-green"
                px="4.8rem"
                py="2rem"
                borderRadius="4px"
                cursor="pointer"
                className="cta-btn"
                onClick={buyNft}
                mr="mxxl"
              >
                <Text fontSize="2rem" color="black-20" fontWeight="extra-bold">
                  presale buy
                </Text>
              </Box>
            ) : (
              ""
            )}
            <If
              condition={isPublicSaleBuyButtonActive}
              then={
                <Box
                  bg="accent-green"
                  px="4.8rem"
                  py="2rem"
                  borderRadius="4px"
                  cursor="pointer"
                  className="cta-btn"
                  onClick={buyNft}
                  mr="mxxl"
                >
                  <Text
                    fontSize="2rem"
                    color="black-20"
                    fontWeight="extra-bold"
                  >
                    Public buy
                  </Text>
                </Box>
              }
            />
            <If
              condition={isPresaleBuyButtonActive}
              then={
                <Box
                  bg="accent-green"
                  px="4.8rem"
                  py="2rem"
                  borderRadius="4px"
                  cursor="pointer"
                  className="cta-btn"
                  onClick={buyNft}
                  mr="mxxl"
                >
                  <Text
                    fontSize="2rem"
                    color="black-20"
                    fontWeight="extra-bold"
                  >
                    presale buy
                  </Text>
                </Box>
              }
            />
            {price ? (
              <Box bg="primary-blue" px="4.8rem" py="2rem" borderRadius="4px">
                <Text fontSize="2rem" color="black-20" fontWeight="extra-bold">
                  {price} ETH
                </Text>
              </Box>
            ) : (
              ""
            )}
          </Box>
          {presaleStartTime ? (
            <Text color="white">
              {" "}
              Presale Starts At {new Date(presaleStartTime).toString()}
            </Text>
          ) : (
            ""
          )}
          {publicSaleStartTime ? (
            <Text color="white">
              {" "}
              Public Sale Starts At {new Date(publicSaleStartTime).toString()}
            </Text>
          ) : (
            ""
          )}
          {isSaleEnded ? <Text color="white"> Sale is Ended</Text> : ""}
        </Box>
      </Box>
      {/* <-------------BANNER BACKGROUND ENDS----------------> */}

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
