import {
    Box,
    Button,
    Center,
    Flex,
    Heading, HStack, Icon,
    Image,
    Input,
    SimpleGrid,
    Text,
} from '@chakra-ui/react';
import {Alchemy, Network, Utils} from 'alchemy-sdk';
import {useState} from 'react';
import {useAccount, useChainId, useChains} from 'wagmi'

import '@rainbow-me/rainbowkit/styles.css';

import Hero from './components/Hero.jsx';
import Navigation from './components/Navigation.jsx';

import HomePage from "./pages/HomePage.jsx";
import Erc20Indexer from "./pages/Erc20Indexer.jsx";
import NftIndexer from "./pages/NftIndexer.jsx";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Footer from "./components/Footer.jsx";

function App() {
    return (
        <Router>
            <Box w="100vw">
                <div>
                    <Navigation/>
                    <hr/>
                    <Switch>
                        <Route exact path='/' component={HomePage}/>
                        <Route path='/erc20-indexer' component={Erc20Indexer}/>
                        <Route path='/nft-indexer' component={NftIndexer}/>
                    </Switch>
                    <Footer />
                </div>
            </Box>
        </Router>
    );
}

export default App;
