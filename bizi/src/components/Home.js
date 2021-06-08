import { render } from '@testing-library/react';
import React from 'react'
import Header from './Header'
import WhatsBizi from './WhatsBizi'

import ReadStories from './ReadStories'
import Footer from './Footer'


function Home(){
    return (
        <>
            <Header />
            <WhatsBizi />
            {/* <Discover /> */}
            {/* <ReadStories />
            <Footer /> */}
        </>
    )
}

export default Home;