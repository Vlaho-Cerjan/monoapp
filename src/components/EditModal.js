import React from 'react'
import { action, makeObservable } from 'mobx';

import { VehicleMake, VehicleModel } from '../common/VehicleStore';

import { Button, Header, Icon, Modal, Input, Grid } from 'semantic-ui-react'

import './EditModal.css'



class EditModal extends React.Component {
    constructor(props) {
        super(props);

        makeObservable(this, {
            editData: action,
        })
    
        this.state = {
          open: false,
          name: "",
          abrv: "",
          modelName: "",
          modelAbrv: ""
        };
      }

    setOpen = (data) => {
       this.setState({
           open: data
       })
    }

    editData = () => {
        this.setOpen(false);

        if(this.state.name !== ""){
            VehicleMake.find(make => make.id === this.props.make_id).name = this.state.name;
        }

        if(this.state.abrv !== ""){
            VehicleMake.find(make => make.id === this.props.make_id).abrv = this.state.abrv;
        }
        
        if(this.state.modelName !== ""){
            VehicleModel.find(model => model.id === this.props.model_id).name = this.state.modelName;
        }

        if(this.state.modelAbrv !== ""){
            VehicleModel.find(model => model.id === this.props.model_id).abrv = this.state.modelAbrv;
        }

        this.setState({
            name: "",
            abrv: "",
            modelName: "",
            modelAbrv: ""
        });
    }

    render() {
        return (
            <Modal
                basic
                onClose={() => this.setOpen(false)}
                onOpen={() => this.setOpen(true)}
                open={this.state.open}
                trigger={<Button>Edit</Button>}
                >
                <Header icon>
                    <Icon name='edit' />
                    Edit Vehicle Data
                </Header>
                <Modal.Content>
                    <Grid 
                        columns={4} 
                        verticalAlign="middle" 
                        textAlign="center"> 
                        <Grid.Row>
                            <Grid.Column>
                                <Input 
                                    onChange={(e) => this.setState({name: e.target.value})} 
                                    defaultValue={VehicleMake.find(make => make.id === this.props.make_id).name} 
                                    placeholder='Name' 
                                /></Grid.Column>
                            <Grid.Column>
                                <Input 
                                    onChange={(e) => this.setState({abrv: e.target.value})} 
                                    defaultValue={VehicleMake.find(make => make.id === this.props.make_id).abrv} 
                                    placeholder='Name Abbrv' 
                                /></Grid.Column>
                            <Grid.Column>
                                <Input 
                                    onChange={(e) => this.setState({modelName: e.target.value})} 
                                    defaultValue={VehicleModel.find(model => model.id === this.props.model_id).name} 
                                    placeholder='Model' 
                                /></Grid.Column>
                            <Grid.Column>
                                <Input 
                                    onChange={(e) => this.setState({modelAbrv: e.target.value})} 
                                    defaultValue={VehicleModel.find(model => model.id === this.props.model_id).abrv} 
                                    placeholder='Model Abbrv' 
                                /></Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <Button 
                        basic color='red' 
                        inverted 
                        onClick={() => this.setOpen(false)}
                    >
                    <Icon 
                        name='remove' 
                    /> 
                        No
                    </Button>
                    <Button 
                        color='green' 
                        inverted 
                        onClick={() => this.editData()}
                    >
                    <Icon 
                        name='checkmark' 
                    /> 
                        Yes
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

export default EditModal
