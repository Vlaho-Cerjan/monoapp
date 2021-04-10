import React from 'react'
import { inject, observer } from 'mobx-react'
import { action, makeObservable, observable } from 'mobx'

import makeService from '../services/MakeService'

import ListHeader from '../components/ListHeader/ListHeader'
import ListModelItems from '../components/ListModelItems/ListModelItems'
import listService from '../services/ListService'
import ReactPaginate from 'react-paginate'

import { Grid, Divider, Container, Dropdown } from 'semantic-ui-react'

import { withAlert } from 'react-alert'
import CreateModal from '../components/CreateModal/CreateModal'
import CreateMakeRow from '../components/CreateModal/CreateRow/CreateMakeRow'
import modelService from '../services/ModelService'


class vehicleModel extends React.Component {
    list = [];
    perCount = 10;
    pageCount = 0;
    offset = 0;
    dataList = [];
    viewList = [];
    filter = "";
    isReadOnly = {
      data: []
    }
    formData = {
      id: 0,
      makeId: 0,
      modelName: "",
      modelAbrv: "",
    }
    isCreateOpen = false

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
            createDataHandler: action
        });

        this.list = modelService.getListItems(this.props.vehicleStore);
        this.list.map((data) => 
            this.isReadOnly.data.push({id: data.id, state: true})
        )
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

    sortItems = key => {
        let direction = 'ascending';
        if (this.props.vehicleStore.sortConfig && this.props.vehicleStore.sortConfig.key === key && this.props.vehicleStore.sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        
        this.props.vehicleStore.sortConfig.edit(key, direction);
        this.list = listService.sortItems([...this.list], this.props.vehicleStore.sortConfig);
        this.dataList = [...this.list];
        this.viewList = this.dataList.slice(this.offset, this.offset+this.perCount);
    }

    resetFormData = () => {
      this.formData = {
          id: 0,
          makeName: "",
          makeAbrv: "",
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
      let item = this.list.find(item => item.id === id);
      let modelName = this.formData.modelName !== "" ? this.formData.modelName : item.modelName
      let itemList = this.list.filter(item => item.id !== id);
      if(itemList.find(item => item.modelName === modelName)) {
          this.props.alert.show('Unable to edit '+modelName+'! Another care make of this name already exists!', { type: 'error'});
          return;
      }
      this.list = modelService.edit(this.props.vehicleStore, id, this.formData);
      this.list = listService.sortItems(this.list, this.props.vehicleStore.sortConfig);
      this.dataList = [...this.list];
      this.viewList = this.dataList.slice(this.offset, this.offset+this.perCount);
      this.isReadOnly.data.map((data) => data.state = true);
      this.props.alert.show('Car make '+modelName+' has been edited.', { type: 'success'});
      this.resetFormData();
    }

    deleteDataHandler = (id) => {
      let item = this.list.find(data => data.id === id);
      this.list = modelService.remove(this.props.vehicleStore, id);
      this.pageCount = Math.ceil(this.list.length/this.perCount);
      this.dataList = [...this.list];
      this.viewList = this.dataList.slice(this.offset, this.offset+this.perCount);
      this.props.alert.show('Car make '+item.modelName+' has been deleted.', { type: 'info'});
    }

    openCreate = () => {
      this.isCreateOpen = true;
    }

    closeCreate = () => {
      this.isCreateOpen = false;
    }

    createDataHandler = () => {
      if(this.list.find(item => item.modelName === this.formData.modelName)) {
        this.data.alert.show('Unable to create '+this.formData.makeName+'! The car make already exists!', { type: 'error'})
        return 
      }

      let id = 0;
      [this.list, id] = makeService.add(this.props.vehicleStore, this.formData)
      this.pageCount = Math.ceil(this.list.length/this.perCount)
      this.isReadOnly.data.push({id: id, state: true})
      this.list = listService.sortItems(this.list, this.props.vehicleStore.sortConfig);
      this.dataList = [...this.list];
      this.viewList = this.dataList.slice(this.offset, this.offset+this.perCount);
      this.props.alert.show('Car make '+this.formData.makeName+' has been created.', { type: 'success'})
      this.resetFormData()
      this.isCreateOpen = false
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
    

    render() {
        const headerItems = [ 
            {key: "makeName", title: "Make Name", type: 'dropdown'},
            {key: "makeAbrv", title: "Make Abbreviation", type: 'text'},
            {key: "modelName", title: "Model Name", type: 'input'},
            {key: "modelAbrv", title: "Model Abbreviation", type: 'input'},
            {key: "edit", title: "Edit", type: 'button'},
            {key: "delete", title: "Delete", type: 'button'}
        ]

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
                        columns={6} 
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
                    <ListModelItems 
                        items = {this.viewList}
                        isReadOnly = {this.isReadOnly}
                        formData = {this.formData}
                        editClickHandler = {this.editClickHandler}
                        cancelHandler = {this.cancelHandler}
                        editDataHandler = {this.editDataHandler}
                        deleteDataHandler = {this.deleteDataHandler}
                        brandOptions = {makeService.getMakeBrandList(this.props.vehicleStore)}

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
                      columnNumber = {6}
                      isCreateOpen = {this.isCreateOpen}
                      openCreate = {this.openCreate}
                    >
                      <CreateMakeRow 
                        isCreateOpen = {this.isCreateOpen}
                        formData = {this.formData}
                        closeCreate = {this.closeCreate}
                        createDataHandler = {this.createDataHandler}
                      />
                    </CreateModal>
                </Grid>

            </React.Fragment>
        )
    }
}
  
export default inject("vehicleStore")(withAlert()(observer(vehicleModel))); 