import React, { Component } from 'react'

import { Grid, Input, Button } from 'semantic-ui-react'

class CreateMakeRow extends Component {
    constructor(props){
        super(props);

        this.nameRef = React.createRef();
        this.abrvRef = React.createRef();
    }

    render(){
        
        return(
            <Grid.Row key="createRow">  
                <Grid.Column>
                    <Input 
                        ref={this.nameRef}
                        placeholder={"Make Name"}
                        className={"grid-input makeName"}
                        onChange={(e, data) => {
                            this.props.formData["makeName"] = data.value
                        }}
                    />
                </Grid.Column>
                <Grid.Column>
                    <Input 
                        ref={this.abrvRef}
                        placeholder={"Make Abbreviation"}
                        className={"grid-input makeAbrv"}
                        onChange={(e, data) => {
                            this.props.formData["makeAbrv"] = data.value
                        }}
                    />
                </Grid.Column>
                <Grid.Column>
                    <Button
                        onClick={() => {
                            this.props.createDataHandler();
                            if(this.nameRef) this.nameRef.current.inputRef.current.value = "";
                            if(this.abrvRef) this.abrvRef.current.inputRef.current.value = "";
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
                            if(this.nameRef) this.nameRef.current.inputRef.current.value = "";
                            if(this.abrvRef) this.abrvRef.current.inputRef.current.value = "";
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