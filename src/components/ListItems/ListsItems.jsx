import React, { Component } from 'react'

import ListItem from './ListItem/ListItem'

class ListItems extends Component {

    render() {
        return (
            <React.Fragment>
                {this.props.items.map((item, index) => {
                    return(
                        <ListItem 
                            key = {item.id}
                            id = {item.id+index}
                            makeName = {item.makeName}
                            makeNameAbrv = {item.makeAbrv}
                            modelName = {item.modelName}
                            modelNameAbrv = {item.modelAbrv}
                        />
                        );
                    })
                }
            </React.Fragment>
        );
    };
};

export default ListItems;