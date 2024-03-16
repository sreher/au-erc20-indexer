import React, {Component, useState} from 'react';
import {
    Box,
    Button,
    Center,
    Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel,
    Heading, HStack, Icon,
    Image,
    Input,
    SimpleGrid,
    Text,
} from "@chakra-ui/react";
import {Alchemy, Network, Utils} from "alchemy-sdk";
import {useAccount, useChainId, useChains} from "wagmi";
import {ConnectButton} from "@rainbow-me/rainbowkit";


function Erc20Indexer() {
    const [userAddress, setUserAddress] = useState('');
    const account = useAccount();
    const chainId = useChainId();
    const [hasQueried, setHasQueried] = useState(false);
    const [tokenDataObjects, setTokenDataObjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
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

    async function getTokenBalance() {
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
        // let currentNetwork = chains.find(x => x.id === chainId);
        // let networkName = currentNetwork.name;
        // let networkSymbol = "eth"; // currentNetwork.nativeCurrency.symbol;
        // let findNetworkConst = networkSymbol + "_" + networkName;

        const data = await alchemy.core.getTokenBalances(account.address ? account.address : userAddress);

        setResults(data);

        const tokenDataPromises = [];

        for (let i = 0; i < data.tokenBalances.length; i++) {
            const tokenData = alchemy.core.getTokenMetadata(
                data.tokenBalances[i].contractAddress
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
                    <ConnectButton/>
                </Box>
            </Center>
            <Center>
                <Flex
                    alignItems={'center'}
                    justifyContent="center"
                    flexDirection={'column'}
                >
                    <Heading mb={0} fontSize={36}>
                        ERC-20 Token Indexer
                    </Heading>
                    <Text>
                        Plug in an address and this website will return all of its ERC-20
                        token balances!
                    </Text>
                </Flex>
            </Center>
            <Flex
                w="100%"
                flexDirection="column"
                alignItems="center"
                justifyContent={'center'}
            >
                <Heading mt={42}>
                    Get all the ERC-20 token balances of this address:
                </Heading>
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
                <Button fontSize={20} onClick={getTokenBalance} mt={5} bgColor="#7770b3"  color={"white"} isLoading={loading}>
                    Check ERC-20 Token Balances
                </Button>

                <Heading my={16}>ERC-20 token balances:</Heading>

                {hasQueried ? (
                    <SimpleGrid w={'90vw'} columns={4} spacing={24}>
                        {results.tokenBalances.map((e, i) => {
                            return (
                                <Flex
                                    flexDir={'column'}
                                    color="white"
                                    bg="#7770b3"
                                    w={'20vw'}
                                    p={2}
                                    key={e.id}
                                >
                                    <Box>
                                        <b>Name:</b> {tokenDataObjects[i].name?.length === 0
                                        ? 'No Name'
                                        : tokenDataObjects[i].name}&nbsp;
                                    </Box>
                                    <Box>
                                        <b>Symbol:</b> ${tokenDataObjects[i]?.symbol}&nbsp;
                                    </Box>

                                    <Box>
                                        <b>Balance:</b>&nbsp;
                                        {Utils.formatUnits(
                                            e.tokenBalance,
                                            tokenDataObjects[i].decimals
                                        )}
                                    </Box>
                                    <Center pt={10} pb={8}>
                                        <Image width={12} src={tokenDataObjects[i].logo ? tokenDataObjects[i].logo : './public/token_sm.png'}/>
                                    </Center>
                                </Flex>
                            );
                        })}
                    </SimpleGrid>
                ) : (
                    <Box>
                        'Please make a query! This may take a few seconds...'
                    </Box>
                )}
            </Flex>
        </Box>
    );
}

export default Erc20Indexer;