import React from 'react';
import { observer } from "mobx-react"
import { Grid } from 'semantic-ui-react'
import ReactPaginate from 'react-paginate'
import EditModal from './EditModal'
import './ListItems.css'



const per_page = 10;


class ListItems extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
          data: [],
          offset: 0,
        };
      }

    loadElements = () => {
        this.setState({
            data: this.props.vehicleModel.slice(this.state.offset, this.state.offset + per_page)
        })
    }

    handlePageClick = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * per_page);
        
        this.setState({ offset: offset }, () => {
            this.loadElements();
          });
    }

    componentDidMount() {
        this.loadElements();
    }

    render() {
       
        let vehicleModel = this.state.data;
        const pageCount = this.props.vehicleModel.length/per_page;
        const vehicleMake = this.props.vehicleMake;
        const listItems = vehicleModel.map((vehicle) =>
            <Grid.Row key={vehicle.id}>
                <Grid.Column>{vehicleMake.find(make => make.id === vehicle.makeId).name}</Grid.Column>
                <Grid.Column>{vehicleMake.find(make => make.id === vehicle.makeId).abrv}</Grid.Column>
                <Grid.Column>{vehicle.name}</Grid.Column>
                <Grid.Column>{vehicle.abrv}</Grid.Column>
                <Grid.Column><EditModal make_id={vehicle.makeId} model_id={vehicle.id}></EditModal></Grid.Column>
            </Grid.Row>
        )
        return (
            <Grid celled='internally' columns={5} verticalAlign="middle"> 
                
                <Grid.Row>
                    <Grid.Column>Name</Grid.Column>
                    <Grid.Column>Name Abbreviation</Grid.Column>
                    <Grid.Column>Model</Grid.Column>
                    <Grid.Column>Model Abbreviation</Grid.Column>
                    <Grid.Column>Edit</Grid.Column>
                </Grid.Row>
                {listItems}
                <ReactPaginate
                    previousLabel={'previous'}
                    nextLabel={'next'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={this.handlePageClick}
                    containerClassName={'pagination'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'}
                />
            </Grid>
        );
    }
}


export default observer(ListItems);