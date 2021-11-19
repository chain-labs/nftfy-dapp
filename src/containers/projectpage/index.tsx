import axios from "axios";
import Box from "src/components/Box";
import Image from "next/image";
import Text from "src/components/Text";
import { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { formatUnits } from "@ethersproject/units";

// import { introAnimation, scrollBannerAnimation } from "./animations";

const ProjPageComp = () => {
  const data = require('src/json/metadata.json')
  const [noOfTokens, setNoOfTokens] = useState<Number>()
  const [metaData, setMetaData] = useState<any>()
  const fetchMetadata = async()=>{
    const res = await axios.get("https://nftfy.mypinata.cloud/ipfs/Qmc63mtnfi3pdqKSUcfoUpfKxEPnPCLNPpnRgwfjqnzjMV")
    // console.log(JSON.parse(res.data))
    console.log(res.data)
    setMetaData(res.data)
  }
  const buyNft = async() =>{
    console.log(noOfTokens)
    const bigNo = BigNumber.from(metaData?.tokenDetails.basic.price).mul(BigNumber.from(noOfTokens))
    console.log(BigNumber.from(metaData?.tokenDetails.basic.price).mul(BigNumber.from(noOfTokens)).toString())
    const ethNo = formatUnits(bigNo,18)
    console.log(ethNo)
  }

  useEffect(() => {
    fetchMetadata()
    // if(metaData)
    // console.log(metaData.collectionDetails.name)
  }, [])  
//   return (
//     <Box>
//       {/* <-------------BANNER BACKGROUND----------------> */}
//       {/* <Box
//         height="100vh"
//         width="100vw"
//         bg="blue-10"
//         zIndex={10}
//         className="overlay"
//         position="absolute"
//         top="0"
//       ></Box> */}
//       <Box
//         width="100vw"
//         height="100vh"
//         // position="fixed"
//         top={{ mobS: 0, tabS: -10 }}
//         zIndex={-1}
//         className="banner"
//       >
//         <Image
//           src={data.collectionDetails.bannerImageUrl}
//           alt="banner"
//           height="9"
//           width="16"
//           layout="responsive"
//           quality={1}
//           priority
//         //   onLoadingComplete={introAnimation}
//         ></Image>
//         {/* <Box
//           bg="black-10"
//           opacity="50%"
//           height="120vh"
//           width="100vw"
//         //   position="absolute"
//         //   top="0"
//           left="0"
//         ></Box> */}
//       </Box>
//       <Box
//         position="absolute"
//         top="10"

//         left="50%"
//         transform="translateX(-50%)"
//         row
//         center
//       >
//         <Box row>
//           <Text fontSize="2rem" color="white-10" mr="4rem">
//             About
//           </Text>
//           <Text fontSize="2rem" color="white-10" mr="4rem">
//             Gallery
//           </Text>
//           <Text fontSize="2rem" color="white-10" mr="4rem">
//             Roadmap
//           </Text>
//         </Box>
//         <Box
//           borderRadius="50%"
//           height="8rem"
//           width="8rem"
//           position="relative"
//           overflow="hidden"
//         >
//           <Image src="/static/images/logo.jpeg" layout="fill" />
//         </Box>
//         <Box row ml="4rem">
//           <Text fontSize="2rem" color="white-10" mr="4rem">
//             About
//           </Text>
//           <Text fontSize="2rem" color="white-10" mr="4rem">
//             Gallery
//           </Text>
//           <Text fontSize="2rem" color="white-10">
//             Roadmap
//           </Text>
//         </Box>
//       </Box>
//       <Box
//         position="absolute"
//         top="30%"
//         left="50%"
//         transform="translateX(-50%)"
//         column
//         center
//         minWidth="70%"
//         zIndex={3}
//       >
//         <Text
//           id="headline"
//           color="white"
//           fontSize={{ mobS: "3.6rem", tabS: "7.2rem" }}
//           fontWeight="extra-bold"
//           mb="20rem"
//           textTransform="uppercase"
//           textAlign="center"
//         >
//           {/* {metaData?.collectionDetails?.name} */}
//         </Text>
//         <Box center>

//         <Box as="input"
//         value={`${noOfTokens}`}
//         type="number"
//         mb="mxxl"
//         mr="mxxl"
//         px="4.8rem"
//         py="1rem"
//         onChange={(e)=>setNoOfTokens(e.target.value)}
//         >
//         </Box>
//         <Box
//           bg="yellow-10"
//         //   zIndex={2}
//           px="4.8rem"
//           py="2rem"
//           borderRadius="4px"
//           cursor="pointer"
//           className="cta-btn"
//           onClick={buyNft}
//         >
//           <Text fontSize="2rem" color="black-20" fontWeight="extra-bold">
//             Let's Begin
//           </Text>
//         </Box>
//         </Box>
//       </Box>
//       {/* <-------------BANNER BACKGROUND ENDS----------------> */}

// 	useEffect(() => {
// 		fetchMetadata();
// 	}, []);

	return (
		<Box>
			{/* <-------------BANNER BACKGROUND----------------> */}
			<Box
				width="100vw"
				height="100vh"
				top={{ mobS: 0, tabS: -10 }}
				className="banner"
			>
				<Image
					src={data.collectionDetails.bannerImageUrl}
					alt="banner"
					height="9"
					width="16"
					layout="responsive"
					quality={1}
					priority
				></Image>
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
					<Image src="/static/images/logo.jpeg" layout="fill" />
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
					{
          metaData?.collectionDetails?.name}
				</Text>
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
					<Box
						bg="yellow-10"
						px="4.8rem"
						py="2rem"
						borderRadius="4px"
						cursor="pointer"
						className="cta-btn"
						onClick={buyNft}
					>
						<Text fontSize="2rem" color="black-20" fontWeight="extra-bold">
							Let's Begin
						</Text>
					</Box>
          {/* <Box
						bg="yellow-10"
						px="4.8rem"
						py="2rem"
						borderRadius="4px"
						cursor="pointer"
						className="cta-btn"
					>
						<Text fontSize="2rem" color="black-20" fontWeight="extra-bold">
							Let's Begin
						</Text>
					</Box> */}
				</Box>
			</Box>
			{/* <-------------BANNER BACKGROUND ENDS----------------> */}

			{/* <------------- WEBSITE BODY STARTS HERE ----------------> */}
			<Box color="white" className="body" bg="blue-10">
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
							{
              metaData?.collectionDetails?.valueProposition}
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
				{/* <------------------ REPETITVE CONTENT TO BE DELETED LATER ------------------> */}
				<Box display="flex" pt="20rem" center pl="20rem" pr="15rem">
					<Box mt="2rem">
						<Text
							fontSize="4.8rem"
							color="yellow-10"
							mb="0"
							fontWeight="extra-bold"
						>
							10,000 <br />
							Generative Characters
						</Text>
						<Text
							fontSize="4.8rem"
							color="white-10"
							mt="0"
							mb="4.8rem"
							fontWeight="extra-bold"
						>
							ready to tell a story.
						</Text>
						<Text
							fontSize="2rem"
							color="grey"
							mb="4.8rem"
							maxWidth="50rem"
							fontWeight="thin"
						>
							SMAC is a collection of 10,000 Generative pieces of art with
							references from an upcoming comic book. The collection focuses on
							characters and their stylised appearance as well as their part in
							the story arc based on the SMAC comic book.
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

				{/* <------------------ REPETITVE CONTENT TO BE DELETED LATER ENDS ------------------> */}
			</Box>
		</Box>
	);
};

export default ProjPageComp;
