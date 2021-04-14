import React from 'react';
import { observer } from 'mobx-react';
import { action, makeObservable, observable } from 'mobx';

import MakeService from '../services/MakeService';
import ModelService from '../services/ModelService';

import ListHeader from '../components/ListHeader/ListHeader';
import ListModelItems from '../components/ListModelItems/ListModelItems';
import listService from '../services/ListService';
import ReactPaginate from 'react-paginate';

import { Grid, Divider, Container, Dropdown, Button } from 'semantic-ui-react';

import { withAlert } from 'react-alert';
import CreateModal from '../components/CreateModal/CreateModal';
import CreateModelRow from '../components/CreateModal/CreateRow/CreateModelRow';



class vehicleModel extends React.Component {
    list = [];
    perCount = 10;
    pageCount = 0;
    offset = 0;
    dataList = [];
    viewList = [];
    filter = -1;
    isReadOnly = {
      data: []
    };
    formData = {
      id: 0,
      makeId: 0,
      modelName: "",
      modelAbrv: "",
    };
    isCreateOpen = false;

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
            isReadOnly: observable,
            formData: observable,
            isCreateOpen: observable,
            handlePageClick: action,
            sortItems: action,
            editClickHandler: action,
            cancelHandler: action,
            editDataHandler: action,
            deleteDataHandler: action,
            openCreate: action,
            closeCreate: action,
            createDataHandler: action,
            filterBrand: action,
            clearFilter: action
        });
        this.dataList = ModelService.getListItems(MakeService.getAllMakes());
        this.dataList.map((data) => 
            this.isReadOnly.data.push({id: data.id, state: true})
        );
        this.sortConfig = listService.setSortConfig("makeName", "ascending");
        this.dataList = listService.sortItems([...this.dataList]);
        this.pageCount = Math.ceil(this.dataList.length/this.perCount);
        this.viewList = this.dataList.slice(this.offset, this.offset+this.perCount);
        
    }

    handlePageClick = (data) => {
        let selected = data.selected;
        this.offset = Math.ceil(selected * this.perCount);
        this.viewList = this.dataList.slice(this.offset, this.offset+this.perCount);
    }

    sortItems = key => {
        let direction = 'ascending';
        if (this.sortConfig.key === key && this.sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        
        this.sortConfig = listService.setSortConfig(key, direction);
        if(this.filter !== -1) {
           this.dataList = ModelService.getFilteredList(this.filter, MakeService.getAllMakes());
           
        }
        this.dataList = listService.sortItems([...this.dataList]);
        this.viewList = this.dataList.slice(this.offset, this.offset+this.perCount);
    }

    resetFormData = () => {
      this.formData = {
          id: 0,
          makeId: 0,
          modelName: "",
          modelAbrv: "",
      }
    }

    editClickHandler = (id) => {
      this.isReadOnly.data.map((data) => data.state = true);
      this.isReadOnly.data.find(data => data.id === id).state = false;
      this.resetFormData();
    }


    cancelHandler = () => {
      this.isReadOnly.data.map((data) => data.state = true);
      this.resetFormData();
    }

    editDataHandler = (id) => {
      let item = this.dataList.find(item => item.id === id);
      let modelName = this.formData.modelName !== "" ? this.formData.modelName : item.modelName;
      let itemList = this.dataList.filter(item => item.id !== id);
      if(itemList.find(item => item.modelName === modelName)) {
          this.props.alert.show('Unable to edit '+modelName+'! Another care model of this name already exists!', { type: 'error'});
          return;
      }
      this.dataList = ModelService.edit(id, this.formData);
      if(this.filter !== -1) this.dataList = ModelService.getFilteredList(this.filter, MakeService.getAllMakes());
      this.dataList = listService.sortItems([...this.dataList]);
      this.viewList = this.dataList.slice(this.offset, this.offset+this.perCount);
      this.isReadOnly.data.map((data) => data.state = true);
      this.props.alert.show('Car model '+modelName+' has been edited.', { type: 'success'});
      this.resetFormData();
    }

    deleteDataHandler = (id) => {
      let item = this.dataList.find(data => data.id === id);
      this.dataList = ModelService.remove(id);
      if(this.filter !== -1) this.dataList = ModelService.getFilteredList(this.filter, MakeService.getAllMakes());
      this.dataList = listService.sortItems([...this.dataList]);
      this.pageCount = Math.ceil(this.dataList.length/this.perCount);
      this.viewList = this.dataList.slice(this.offset, this.offset+this.perCount);
      this.props.alert.show('Car model '+item.modelName+' has been deleted.', { type: 'info'});
      if(this.paginateRef.current.state.selected > this.pageCount-1) {
        let data = {
          selected: this.paginateRef.current.state.selected-1
        };
        this.handlePageClick(data);
        this.paginateRef.current.state.selected = this.paginateRef.current.state.selected-1;
      }
      
    }

    openCreate = () => {
      this.isCreateOpen = true;
    }

    closeCreate = () => {
      this.isCreateOpen = false;
    }

    createDataHandler = () => {
      if(this.dataList.find(item => item.modelName === this.formData.modelName && item.makeId === this.formData.makeId)) {
        this.props.alert.show('Unable to create '+this.formData.modelName+'! The car model already exists!', { type: 'error'});
        return;
      }

      let id = 0;
      [this.dataList, id] = ModelService.add(this.formData);
      
      this.isReadOnly.data.push({id: id, state: true});
      if(this.filter !== -1) this.dataList = ModelService.getFilteredList(this.filter, MakeService.getAllMakes());
      this.dataList = listService.sortItems(this.dataList);
      this.pageCount = Math.ceil(this.dataList.length/this.perCount);
      this.viewList = this.dataList.slice(this.offset, this.offset+this.perCount);
      this.props.alert.show('Car model '+this.formData.modelName+' has been created.', { type: 'success'});
      this.resetFormData();
      this.isCreateOpen = false;
    }

    filterBrand = (e, data) => {
      if(data.value !== ""){
          if(this.paginateRef.current) this.paginateRef.current.state.selected = 0;
          this.offset = 0;
          this.filter = data.value;
          this.dataList = ModelService.getFilteredList(data.value, MakeService.getAllMakes());
          if(this.filter !== -1) this.dataList = listService.sortItems(this.dataList);
          this.viewList = this.dataList.slice(this.offset, this.offset+this.perCount); 
          this.pageCount = Math.ceil(this.dataList.length/this.perCount);
      }
    }

    clearFilter = () => {
      this.filter = -1;
      if(this.paginateRef.current) this.paginateRef.current.state.selected = 0;
      if(this.dropdownRef.current) this.dropdownRef.current.clearValue();
      this.dataList = ModelService.getListItems(MakeService.getAllMakes());
      this.viewList = this.dataList.slice(this.offset, this.offset+this.perCount);
      this.pageCount = Math.ceil(this.dataList.length/this.perCount);
    }
    

    render() {
        const headerItems = [ 
            {key: "makeName", title: "Make Name", type: 'inputOrText'},
            {key: "makeAbrv", title: "Make Abbreviation", type: 'inputOrText'},
            {key: "modelName", title: "Model Name", type: 'input'},
            {key: "modelAbrv", title: "Model Abbreviation", type: 'input'},
            {key: "edit", title: "Edit", type: 'button'},
            {key: "delete", title: "Delete", type: 'button'}
        ]

        let button;
        if(this.filter !== -1){
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
                        options={MakeService.getMakeBrandList()} 
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
                        columns={6} 
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
                    <ListModelItems 
                        items = {this.viewList}
                        isReadOnly = {this.isReadOnly}
                        formData = {this.formData}
                        editClickHandler = {this.editClickHandler}
                        cancelHandler = {this.cancelHandler}
                        editDataHandler = {this.editDataHandler}
                        deleteDataHandler = {this.deleteDataHandler}
                        brandOptions = {MakeService.getMakeBrandList()}

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
                    <CreateModal
                      columnNumber = {5}
                      isCreateOpen = {this.isCreateOpen}
                      openCreate = {this.openCreate}
                    >
                      <CreateModelRow 
                        isCreateOpen = {this.isCreateOpen}
                        formData = {this.formData}
                        closeCreate = {this.closeCreate}
                        createDataHandler = {this.createDataHandler}
                        brandOptions = {MakeService.getMakeBrandList()}
                      />
                    </CreateModal>
                </Grid>

            </React.Fragment>
        )
    }
}
  
export default withAlert()(observer(vehicleModel)); 