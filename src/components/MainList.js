import { 
    inject, 
    observer 
} from 'mobx-react';

import { 
    makeObservable, 
    observable, 
    action 
} from 'mobx'

import React from 'react'
import _ from 'lodash'

import { 
    Grid, 
    Button, 
    Dropdown, 
    Container,
    Divider, 
    Icon
} from 'semantic-ui-react'

import ReactPaginate from 'react-paginate'

const per_page = 10;

class MainList extends React.Component {
    data = [];
    tempModelData = [];
    tempMakeData = [];
    offset = 0;
    pageCount = 0;

    constructor(data) {
        super(data);

        this.dropdownRef = React.createRef();
        this.paginateRef = React.createRef();

        makeObservable(this, {
            data: observable,
            tempModelData: observable,
            tempMakeData: observable,
            offset: observable,
            pageCount: observable,
            loadElements: action,
            handlePageClick: action,
            filterBrand: action,
            setPageCount: action,
            clearFilter: action
        })
        
        this.data = data
        this.tempMakeData = [...this.data.vehicleStore.makes]
        this.tempModelData = [...this.data.vehicleStore.models]
        this.pageCount = this.tempModelData.length/per_page
        this.data.vehicleStore.setMake(1)
        this.data.vehicleStore.setFilter(0)
        this.data.vehicleStore.setOffset(0)
    }

    loadElements = (bool = false) => {
        if(bool){
            this.tempModelData = this.data.tempModel.slice(this.offset, this.offset + per_page)
        }else{
            this.tempModelData = this.data.vehicleStore.models.slice(this.offset, this.offset + per_page)
        }
    }

    componentDidMount() {
        this.loadElements();
    }

    setPageCount = (data) => {
        this.pageCount = data.length/per_page;
    }

    handlePageClick = (data) => {
        let selected = data.selected;
        this.offset  = Math.ceil(selected * per_page);

        if(this.data.vehicleStore.filter === ""){
            this.loadElements();
        }else{
            this.loadElements(true)
        }
    }

    filterBrand = (e, data) => {
        if(data.value !== ""){
            this.data.vehicleStore.setFilter(data.value);
            this.data.vehicleStore.setMake(data.value)
            this.data.tempModel = this.data.vehicleStore.filteredVehicles();
            let pageClick = [];
            pageClick.selected = 0;
            this.setPageCount(this.data.tempModel);
            this.handlePageClick(pageClick);
            this.data.vehicleStore.sortItems(this.data.tempModel);
            this.paginateRef.current.state.selected = 0;
        }
    }

    clearFilter = () => {
        this.data.vehicleStore.setFilter(0);
        this.dropdownRef.current.clearValue();
        this.setPageCount(this.data.vehicleStore.models);
        this.loadElements();
    }
    
    requestSort = key => {
        let direction = 'ascending';
        if (this.data.vehicleStore.sortConfig && this.data.vehicleStore.sortConfig.key === key && this.data.vehicleStore.sortConfig.direction === 'ascending') {
         direction = 'descending';
        }
        this.data.vehicleStore.sortConfig.edit(key, direction)
        this.data.tempModel = this.data.vehicleStore.sortItems(this.data.tempModel)
        this.loadElements(true);
    }  

    render() {
        const getClassNamesFor = (name) => {
            if (!this.data.vehicleStore.sortConfig) {
              return;
            }
            return this.data.vehicleStore.sortConfig.key === name ? this.data.vehicleStore.sortConfig.direction : undefined;
        };
        const vehicleMake = this.tempMakeData;
        const listItems =  this.tempModelData.map((vehicle) =>
            <Grid.Row key={vehicle.id}>
                <Grid.Column>
                    {vehicleMake.find(make => make.id === vehicle.makeId).name}
                </Grid.Column>
                <Grid.Column>
                    {vehicleMake.find(make => make.id === vehicle.makeId).abrv}
                </Grid.Column>
                <Grid.Column>
                    {vehicle.name}
                </Grid.Column>
                <Grid.Column>
                    {vehicle.abrv}
                </Grid.Column>
            </Grid.Row>
        )
        const brandOptions = _.map(vehicleMake, (make, index) => ({
            key: make.id,
            text: make.name,
            value: make.id,
        })
        )
        let button;
        if(this.data.vehicleStore.filter !== ""){
            button = 
                <Button 
                    onClick={() => this.clearFilter()}
                >
                    Clear filter
                </Button>;
        } else {
            button = "";
        }

        let dir;
        if(this.data.vehicleStore.sortConfig.direction === "ascending"){
            dir = 
                <Icon 
                    name="long arrow alternate up"
                />;
        }else if(this.data.vehicleStore.sortConfig.direction === "descending"){
            dir =
                <Icon
                    name="long arrow alternate down"
                />
        }
        return (
            <div>
                <Container textAlign="left">        
                    <Dropdown 
                        id="brandDropdown"
                        className="dropdown"
                        ref={this.dropdownRef}
                        placeholder='Car Brand' 
                        search 
                        selection 
                        options={brandOptions} 
                        onChange={this.filterBrand}
                    />
                    {button}
                    
                </Container>
                <Divider clearing section />
                <Grid 
                    celled='internally' 
                    columns={4} 
                    verticalAlign="middle"
                    textAlign="center"    
                > 
                    <Grid.Row>
                        <Grid.Column>
                            <Button 
                                compact
                                onClick={() => this.requestSort('make_name')}
                                className={getClassNamesFor('make_name')}
                            >
                                Name 
                                {this.data.vehicleStore.sortConfig.key === "make_name"? dir : ""}
                                </Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button 
                                compact
                                onClick={() => this.requestSort('make_abrv')}
                                className={getClassNamesFor('make_abrv')}
                            >
                                Name Abbreviation
                                {this.data.vehicleStore.sortConfig.key === "make_abrv"? dir : ""}
                            </Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button 
                                compact
                                onClick={() => this.requestSort('model_name')}
                                className={getClassNamesFor('model_name')}
                                >
                                Model Name
                                {this.data.vehicleStore.sortConfig.key === "model_name"? dir : ""}
                            </Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button 
                                compact
                                onClick={() => this.requestSort('model_abrv')}
                                className={getClassNamesFor('model_abrv')}
                            >
                                Model Name
                                {this.data.vehicleStore.sortConfig.key === "model_abrv"? dir : ""}
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                    {listItems}
                    <ReactPaginate
                        ref={this.paginateRef}
                        previousLabel={'previous'}
                        nextLabel={'next'}
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={this.pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={this.handlePageClick}
                        pageClassName={'page'}
                        containerClassName={'pagination'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'}
                    />
                </Grid>
            </div>
            
        );
    }
}

export default inject("vehicleStore")(observer(MainList));
