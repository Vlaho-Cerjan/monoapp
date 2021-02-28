import React from 'react'
import { Container } from 'semantic-ui-react'
import './MainLayout.css'

class MainLayout extends React.Component {
    render() {
        return(
            <Container className="main-container">
                {this.props.children}
            </Container>
        );
    }
}

export default MainLayout;