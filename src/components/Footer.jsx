'use client'

import {
    Box,
    chakra,
    Container, Image, Link,
    Stack,
    Text,
    useColorModeValue,
    VisuallyHidden,
} from '@chakra-ui/react'
import {FaInstagram, FaTwitter, FaYoutube} from 'react-icons/fa'
import {ReactNode} from 'react'


export default function Footer() {
    return (
        <Box
            bg={useColorModeValue('gray.50', 'gray.900')}
            color={useColorModeValue('gray.700', 'gray.200')}
            mt={50}
        >
            <Container
                as={Stack}
                maxW={'6xl'}
                py={4}
                direction={{base: 'column', md: 'row'}}
                spacing={4}
                justify={{base: 'center', md: 'space-between'}}
                align={{base: 'center', md: 'center'}}>
                <Link href='/'>
                    <Image width="50px" src='./public/logo.jpg' alt='Logo Indexer' />
                </Link>
                <Text>© 2024 Ethereum Indexer</Text>
                <Stack direction={'row'} spacing={6}>

                        <FaTwitter/>

                        <FaYoutube/>

                        <FaInstagram/>

                </Stack>
            </Container>
        </Box>
    )
}
