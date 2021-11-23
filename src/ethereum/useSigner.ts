import { useState, useEffect } from 'react';
import { ProviderProps, SignerProps, UseSignerResult } from './types';

const useSigner = (provider: ProviderProps): UseSignerResult => {
	const [signer, setSigner] = useState<SignerProps>(null);

	useEffect(() => {

		console.log("useSigner started", provider);
		if (provider?.provider) {
			setSigner(provider?.getSigner());
		}
	}, [provider]);

	return [signer, setSigner];
};

export default useSigner;