import { observer } from 'mobx-react';
import React, { Component } from 'react'
import { Grid, Container, Button, Divider } from 'semantic-ui-react'

class CreateModal extends Component {
    render(){
        return(
            <Container
                fluid
                className="create-container"
            >
                <Divider 
                    clearing
                    section
                />
                {!this.props.isCreateOpen ?
                <Button 
                    size='big'
                    onClick={this.props.openCreate}
                >
                    Create
                </Button>
                : <Grid 
                    celled="internally"
                    columns={this.props.columnNumber} 
                    verticalAlign="middle"
                    textAlign="center"    
                >
                {this.props.children}
                </Grid>
                }
            </Container>
        )
    }

}

export default CreateModal;