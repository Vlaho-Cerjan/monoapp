import React from 'react'
import '../css/index.css';
import '../css/MainLayout.css';
import '../css/MenuSidebar.css';
import '../css/MainList.css'
import 'semantic-ui-css/semantic.min.css';
import MainLayout from '../layouts/MainLayout'

import { Provider } from 'mobx-react'
import { useStore } from '../stores/VehicleStore'

function MyApp ({ Component, pageProps }) {
    const store = useStore(pageProps.initialState)
    return (
        <Provider vehicleStore={store}>
            <MainLayout 
                className='main-container'
            >
                <Component 
                    {...pageProps}
                />
            </MainLayout>
        </Provider>
    )
}

export default MyApp;