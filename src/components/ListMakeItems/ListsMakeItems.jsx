import React, { Component } from 'react'

import ListItem from './ListMakeItem/ListMakeItem'

class ListMakeItems extends Component {
    
    render() {
        return (
            <React.Fragment>
                {this.props.items.map((item) => {
                    return(
                        <ListItem 
                            key = {item.id}
                            id = {item.id}
                            makeName = {item.makeName}
                            makeNameAbrv = {item.makeAbrv}
                            isReadOnly = {this.props.isReadOnly}
                            formData = {this.props.formData}
                            editDataHandler = {this.props.editDataHandler}
                            cancelHandler = {this.props.cancelHandler}
                            editClickHandler = {this.props.editClickHandler}
                            deleteDataHandler = {this.props.deleteDataHandler}
                        />
                        );
                    })
                }
            </React.Fragment>
        );
    };
};

export default ListMakeItems;