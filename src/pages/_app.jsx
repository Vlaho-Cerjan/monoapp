import React from 'react'
import '../css/index.css';
import '../css/MainLayout.css';
import '../css/MenuSidebar.css';
import '../css/MainList.css'
import 'semantic-ui-css/semantic.min.css';
import MainLayout from '../layouts/MainLayout'

import { Provider } from 'mobx-react'
import { useStore } from '../stores/VehicleStore'

import {positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-oldschool-dark'

const options = {
    positions: positions.TOP_RIGHT,
    timeout: 5000,
    offset: '24px 24px 0 0',
    tranistion: 'scale'
}

function MyApp ({ Component, pageProps }) {
    const store = useStore(pageProps.initialState)
    return (
        <AlertProvider template={AlertTemplate} {...options}>
            <Provider vehicleStore={store}>
                <MainLayout 
                    className='main-container'
                >
                    <Component 
                        {...pageProps}
                    />
                </MainLayout>
            </Provider>
        </AlertProvider>
    )
}

export default MyApp;