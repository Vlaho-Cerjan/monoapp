import React, { Component } from 'react'

import { Grid, Input, Button, Dropdown } from 'semantic-ui-react'

class CreateModelRow extends Component {
    constructor(props){
        super(props);

        this.makeNameRef = React.createRef();
        this.modelNameRef = React.createRef();
        this.modelAbrvRef = React.createRef();
    }

    render(){
        
        return(
            <Grid.Row key="createRow">  
                <Grid.Column>
                    <Dropdown 
                        className="dropdown"
                        placeholder={"Select Brand"}
                        selection 
                        ref={this.makeNameRef}
                        options={this.props.brandOptions} 
                        className={"grid-input makeName"}
                        onChange={(e, data) => {
                            this.props.formData["makeId"] = data.value
                        }}
                    />
                </Grid.Column>
                <Grid.Column>
                    <Input 
                        ref={this.modelNameRef}
                        placeholder={"Model Name"}
                        className={"grid-input modelName"}
                        onChange={(e, data) => {
                            this.props.formData["modelName"] = data.value
                        }}
                    />
                </Grid.Column>
                <Grid.Column>
                    <Input 
                        ref={this.modelAbrvRef}
                        placeholder={"Model Abbreviation"}
                        className={"grid-input modelAbrv"}
                        onChange={(e, data) => {
                            this.props.formData["modelAbrv"] = data.value
                        }}
                    />
                </Grid.Column>
                <Grid.Column>
                    <Button
                        onClick={() => {
                            this.props.createDataHandler();
                            if(this.makeNameRef) this.makeNameRef.current.clearValue();
                            if(this.modelNameRef) this.modelNameRef.current.inputRef.current.value = "";
                            if(this.modelAbrvRef) this.modelAbrvRef.current.inputRef.current.value = "";
                            this.props.closeCreate();
                            }
                        }
                    >
                        Confirm
                    </Button>
                </Grid.Column>
                <Grid.Column>
                    <Button
                        color="google plus"
                        onClick={() => {
                            if(this.makeNameRef) this.makeNameRef.current.clearValue();
                            if(this.modelNameRef) this.modelNameRef.current.inputRef.current.value = "";
                            if(this.modelAbrvRef) this.modelAbrvRef.current.inputRef.current.value = "";
                            this.props.closeCreate();
                            }
                        }
                    >
                        X
                    </Button>
                </Grid.Column>
            </Grid.Row>
        )
    }
}

export default CreateModelRow;