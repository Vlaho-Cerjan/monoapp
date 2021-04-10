import React, { Component } from 'react'

import { Grid, Input, Button } from 'semantic-ui-react'

class ListMakeItem extends Component {
    
    constructor(props){
        super(props);

        this.nameRef = React.createRef();
        this.abrvRef = React.createRef();
    }

    render(){
        return(
            <Grid.Row key={this.props.id}>
                <Grid.Column>
                    <Input 
                        ref = {this.nameRef}
                        defaultValue={this.props.makeName}
                        readOnly={this.props.isReadOnly.data.find(data => data.id === this.props.id).state}
                        className={this.props.isReadOnly.data.find(data => data.id === this.props.id).state ? "grid-input makeName readOnly" : "grid-input makeName"}
                        onChange={(e, data) => {
                            this.props.formData["makeName"] = data.value
                        }}
                    />
                </Grid.Column>
                <Grid.Column>
                    <Input 
                        ref = {this.abrvRef}
                        defaultValue={this.props.makeNameAbrv}
                        readOnly={this.props.isReadOnly.data.find(data => data.id === this.props.id).state}
                        className={this.props.isReadOnly.data.find(data => data.id === this.props.id).state ? "grid-input makeAbrv readOnly" : "grid-input makeAbrv"}
                        onChange={(e, data) => {
                            this.props.formData["makeAbrv"] = data.value
                        }}
                    />
                </Grid.Column>
                <Grid.Column>
                    {!this.props.isReadOnly.data.find(data => data.id === this.props.id).state ? 
                        <div>
                            <Button
                                onClick={() => this.props.editDataHandler(this.props.id)}
                            >
                                Confirm
                            </Button>
                            <Button
                                color="google plus"
                                onClick={() => {
                                        this.props.cancelHandler();
                                        if(this.nameRef) this.nameRef.current.inputRef.current.value = this.nameRef.current.props.defaultValue
                                        if(this.abrvRef) this.abrvRef.current.inputRef.current.value = this.abrvRef.current.props.defaultValue
                                    }
                                }
                            >
                                X
                            </Button>
                        </div>
                        : 
                        <Button
                            onClick={() => this.props.editClickHandler(this.props.id)}
                        >
                            Edit
                        </Button> 
                    }
                </Grid.Column>
                <Grid.Column>
                    <Button
                        onClick={() => this.props.deleteDataHandler(this.props.id)}
                    >
                        Delete
                    </Button>
                </Grid.Column>
            </Grid.Row>
        );
    };
};

export default ListMakeItem;