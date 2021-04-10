import React, { Component } from 'react'

import { Grid, Input, Button } from 'semantic-ui-react'

class CreateMakeRow extends Component {
    constructor(props){
        super(props);

        this.makeNameRef = React.createRef();
        this.makeAbrvRef = React.createRef();
        this.modelNameRef = React.createRef();
        this.modelAbrvRef = React.createRef();
    }

    render(){
        
        return(
            <Grid.Row key="createRow">  
                <Grid.Column>
                    <Input 
                        ref={this.makeNameRef}
                        placeholder={"Make Name"}
                        className={"grid-input makeName"}
                        onChange={(e, data) => {
                            this.props.formData["makeName"] = data.value
                        }}
                    />
                </Grid.Column>
                <Grid.Column>
                    <Input 
                        ref={this.makeAbrvRef}
                        placeholder={"Make Abbreviation"}
                        className={"grid-input makeAbrv"}
                        onChange={(e, data) => {
                            this.props.formData["makeAbrv"] = data.value
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
                            if(this.makeNameRef) this.makeNameRef.current.inputRef.current.value = "";
                            if(this.makeAbrvRef) this.makeAbrvRef.current.inputRef.current.value = "";
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
                            if(this.makeNameRef) this.makeNameRef.current.inputRef.current.value = "";
                            if(this.makeAbrvRef) this.makeAbrvRef.current.inputRef.current.value = "";
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

export default CreateMakeRow;