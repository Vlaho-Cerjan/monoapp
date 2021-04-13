import React, { Component } from 'react'
import { Grid, Button, Icon } from 'semantic-ui-react'

class ListHeader extends Component {

    render(){
        let dir;
        if(this.props.sortConfig.direction === "ascending"){
            dir = 
                <Icon 
                    name="long arrow alternate up"
                />;
        }else if(this.props.sortConfig.direction === "descending"){
            dir =
                <Icon
                    name="long arrow alternate down"
                />
        }

        return (
            <Grid.Row key="header">
                {this.props.headerList.map((item, index) => {
                    if(item.key === "edit" && item.type === "button"){
                        return (
                            <Grid.Column key={index}>
                                <Icon 
                                    name='edit outline'
                                    size='large'
                                />
                            </Grid.Column>
                        )
                    }
                    else if(item.key === "delete" && item.type === "button"){
                        return (
                            <Grid.Column key={index}>
                                <Icon 
                                    name='trash alternate'
                                    size='large'
                                />
                            </Grid.Column>
                        )
                    }
                    else if(item.type === "inputOrText"){
                        return (
                            <Grid.Column key={index}>
                                {this.props.filter !== -1 ?
                                <Button 
                                    compact
                                    onClick={() => this.props.sortItems(item.key)}
                                    className={this.props.getClassNames(item.key)}
                                >
                                    {item.title} 
                                    {this.props.sortConfig.key === item.key ? dir : null}
                                </Button>
                                :
                                item.title
                                }
                            </Grid.Column>
                        )
                    }
                    else{
                        return (
                            <Grid.Column key={index}>
                                <Button 
                                    compact
                                    onClick={() => this.props.sortItems(item.key)}
                                    className={this.props.getClassNames(item.key)}
                                >
                                    {item.title} 
                                    {this.props.sortConfig.key === item.key ? dir : null}
                                </Button>
                            </Grid.Column>
                        )    
                    }
                })
                }
            </Grid.Row>
        )
    }
}

export default ListHeader;