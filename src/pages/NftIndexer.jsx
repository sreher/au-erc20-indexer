import {
    Box,
    Button,
    Center,
    Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel,
    Heading,
    Image,
    Input, Link,
    SimpleGrid,
    Text,
} from '@chakra-ui/react';
import { Alchemy, Network } from 'alchemy-sdk';
import React, { useState } from 'react';
import {ConnectButton} from "@rainbow-me/rainbowkit";
import {useAccount, useChainId} from "wagmi";

function NftIndexer()  {
    const [userAddress, setUserAddress] = useState('');
    const account = useAccount();
    const chainId = useChainId();
    const [results, setResults] = useState([]);
    const [hasQueried, setHasQueried] = useState(false);
    const [tokenDataObjects, setTokenDataObjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isError, setError] = useState(false);
    const handleInputChange = (e) => {
        let value = e.target.value;
        if (value.length !== 42) {
            setError(true);
        } else {
            setError(false);
        }
        setUserAddress(value);
    }

    async function getNFTsForOwner() {
        setLoading(true);

        // error handling
        if (!account.address) {
            if (userAddress.length !== 42) {
                setError(true);
                setLoading(false);
                return false;
            } else {
                setError(false);
            }
        }

        let _network;
        if (chainId === 1) {
            _network = Network.ETH_MAINNET;
        } else if (chainId === 5) {
            _network = Network.ETH_GOERLI;
        } else {
            _network = Network.ETH_SEPOLIA;
        }

        const config = {
            apiKey: '-eS7Y18qf13hDVoBdjlqN6S5ZzwoLfKI',
            network: _network,
        };

        const alchemy = new Alchemy(config);
        const data = await alchemy.nft.getNftsForOwner(account.address ? account.address : userAddress);
        setResults(data);
        console.log("data:  ", data);

        const tokenDataPromises = [];

        for (let i = 0; i < data.ownedNfts.length; i++) {
            const tokenData = alchemy.nft.getNftMetadata(
                data.ownedNfts[i].contract.address,
                data.ownedNfts[i].tokenId
            );
            tokenDataPromises.push(tokenData);
        }

        setTokenDataObjects(await Promise.all(tokenDataPromises));
        setHasQueried(true);
        setLoading(false);
    }
    return (
        <Box w="100vw">
            <Center>
                <Box mb={35} mt={35}>
                    <ConnectButton />
                </Box>
            </Center>
            <Center>
                <Flex
                    alignItems={'center'}
                    justifyContent="center"
                    flexDirection={'column'}
                >
                    <Heading mb={0} fontSize={36}>
                        NFT Indexer 🖼
                    </Heading>
                    <Text>
                        Plug in an address and this website will return all of its NFTs!
                    </Text>
                </Flex>
            </Center>
            <Flex
                w="100%"
                flexDirection="column"
                alignItems="center"
                justifyContent={'center'}
            >
                <Heading mt={42}>Get all the ERC-721 tokens of this address:</Heading>
                <Center pt={25}>
                    <FormControl isInvalid={isError}>
                        <FormLabel>Address:</FormLabel>
                        <Input
                            onChange={(e) => setUserAddress(e.target.value)}
                            onBlur={handleInputChange}
                            onSubmit={handleInputChange}
                            color="black"
                            w="600px"
                            textAlign="center"
                            p={4}
                            bgColor="white"
                            fontSize={18}
                        />
                        {!isError ? (
                            <FormHelperText>
                                Enter a address you want to check or click the search button to look for yours.
                            </FormHelperText>
                        ) : (
                            <FormErrorMessage>The address is not valid or doesn't exist.</FormErrorMessage>
                        )}
                    </FormControl>
                </Center>
                <Button fontSize={20} onClick={getNFTsForOwner} mt={5} bgColor="#7770b3"  color={"white"} isLoading={loading}>
                    Fetch NFTs
                </Button>

                <Heading my={16}>Here are your NFTs:</Heading>

                {hasQueried ? (
                    <SimpleGrid w={'90vw'} columns={4} spacing={24}>
                        {results.ownedNfts.map((e, i) => {
                            console.log("loop:   ", e);
                            return (
                                <Flex
                                    flexDir={'column'}
                                    color="white"
                                    bg="#7770b3"
                                    w={'20vw'}
                                    key={e.tokenId}
                                >
                                    <Box pl={2}>
                                        <b>Name:</b>{' '}
                                        {tokenDataObjects[i].title?.length === 0
                                            ? 'No Name'
                                            : tokenDataObjects[i].title}
                                    </Box>
                                    <Image
                                        src={
                                            tokenDataObjects[i]?.rawMetadata?.image ??
                                            'https://via.placeholder.com/200'
                                        }
                                        alt={'Image'}
                                        title={tokenDataObjects[i]?.description}
                                    />
                                    <Link pl={2} href={tokenDataObjects[i]?.tokenUri.gateway} color={"white"} alignContent={"center"}>Link</Link>
                                </Flex>
                            );
                        })}
                    </SimpleGrid>
                ) : (
                    <Box>
                        'Please make a query! The query may take a few seconds...'
                    </Box>
                )}
            </Flex>
        </Box>
    );
}

export default NftIndexer;