import React from 'react'
import { Container } from 'semantic-ui-react'

import MenuSidebar from '../components/MenuSidebar'

class MainLayout extends React.Component {
    render() {
        return(
            <Container  
                className="main-container"
            >
                <MenuSidebar />
                {this.props.children}
            </Container>
        );
    }
}

export default MainLayout;