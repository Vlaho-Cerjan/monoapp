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
    Icon,
    Input
} from 'semantic-ui-react'

import ReactPaginate from 'react-paginate'

const perPage = 10;




class MainList extends React.Component {
    
    data = []
    tempLoadData = []
    pageCount = 0
    columnCount = 0
    isReadOnly = {
        data: []
    }
    formData = {
        makeId: 0,
        makeName: "",
        makeAbrv: "",
        modelName: "",
        modelAbrv: ""
    }
    inputRefs = []
    nameRefs = []
    isCreateOpen = false


    constructor(data) {
        super(data);

        this.dropdownRef = React.createRef()
        this.paginateRef = React.createRef()
        this.createDropRef = React.createRef()
        this.createNameRef = React.createRef()
        this.createAbrvRef = React.createRef()

        makeObservable(this, {
            data: observable,
            tempLoadData: observable,
            pageCount: observable,
            columnCount: observable,
            isReadOnly: observable,
            formData: observable,
            inputRefs: observable,
            nameRefs: observable,
            isCreateOpen: observable,
            loadElements: action,
            handlePageClick: action,
            filterBrand: action,
            clearFilter: action,
            requestSort: action,
            onEditClick: action,
            resetFormData: action,
            onCancelClick: action,
            editData: action,
            setRef: action,
            setNameRef: action,
            openCreate: action,
            closeCreate: action,
            createData: action,
            onCancelCreate: action,
            deleteData: action
        })
        
        this.data = data
        this.columnCount = this.data.columnCount
        this.pageCount = Math.ceil(this.data.listData.length/perPage)
        this.data.listData.map((data) => 
            this.isReadOnly.data.push({id: data.id, state: true})
        )
        this.data.store.setFilter(0)
        this.data.store.setOffset(0)
        this.data.store.sortConfig.edit(this.data.listItems.find(item => item.key !== 'id').key, 'ascending')
        this.tempLoadData = this.data.listData.slice(this.data.store.offset, this.data.store.offset + perPage)
        this.data.tempData = [...this.data.listData]
        this.isCreateOpen = false
    }
    

    loadElements = (bool = false) => {
        if(bool){
            this.tempLoadData = this.data.tempData.slice(this.data.store.offset, this.data.store.offset + perPage)
        }else{
            this.tempLoadData = this.data.listData.slice(this.data.store.offset, this.data.store.offset + perPage)
        }
        
    }

    componentWillUnmount(){
        if(this.data.alert) this.data.alert.removeAll()
    }

    componentDidMount() {
        this.loadElements();
    }

    handlePageClick = (data) => {
        let selected = data.selected;
        this.inputRefs = []
        this.nameRefs = []
        this.data.store.setOffset(Math.ceil(selected * perPage));
        this.loadElements(true);
    }

    filterBrand = (e, data) => {
        if(data.value !== ""){
            this.data.store.setFilter(data.value)
            this.data.tempData = this.data.listData.filter(item => item.makeId === data.value)
            let pageClick = []
            pageClick.selected = 0
            if(this.paginateRef.current) this.paginateRef.current.state.selected = 0
            this.pageCount = Math.ceil(this.data.tempData.length/perPage)
            this.handlePageClick(pageClick)
            this.requestSort()
        }
    }

    clearFilter = () => {
        this.data.store.setFilter(0)
        this.data.store.setOffset(0)
        this.dropdownRef.current.clearValue()
        this.data.tempData = this.data.listData
        this.pageCount = Math.ceil(this.data.tempData.length/perPage)
        this.loadElements(true);
        this.requestSort()
    }
    
    requestSort = key => {
        if(key){
            let direction = 'ascending';
            if (this.data.store.sortConfig && this.data.store.sortConfig.key === key && this.data.store.sortConfig.direction === 'ascending') {
            direction = 'descending';
            }
            this.data.store.sortConfig.edit(key, direction)
        }
        let self = this.data.store
        let sortableItems = [];
        if(self.filter === "") sortableItems = [...this.data.listData]
        else sortableItems = [...this.data.tempData]
        if (self.sortConfig !== null) {
            let key = self.sortConfig.key
            let dir = self.sortConfig.direction
            sortableItems.sort((a, b) => {
                if (a[key].toLowerCase() < b[key].toLowerCase()) {
                return dir === 'ascending' ? -1 : 1
                }
                if (a[key].toLowerCase() > b[key].toLowerCase()) {
                return dir === 'ascending' ? 1 : -1
                }
                return 0
            })
        }

        this.data.tempData = sortableItems
        this.loadElements(true)
        
    }  

    resetFormData = () => {
        this.formData = {
            makeId: "",
            makeName: "",
            makeAbrv: "",
            modelName: "",
            modelAbrv: ""
        }
    }

    setRef = (ref) => {
        if(ref != null) this.inputRefs.push(ref)
    };

    setNameRef = (ref) => {
        if(ref != null) this.nameRefs.push(ref)
    }

    openCreate = () => {
        this.isCreateOpen = true
    }

    closeCreate = () => {
        this.isCreateOpen = false
    }

    onEditClick = (id) => {
        this.isReadOnly.data.map((data) => data.state = true)
        this.isReadOnly.data.find(data => data.id === id).state = false;
        this.resetFormData()
    }

    onCancelClick = (id) => {
        this.isReadOnly.data.map((data) => data.state = true)
        this.resetFormData()
        this.inputRefs = this.inputRefs.filter(ref => ref !== null)
        if(this.nameRefs[id]) this.nameRefs[id].state.value = this.nameRefs[id].props.defaultValue
        if(this.abrvRefs[id]) this.abrvRefs[id].state.value = this.abrvRefs[id].props.defaultValue
    }

    editData = (id) => {
        let item = this.data.listData.find(item => item.id === id)
        let list = this.data.listData.filter(item => item.id !== id)
        if(list.find(item => item.makeName === this.formData.makeName)) {
            this.data.alert.show('Unable to edit '+item.makeName+'! Another care make of this name already exists!', { type: 'error'})
            return 
        }else if((list.find(item => item.makeId === this.formData.makeId) && list.find(item => item.modelName === this.formData.modelName))){
            this.data.alert.show('Unable to edit '+item.modelName+'! Another care model of this name already exists!', { type: 'error'})
            return 
        }

        this.data.listData = this.data.service.edit(this.data.store, id, this.formData)
        this.data.tempData = this.data.listData
        if(this.data.store.filter !== ""){
            this.filterBrand(false, this.dropdownRef.current.state)
        }else this.requestSort();
        this.isReadOnly.data.map((data) => data.state = true)
        if(this.formData.makeName !== "") this.data.alert.show('Car make '+this.formData.makeName+' has been edited.', { type: 'success'})
        else if(this.formData.modelName !== "") this.data.alert.show('Car model '+this.formData.modelName+' has been edited.', { type: 'success'})
        this.resetFormData()
    }

    createData = () => {
        if(this.data.listData.find(item => item.makeName === this.formData.makeName)) {
            this.data.alert.show('Unable to create '+this.formData.makeName+'! The car make already exists!', { type: 'error'})
            return 
        }else if((this.data.listData.find(item => item.makeId === this.formData.makeId) && this.data.listData.find(item => item.modelName === this.formData.modelName))){
            this.data.alert.show('Unable to create '+this.formData.modelName+'! The car model for this car make already exists!', { type: 'error'})
            return 
        }

        let id = 0;
        [this.data.listData, id] = this.data.service.add(this.data.store, this.formData)
        this.data.tempData = this.data.listData
        this.pageCount = Math.ceil(this.data.listData.length/perPage)
        if(this.data.store.filter !== ""){
            this.filterBrand(false, this.dropdownRef.current.state)
        }else this.requestSort();
        this.isReadOnly.data.push({id: id, state: true})

        if(this.createNameRef.current) this.createNameRef.current.inputRef.current.value = ""
        if(this.createAbrvRef.current) this.createAbrvRef.current.inputRef.current.value = ""

        if(this.formData.makeName !== "") this.data.alert.show('Car make '+this.formData.makeName+' has been created.', { type: 'success'})
        else if(this.formData.modelName !== "") this.data.alert.show('Car model '+this.formData.modelName+' has been created.', { type: 'success'})
        this.resetFormData()
        this.isCreateOpen = false
    }

    onCancelCreate = () => {
        this.resetFormData()
        this.isCreateOpen = false
        if(this.props.isModelPage) this.createDropRef.current.clearValue()
        if(this.createNameRef.current) this.createNameRef.current.inputRef.current.value = ""
        if(this.createAbrvRef.current) this.createAbrvRef.current.inputRef.current.value = ""
    }

    deleteData = (id) => {
        let item = this.data.listData.find(data => data.id === id)
        this.data.listData = this.data.service.remove(this.data.store, id)
        if(this.data.store.filter !== ""){
            this.filterBrand(false, this.dropdownRef.current.state)
        }else {
            this.pageCount = Math.ceil(this.data.listData.length/perPage)
            this.loadElements();
        }

        if(item.modelName) this.data.alert.show('Car model '+item.modelName+' has been deleted.', { type: 'info'})
        else this.data.alert.show('Car make '+item.makeName+' has been deleted.', { type: 'info'})
    }   

    render() {
        const getClassNamesFor = (name) => {
            if (!this.data.store.sortConfig) {
              return;
            }
            return this.data.store.sortConfig.key === name ? this.data.store.sortConfig.direction : undefined;
        };
        let dir;
        if(this.data.store.sortConfig.direction === "ascending"){
            dir = 
                <Icon 
                    name="long arrow alternate up"
                />;
        }else if(this.data.store.sortConfig.direction === "descending"){
            dir =
                <Icon
                    name="long arrow alternate down"
                />
        }

        let button;
        if(this.data.store.filter !== ""){
            button = 
                <Button 
                    onClick={() => this.clearFilter()}
                >
                    Clear filter
                </Button>;
        } else {
            button = "";
        }

        let dropdown;
        if(this.data.brandList){
                dropdown = 
                <div>
                    <Container textAlign="left">        
                        <Dropdown 
                            id="brandDropdown"
                            className="dropdown"
                            ref={this.dropdownRef}
                            placeholder='Car Brand' 
                            search 
                            selection 
                            options={this.data.brandList} 
                            onChange={this.filterBrand}
                        />
                        {button}
                        
                    </Container>
                    <Divider 
                        clearing 
                        section 
                    />
                </div>   
        }
        let headerItems = [
            this.data.listItems.map((item, index) => {
                if(item.key === "edit"){
                    return (
                        <Grid.Column key={index}>
                            <Icon 
                                name='edit outline'
                                size='large'
                            />
                        </Grid.Column>
                    )
                }
                else if(item.key === "delete"){
                    return (
                        <Grid.Column key={index}>
                            <Icon 
                                name='trash alternate'
                                size='large'
                            />
                        </Grid.Column>
                    )
                }
                else{
                    return (
                        <Grid.Column key={index}>
                            <Button 
                                compact
                                onClick={() => this.requestSort(item.key)}
                                className={getClassNamesFor(item.key)}
                            >
                                {item.title} 
                                {this.data.store.sortConfig.key === item.key ? dir : ""}
                            </Button>
                        </Grid.Column>
                    )    
                }
            })
        ]

        let listItems = "";
        listItems = [
            this.tempLoadData.map((item, index) => {
                return(
                <Grid.Row key={item.id}>
                    {this.data.listItems.map((listItem, ind) => {
                        if(listItem.type === 'dropdown'){
                            return (
                                <Grid.Column key={item.id+ind+listItem.key}>
                                    <Dropdown 
                                        id={index}
                                        className="dropdown"
                                        placeholder='Select Brand' 
                                        selection 
                                        closeOnChange
                                        ref={this.setNameRef}
                                        options={this.data.brandList} 
                                        defaultValue={this.data.brandList.find(brand => brand.key === item.makeId).value}
                                        disabled={this.isReadOnly.data.find(data => data.id === item.id).state}
                                        className={this.isReadOnly.data.find(data => data.id === item.id).state ? "grid-input "+listItem.key+" readOnly" : "grid-input "+listItem.key}
                                        onChange={(e, data) => {
                                            this.formData.makeId = data.value
                                            this.inputRefs.find(ref => ref.props.id === index.toString()+"1").inputRef.current.value = this.data.store.makes.find(make => make.id === data.value).name
                                        }}
                                    />
                                </Grid.Column>
                            )
                        }
                        else if(listItem.key === "edit"){
                            return(
                            !this.isReadOnly.data.find(data => data.id === item.id).state ? 
                                <Grid.Column key={item.id+ind+listItem.key} >
                                    <Button
                                        onClick={() => this.editData(item.id)}
                                    >
                                        Confirm
                                    </Button>
                                    <Button
                                        color="google plus"
                                        onClick={() => this.onCancelClick(index)}
                                    >
                                        X
                                    </Button>
                                </Grid.Column>
                                : 
                                <Grid.Column key={item.id+ind+listItem.key}>
                                    <Button
                                        onClick={() => this.onEditClick(item.id)}
                                    >
                                        {listItem.title}
                                    </Button>
                                </Grid.Column>
                            
                            )
                        }else if(listItem.key === "delete"){
                            return (
                                <Grid.Column key={item.id+ind+listItem.key}>
                                    <Button
                                        onClick={() => this.deleteData(item.id)}
                                    >
                                        {listItem.title}
                                    </Button>
                                </Grid.Column>
                            )
                        }
                        else if(listItem.type === 'input'){
                            return (
                                <Grid.Column key={item.id+ind+listItem.key}>
                                    <Input 
                                        id={index.toString()+ind}
                                        ref={this.setRef}
                                        defaultValue={item[listItem.key]}
                                        readOnly={listItem.key==="makeAbrv"? true : this.isReadOnly.data.find(data => data.id === item.id).state}
                                        className={this.isReadOnly.data.find(data => data.id === item.id).state ? "grid-input "+listItem.key+" readOnly" : "grid-input "+listItem.key}
                                        onChange={(e, data) => {
                                            this.formData[listItem.key] = data.value
                                        }}
                                    />
                                </Grid.Column>
                                
                            )
                        }
                    })}
                </Grid.Row>
                )
            })
            
        ]
        
        let createElement = "";
        if(this.data.createColumnCount){
        createElement = 
            <Container
                fluid
                className="create-container"
            >
                <Divider 
                    clearing
                    section
                />
                {!this.isCreateOpen ?
                <Button 
                    size='big'
                    onClick={this.openCreate}
                >
                    Create
                </Button>
                : ""}
                {this.isCreateOpen ? 
                <Grid 
                    celled="internally"
                    columns={this.data.createColumnCount} 
                    verticalAlign="middle"
                    textAlign="center"    
                >
                    <Grid.Row key="createRow">
                        {this.data.listItems.map((item, index) => {
                            if(item.key === "makeAbrv" && this.data.brandList) return
                            if(item.type === 'dropdown'){
                                return(
                                    <Grid.Column key={item.key+index}>
                                        <Dropdown 
                                            className="dropdown"
                                            placeholder={item.title}
                                            selection 
                                            ref={this.createDropRef}
                                            options={this.data.brandList} 
                                            className={"grid-input "+item.key}
                                            onChange={(e, data) => {
                                                this.formData.makeId = data.value
                                            }}
                                        />
                                    </Grid.Column>
                                )
                            }
                            else if(item.type === 'input'){
                                return (
                                    <Grid.Column key={item.key+index}>
                                        <Input 
                                            ref={(item.key==="makeName" || item.key==="modelName")?this.createNameRef:this.createAbrvRef}
                                            placeholder={item.title}
                                            className={"grid-input "+item.key}
                                            onChange={(e, data) => {
                                                this.formData[item.key] = data.value
                                            }}
                                        />
                                    </Grid.Column>
                                )
                            }
                        })}
                        <Grid.Column>
                            <Button
                                onClick={() => this.createData()}
                            >
                                Confirm
                            </Button>
                            <Button
                                color="google plus"
                                onClick={() => this.onCancelCreate()}
                            >
                                X
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                : ""}
            </Container>
        }
        return (
            <div>
                {dropdown}
                <Grid 
                    celled='internally' 
                    columns={this.columnCount} 
                    verticalAlign="middle"
                    textAlign="center"    
                > 
                    <Grid.Row key="header">
                        {headerItems}
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
                    {createElement}
                </Grid>
            </div>
            
        );
    }
}

export default (observer(MainList))
