import axios from "axios";
import Box from "src/components/Box";
import Image from "next/image";
import Text from "src/components/Text";
import { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { formatUnits } from "@ethersproject/units";

const ProjPageComp = () => {
	const data = require("src/json/metadata.json");
	const [noOfTokens, setNoOfTokens] = useState<Number>();
	const [metaData, setMetaData] = useState<any>();
	const [price, setPrice] = useState<Number>();

	const fetchMetadata = async () => {
		const res = await axios.get(
			"https://nftfy.mypinata.cloud/ipfs/Qmc63mtnfi3pdqKSUcfoUpfKxEPnPCLNPpnRgwfjqnzjMV"
		);
		setMetaData(res.data);
	};

	const buyNft = async () => {
		const bigNo = BigNumber.from(metaData?.tokenDetails.basic.price).mul(
			BigNumber.from(noOfTokens)
		);
		const ethNo = formatUnits(bigNo, 18);
		setPrice(parseFloat(ethNo));
	};

	useEffect(() => {
		fetchMetadata();
	}, []);

	return (
		<Box>
			{/* <-------------BANNER BACKGROUND----------------> */}
			<Box
				width="100vw"
				height="100vh"
				top={{ mobS: 0, tabS: -10 }}
			>
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
					{metaData?.collectionDetails?.name}
				</Text>
				<Box center bg="purple-black" padding="mxl">
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
							Let's Begin
						</Text>
					</Box>
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
							{metaData.collectionDetails.teamDescription}
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
