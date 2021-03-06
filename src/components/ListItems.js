import React from 'react';
import _ from 'lodash'
import { observer } from "mobx-react"
import { Grid, Button, Dropdown, Container, Divider } from 'semantic-ui-react'
import ReactPaginate from 'react-paginate'
import EditModal from './EditModal'
import './ListItems.css'
import { action, makeObservable, observable } from 'mobx'


const per_page = 10;

class ListItems extends React.Component {
    data = [];
    offset = 0;
    currentSort = "default";
    config = [];
    sortConfig = {
        key: 'make_name',
        direction: 'ascending'
    };
    pageCount = 0;
    filter = "";

    constructor(data) {
        super(data);

        this.dropdownRef = React.createRef();

        makeObservable(this, {
            data: observable,
            offset: observable,
            currentSort: observable,
            pageCount: observable,
            config: observable,
            filter: observable,
            sortConfig: observable,
            loadElements: action,
            handlePageClick: action,
            setSortConfig: action,
            sortedItems: action,
            filterBrand: action,
            setPageCount: action,
            clearFilter: action
        })
        
        this.data = data;
        this.pageCount = this.data.vehicleModel.length/per_page;
    }

    clearFilter = () => {
        this.filter = "";
        this.dropdownRef.current.clearValue();
        this.setPageCount(this.props.vehicleModel);
        this.loadElements();
    }

    setPageCount = (data) => {
        this.pageCount = data.length/per_page;
    }

    setSortConfig = (data) => {
        this.sortConfig.key = data.key;
        this.sortConfig.direction = data.direction;
    }

    filterBrand = (e, data) => {
            if(data.value !== ""){
                this.filter = this.props.vehicleMake.find(make => make.id === data.value).name;
                this.data.tempModel = this.props.vehicleModel.filter(model => model.makeId === data.value);
                this.setPageCount(this.data.tempModel);
                this.loadElements(true);
            }
    }

    sortedItems = () => {
        let sortableItems = [];
        if(this.filter === ""){
            sortableItems = [...this.props.vehicleModel];
        }else{
            sortableItems = [...this.data.tempModel];
        }
        if (this.sortConfig !== null) {
            let key = this.sortConfig.key;
            let dir = this.sortConfig.direction;
            let vehMake = [...this.props.vehicleMake];
            if(this.sortConfig.key === "make_name" || this.sortConfig.key === "make_abrv"){
                let sortedItems = [];
                key = key.substring(key.length - 4);
                vehMake.sort((a, b) => {
                    if (a[key] < b[key]) {
                    return dir === 'ascending' ? -1 : 1;
                    }
                    if (a[key] > b[key]) {
                    return dir === 'ascending' ? 1 : -1;
                    }
                    return 0;
                });

                for(let i=0; i < vehMake.length; i++ ){
                    sortableItems.map((vehicle) => {
                        if(vehicle.makeId === vehMake[i].id){
                            sortedItems.push(vehicle);
                        }
                        return 0;
                    })
                }

                sortableItems = sortedItems;
                console.log(sortableItems);
            }else{
                key = key.substring(key.length - 4);
                sortableItems.sort((a, b) => {
                    if (a[key] < b[key]) {
                    return dir === 'ascending' ? -1 : 1;
                    }
                    if (a[key] > b[key]) {
                    return dir === 'ascending' ? 1 : -1;
                    }
                    return 0;
                });
            }
        }
  
        this.data.tempModel = sortableItems;

        this.loadElements(true);
    };
      
    requestSort = key => {
        let direction = 'ascending';
        if (this.sortConfig && this.sortConfig.key === key && this.sortConfig.direction === 'ascending') {
         direction = 'descending';
        }
        this.setSortConfig({ key, direction });
        this.sortedItems();
    }

    loadElements = (bool = false) => {
        if(bool){
            this.data.vehicleModel = this.data.tempModel.slice(this.offset, this.offset + per_page)
        }else{
            this.data.vehicleModel = this.props.vehicleModel.slice(this.offset, this.offset + per_page)
        }
    }

    handlePageClick = (data) => {
        let selected = data.selected;
        this.offset  = Math.ceil(selected * per_page);

        if(this.filter === ""){
            this.loadElements();
        }else{
            this.loadElements(true)
        }
    }

    componentDidMount() {
        this.loadElements();
    }

    render() {
        const getClassNamesFor = (name) => {
            if (!this.sortConfig) {
              return;
            }
            return this.sortConfig.key === name ? this.sortConfig.direction : undefined;
        };
        const vehicleMake = this.props.vehicleMake;
        const listItems =  this.data.vehicleModel.map((vehicle) =>
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
                <Grid.Column>
                    <EditModal make_id={vehicle.makeId} model_id={vehicle.id} >
                    </EditModal>
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
        if(this.filter !== ""){
            button = 
            <Button onClick={() => this.clearFilter()}>
                Clear filter
            </Button>;
        } else {
            button = "";
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
                <Grid celled='internally' columns={5} verticalAlign="middle"> 
                    <Grid.Row>
                        <Grid.Column>
                            <Button 
                                compact
                                onClick={() => this.requestSort('make_name')}
                                className={getClassNamesFor('make_name')}
                            >
                                Name
                            </Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button 
                                compact
                                onClick={() => this.requestSort('make_abrv')}
                                className={getClassNamesFor('make_abrv')}
                            >
                                Name Abbreviation
                            </Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button 
                                compact
                                onClick={() => this.requestSort('model_name')}
                                className={getClassNamesFor('model_name')}
                            >
                                Model Name
                            </Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button 
                                compact
                                onClick={() => this.requestSort('model_abrv')}
                                className={getClassNamesFor('model_abrv')}
                            >
                                Model Name
                            </Button>
                        </Grid.Column>
                        <Grid.Column>Edit</Grid.Column>
                    </Grid.Row>
                    {listItems}
                    <ReactPaginate
                        previousLabel={'previous'}
                        nextLabel={'next'}
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={this.pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={this.handlePageClick}
                        containerClassName={'pagination'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'}
                    />
                </Grid>
            </div>
            
        );
    }
}


export default observer(ListItems);