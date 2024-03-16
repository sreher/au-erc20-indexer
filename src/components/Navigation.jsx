'use client'

import {
    Box, Center, Flex, HStack,
    Image, Link,
} from '@chakra-ui/react'
import {ExternalLinkIcon} from "@chakra-ui/icons";


export default function Hero() {
    return (
        <>
            <Center>
            <Box width="100%" maxW={'6xl'}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <Box pl={5} pt={2}>
                        <Link href='/'>
                            <Image width="50px" src='./public/logo.jpg' alt='Logo Indexer' />
                        </Link>
                    </Box>

                    <Box pl={15} px={10}>
                        <Link href='/erc20-indexer' px={10}>
                            ERC-20 Indexer
                        </Link>
                        <Link href='/nft-indexer'>
                            NFT Indexer
                        </Link>
                    </Box>
                </Flex>
            </Box>
            </Center>
        </>
    );
}