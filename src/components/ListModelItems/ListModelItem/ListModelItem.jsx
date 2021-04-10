import React, { Component } from 'react'

import { Grid, Input, Button, Dropdown } from 'semantic-ui-react'

class ListMakeItem extends Component {
    
    constructor(props){
        super(props);

        this.makeNameRef = React.createRef();
        this.modelNameRef = React.createRef();
        this.modelAbrvRef = React.createRef();
    }

    render(){
        return(
            <Grid.Row key={this.props.id}>
                <Grid.Column>
                    <Dropdown 
                        className="dropdown"
                        placeholder='Select Brand' 
                        selection 
                        closeOnChange
                        ref={this.makeNameRef}
                        options={this.props.brandList} 
                        defaultValue={this.props.brandList.find(brand => brand.key === this.props.makeId).value}
                        disabled={this.props.isReadOnly.data.find(data => data.id === this.props.id).state}
                        className={this.props.isReadOnly.data.find(data => data.id === this.props.id).state ? "grid-input makeName readOnly" : "grid-input makeName"}
                        onChange={(e, data) => {
                            this.formData["makeId"] = data.value
                        }}
                    />       
                </Grid.Column>
                <Grid.Column>
                        {this.props.makeNameAbrv}
                </Grid.Column>
                <Grid.Column>
                    <Input 
                        ref = {this.modelNameRef}
                        defaultValue={this.props.modelName}
                        readOnly={this.props.isReadOnly.data.find(data => data.id === this.props.id).state}
                        className={this.props.isReadOnly.data.find(data => data.id === this.props.id).state ? "grid-input modelName readOnly" : "grid-input modelName"}
                        onChange={(e, data) => {
                            this.props.formData["modelName"] = data.value
                        }}
                    />
                </Grid.Column>
                <Grid.Column>
                    <Input 
                        ref = {this.makeAbrvRef}
                        defaultValue={this.props.modelNameAbrv}
                        readOnly={this.props.isReadOnly.data.find(data => data.id === this.props.id).state}
                        className={this.props.isReadOnly.data.find(data => data.id === this.props.id).state ? "grid-input modelAbrv readOnly" : "grid-input modelAbrv"}
                        onChange={(e, data) => {
                            this.props.formData["modelAbrv"] = data.value
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
                                        if(this.makeNameRef) this.makeNameRef.current.inputRef.current.value = this.makeNameRef.current.props.defaultValue;
                                        if(this.makeAbrvRef) this.makeAbrvRef.current.inputRef.current.value = this.makeAbrvRef.current.props.defaultValue;
                                        if(this.modelNameRef) this.modelNameRef.current.inputRef.current.value = this.modelNameRef.current.props.defaultValue;
                                        if(this.modelAbrvRef) this.modelAbrvRef.current.inputRef.current.value = this.modelAbrvRef.current.props.defaultValue;
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