import React, { Component } from 'react'

import { Grid } from 'semantic-ui-react'

class ListItem extends Component {
    
    render(){
        return(
            <Grid.Row key={this.props.id}>
                <Grid.Column>
                    {this.props.makeName}
                </Grid.Column>
                <Grid.Column>
                    {this.props.makeNameAbrv}
                </Grid.Column>
                <Grid.Column>
                    {this.props.modelName}
                </Grid.Column>
                <Grid.Column>
                    {this.props.modelNameAbrv}
                </Grid.Column>
            </Grid.Row>
        );
    };
};

export default ListItem;