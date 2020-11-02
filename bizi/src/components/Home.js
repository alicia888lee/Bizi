import { render } from '@testing-library/react';
import React from 'react'
import Header from './Header'
import Description from './Description'
import Discover from './Discover'
import ReadStories from './ReadStories'
import Footer from './Footer'

function Home(){
    return (
        <>
            <Header />
            <Description />
            <Discover />
            <ReadStories />
            <Footer />
        </>
    )
}

export default Home;