import React from 'react'
import { inject, observer } from 'mobx-react'
import { action, makeObservable, observable } from 'mobx'

import MakeService from '../services/MakeService'
import ModelService from '../services/ModelService'

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

        this.list = ModelService.getListItems();
        this.dataList = [...this.list];
        this.pageCount = Math.ceil(this.dataList.length/this.perCount);
        this.viewList = this.list.slice(this.offset, this.offset+this.perCount);
        this.sortConfig = listService.setSortConfig("makeName");
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
            this.filter = MakeService.getMakeName(data.value);
            this.dataList = ModelService.getFilteredList(data.value);
            this.dataList = listService.sortItems([...this.dataList]);
            this.viewList = this.dataList.slice(this.offset, this.offset+this.perCount); 
            this.pageCount = Math.ceil(this.dataList.length/this.perCount);
        }
    }

    clearFilter = () => {
        this.filter = "";
        if(this.paginateRef.current) this.paginateRef.current.state.selected = 0;
        if(this.dropdownRef.current) this.dropdownRef.current.clearValue();
        this.dataList = ModelService.getListItems();
        this.viewList = this.list.slice(this.offset, this.offset+this.perCount);
        this.pageCount = Math.ceil(this.dataList.length/this.perCount);
    }

    sortItems = key => {
        let direction = 'ascending';
        if (this.sortConfig.key === key && this.sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        
        this.sortConfig = listService.setSortConfig(key, direction);
        this.list = listService.sortItems([...this.list]);

        if(this.dropdownRef.current.state.value !== "") {
            this.dataList = ModelService.getFilteredList(this.dropdownRef.current.state.value);
            this.dataList = listService.sortItems([...this.dataList]);

        }
        else this.dataList = [...this.list];
        this.viewList = this.dataList.slice(this.offset, this.offset+this.perCount);
    }

    render() {
        const headerItems = [ 
            {key: "makeName", title: "Make Name", type: 'inputOrText'},
            {key: "makeAbrv", title: "Make Abbreviation", type: 'inputOrText'},
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
                        options={MakeService.getMakeBrandListWithDataOnly()} 
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
                        sortConfig = {this.sortConfig}
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
  
export default observer(HomePage); 