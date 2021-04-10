import React, { Component } from 'react'

import ListItem from './ListModelItem/ListModelItem'

class ListModelItems extends Component {
    
    render() {
        return (
            <React.Fragment>
                {this.props.items.map((item) => {
                    return(
                        <ListItem 
                            key = {item.id}
                            id = {item.id}
                            makeId = {item.makeId}
                            makeName = {item.makeName}
                            makeNameAbrv = {item.makeAbrv}
                            modelName = {item.modelName}
                            modelNameAbrv = {item.modelAbrv}
                            isReadOnly = {this.props.isReadOnly}
                            formData = {this.props.formData}
                            editDataHandler = {this.props.editDataHandler}
                            cancelHandler = {this.props.cancelHandler}
                            editClickHandler = {this.props.editClickHandler}
                            deleteDataHandler = {this.props.deleteDataHandler}
                            brandList = {this.props.brandOptions}
                        />
                        );
                    })
                }
            </React.Fragment>
        );
    };
};

export default ListModelItems;