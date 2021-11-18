import React from 'react';
import Box, { BoxProps } from 'components/Box';

export const fontSizes = {
	h1: { mobS: '3.2rem', tabS: '3.6rem', deskM: '7.2rem' },
	h2: { mobS: '2.4rem', tabS: '3.2rem', deskM: '4.8rem' },
	h3: { mobS: '2rem', tabS: '2.4rem', deskM: '3.6rem' },
	b1: { mobS: '1.6rem', tabS: '2rem', deskM: '2.4rem' },
	b2: { mobS: '1.6rem', tabS: '2rem', deskM: '2.4rem' },
	b3: { mobS: '1.2rem', tabS: '1.6rem', deskM: '2rem' },
	links: { mobS: '1.4rem', tabS: '1.6rem', deskM: '2rem' },
};

export const lineHeights = {
	h1: '115%',
	h2: '150%',
	h3: '150%',
	b1: '150%',
	b2: '165%',
	b3: '150%',
};

const fontWeights = {
	'extra-bold': 800,
	bold: 700,
	medium: 600,
	regular: 500,
	thin: 400,
};

export interface TextProps extends BoxProps {
	as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'b1' | 'b2' | 'b3' | 'links';
	fontWeight?: 'extra-bold' | 'bold' | 'medium' | 'regular' | 'thin';
	lineHeight?: 'h1' | 'h2' | 'h4' | 'b2';

	children?: string | React.ReactNode;
	id?: string;
	dangerouslySetInnerHTML?: { __html: string };
	onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
	className?: string;
}

const Text = ({ as = 'h6', fontWeight = 'regular', color, children, ...restProps }: TextProps): JSX.Element => {
	const fs = fontSizes[as];
	const fw = fontWeights[fontWeight];
	const lh = lineHeights[as] ?? '150%';

	return (
		<Box
			className={restProps.className}
			margin={0}
			padding={0}
			as={as}
			color={color as string}
			fontSize={fs}
			fontWeight={fw}
			lineHeight={lh}
			{...restProps}
		>
			{children}
		</Box>
	);
};

export default Text;
