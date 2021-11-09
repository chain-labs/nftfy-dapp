import { useLayoutEffect, useState } from 'react';
import Box from 'components/Box';
import Container from 'components/Container';
import Text from 'components/Text';
import Hamburger from 'svgs/hamburger.svg';
import RightArrow from 'svgs/arrow-right.svg';
import If from 'components/If';
import { gsap } from 'gsap';

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<Box
			py={{ mobS: 'mxs', tabS: 'ml', deskL: 'mxxxl' }}
			px={{ mobS: 'mm', tabS: 'wxs', deskL: '0' }}
			bg="rgba(236, 236, 236, 0.09)"
			borderBottom="1px solid"
			borderBottomColor="accent-green"
			position="fixed"
			width="100%"
			zIndex={10}
			css={`
				backdrop-filter: blur(8px);
				-moz-backdrop-filter: blur(8px);
				-webkit-backdrop-filter: blur(8px);
				-o-backdrop-filter: blur(8px);
			`}
		>
			<Container>
				<Box between>
					<a href="#top">
						<Box center>
							<Box as="img" src="/static/images/logo.png" mr={{ mobS: 'mxs', tabS: 'mxl' }} />
							<Box as="img" src="/static/images/brand.png" />
						</Box>
					</a>
					<Box color="primary-white" display={{ mobS: 'none', tabS: 'block' }}>
						<a href="#vision">
							<Text as="links">Vision</Text>
						</a>
						<a href="#products">
							<Text as="links" ml={{ mobS: '0', tabS: 'wm' }}>
								Products
							</Text>
						</a>
						<a href="#contact">
							<Text as="links" ml={{ mobS: '0', tabS: 'wm' }}>
								Contact
							</Text>
						</a>
					</Box>
					<Box
						color="primary-white"
						onClick={() => setIsMenuOpen(true)}
						display={{ mobS: 'block', tabS: 'none' }}
					>
						<Hamburger />
					</Box>
				</Box>
			</Container>
			<If condition={isMenuOpen} then={<Menu {...{ setIsMenuOpen }} />} />
		</Box>
	);
};

export default Navbar;

const Menu = ({ setIsMenuOpen }) => {
	useLayoutEffect(() => {
		gsap.from('.menu', { left: '100%' });
	}, []);

	return (
		<Box
			className="menu"
			bg="accent-green"
			height="100vh"
			width="100vw"
			position="fixed"
			top="0"
			left="8.2rem"
			px="mm"
			pt="wxs"
		>
			<Box
				color="black"
				onClick={() => {
					gsap.to('.menu', { left: '100%', onComplete: () => setIsMenuOpen(false) });
				}}
			>
				<RightArrow />
			</Box>
			<Box ml="mxxxl" color="black" mt="17.5rem">
				<a href="#vision">
					<Text as="h5" mb="wxs" fontWeight="medium" letterSpacing="-5%" textDecoration="underline">
						Vision
					</Text>
				</a>
				<a href="#products">
					<Text as="h5" mb="wxs" fontWeight="medium" letterSpacing="-5%" textDecoration="underline">
						Products
					</Text>
				</a>
				<a href="#contact">
					<Text as="h5" fontWeight="medium" letterSpacing="-5%" textDecoration="underline">
						Contact
					</Text>
				</a>
			</Box>
		</Box>
	);
};
