import React from 'react'
import { inject, observer } from 'mobx-react'
import { action, makeObservable, observable } from 'mobx'

import makeService from '../services/MakeService'
import modelService from '../services/ModelService'

import ListHeader from '../components/ListHeader/ListHeader'
import ListItems from '../components/ListItems/ListsItems'
import listService from '../services/ListService'
import ReactPaginate from 'react-paginate'

import { Grid, Container, Dropdown, Divider, Button } from 'semantic-ui-react'

class HomePage extends React.Component {
    list = [];
    perCount = 10;
    pageCount = 0;
    offset = 0;
    dataList = [];
    viewList = [];
    filter = "";

    constructor(props){
        super(props);

        this.paginateRef = React.createRef();
        this.dropdownRef = React.createRef();

        makeObservable(this, {
            list: observable,
            viewList: observable,
            perCount: observable,
            pageCount: observable,
            offset: observable,
            filter: observable,
            handlePageClick: action,
            filterBrand: action,
            clearFilter: action,
            sortItems: action
        });

        this.list = modelService.getListItems(this.props.vehicleStore);
        this.dataList = [...this.list];
        this.pageCount = Math.ceil(this.dataList.length/this.perCount);
        this.viewList = this.list.slice(this.offset, this.offset+this.perCount);
        this.props.vehicleStore.sortConfig.initialValue("makeName");
    }

    handlePageClick = (data) => {
        let selected = data.selected;
        this.offset = Math.ceil(selected * this.perCount);
        this.viewList = this.dataList.slice(this.offset, this.offset+this.perCount);
    }

    filterBrand = (e, data) => {
        if(data.value !== ""){
            if(this.paginateRef.current) this.paginateRef.current.state.selected = 0;
            this.offset = 0;
            this.filter = makeService.getMakeName(this.props.vehicleStore, data.value);
            this.dataList = modelService.getFilteredList(this.list, data.value);
            this.viewList = this.dataList.slice(this.offset, this.offset+this.perCount); 
            this.pageCount = Math.ceil(this.dataList.length/this.perCount);
        }
    }

    clearFilter = () => {
        this.filter = "";
        if(this.paginateRef.current) this.paginateRef.current.state.selected = 0;
        if(this.dropdownRef.current) this.dropdownRef.current.clearValue();
        this.dataList = modelService.getListItems(this.props.vehicleStore);
        this.viewList = this.list.slice(this.offset, this.offset+this.perCount);
        this.pageCount = Math.ceil(this.dataList.length/this.perCount);
    }

    sortItems = key => {
        let direction = 'ascending';
        if (this.props.vehicleStore.sortConfig && this.props.vehicleStore.sortConfig.key === key && this.props.vehicleStore.sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        
        this.props.vehicleStore.sortConfig.edit(key, direction);
        this.list = this.props.vehicleStore.sortItems(this.list);

        if(this.dropdownRef.current.state.value !== "") this.dataList = modelService.getFilteredList(this.list, this.dropdownRef.current.state.value);
        else this.dataList = [...this.list];
        this.viewList = this.dataList.slice(this.offset, this.offset+this.perCount);
    }

    render() {
        const headerItems = [ 
            {key: "makeName", title: "Make Name", type: 'input'},
            {key: "makeAbrv", title: "Make Abbreviation", type: 'input'},
            {key: "modelName", title: "Model Name", type: 'input'},
            {key: "modelAbrv", title: "Model Abbreviation", type: 'input'}
        ];

        let button;
        if(this.filter !== ""){
            button = 
                <Button 
                    onClick={this.clearFilter}
                >
                    Clear filter
                </Button>;
        } else {
            button = null;
        }

        return (
            <React.Fragment>
                <Container textAlign="left">        
                    <Dropdown 
                        ref={this.dropdownRef}
                        id="brandDropdown"
                        className="dropdown"
                        placeholder='Car Brand' 
                        search 
                        selection 
                        options={makeService.getMakeBrandList(this.props.vehicleStore)} 
                        onChange={this.filterBrand}
                    />
                    {button}
                    
                </Container>
                <Divider 
                    clearing 
                    section 
                />
                <Grid
                        celled='internally' 
                        columns={4} 
                        verticalAlign="middle"
                        textAlign="center"    
                >
                    <ListHeader 
                        sortConfig = {this.props.vehicleStore.sortConfig}
                        sortItems = {this.sortItems}
                        getClassNames = {listService.getClassNamesFor}
                        headerList = {headerItems}
                        filter = {this.filter}
                    />
                    <ListItems 
                        items = {this.viewList}
                    />
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
            </React.Fragment>
        )
    }
}
  
export default inject("vehicleStore")(observer(HomePage)); 