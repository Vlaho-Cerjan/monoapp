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
    Input,
    Select
} from 'semantic-ui-react'

import ReactPaginate from 'react-paginate'

const per_page = 10;

class MainList extends React.Component {
    data = []
    tempModelData = []
    tempMakeData = []
    tempLoadData = []
    pageCount = 0
    columnCount = 0
    isReadOnly = {
        data: []
    }
    formData = {
        make_id: 0,
        make_name: "",
        make_abrv: "",
        model_name: "",
        model_abrv: ""
    }
    inputRefs = []
    nameRefs = []
    abrvRefs = []
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
            tempModelData: observable,
            tempMakeData: observable,
            tempLoadData: observable,
            pageCount: observable,
            columnCount: observable,
            isReadOnly: observable,
            formData: observable,
            inputRefs: observable,
            nameRefs: observable,
            abrvRefs: observable,
            isCreateOpen: observable,
            loadElements: action,
            handlePageClick: action,
            filterBrand: action,
            clearFilter: action,
            setColumnCount: action,
            requestSort: action,
            onEditClick: action,
            resetFormData: action,
            onCancelClick: action,
            editData: action,
            setRef: action,
            setNameRef: action,
            setAbrvRef: action,
            openCreate: action,
            closeCreate: action,
            createData: action,
            onCancelCreate: action,
        })
        
        this.data = data
        this.tempMakeData = [...this.data.vehicleStore.makes]
        this.tempModelData = [...this.data.vehicleStore.models]
        this.tempLoadData = this.tempModelData
        this.pageCount = this.tempModelData.length/per_page
        if(this.props.isMakePage){
            this.pageCount = this.tempMakeData.length/per_page
            this.tempLoadData = this.tempMakeData
            this.tempLoadData.map((data) => 
                this.isReadOnly.data.push({id: data.id, state: true})
            )
        }else{
            this.tempLoadData.map((data) => 
                this.isReadOnly.data.push({id: data.id, state: true})
            )
        }
        this.data.vehicleStore.setMake(1)
        this.data.vehicleStore.setFilter(0)
        this.data.vehicleStore.setOffset(0)
        this.data.dataCount = this.tempLoadData.length
        this.data.tempModel = this.tempLoadData
        this.isCreateOpen = false
    }
    

    loadElements = (bool = false) => {
        if(!this.props.isMakePage){
            if(bool){
                this.tempLoadData = this.data.tempModel.slice(this.data.vehicleStore.offset, this.data.vehicleStore.offset + per_page)
            }else{
                this.tempLoadData = this.data.vehicleStore.models.slice(this.data.vehicleStore.offset, this.data.vehicleStore.offset + per_page)
            }
        } else {
            if(bool){
                this.tempLoadData = this.data.tempModel
            }else{
                this.tempLoadData = this.data.vehicleStore.makes
            }
            
        }
    }

    componentDidMount() {
        this.loadElements();
    }

    handlePageClick = (data) => {
        let selected = data.selected;
        this.data.vehicleStore.setOffset(Math.ceil(selected * per_page));

        this.loadElements(true);
    }

    filterBrand = (e, data) => {
        if(data.value !== ""){
            this.data.vehicleStore.setFilter(data.value);
            this.data.vehicleStore.setMake(data.value)
            this.data.tempModel = this.data.vehicleStore.filteredVehicles();
            let pageClick = [];
            pageClick.selected = 0;
            this.handlePageClick(pageClick);
            this.data.tempModel = this.data.vehicleStore.sortItems(this.data.tempModel);
            this.pageCount = this.data.tempModel.length/per_page;
            this.loadElements(true);
            if(this.paginateRef.current) this.paginateRef.current.state.selected = 0;
        }
    }

    clearFilter = () => {
        this.data.vehicleStore.setFilter(0)
        this.data.vehicleStore.setOffset(0)
        this.dropdownRef.current.clearValue()
        this.pageCount = this.data.vehicleStore.models.length/per_page
        this.data.dataCount = this.data.vehicleStore.models.length
        this.data.tempModel = this.data.vehicleStore.models
        this.data.tempModel = this.data.vehicleStore.sortItems(this.data.tempModel);
        this.loadElements(true);
    }
    
    requestSort = key => {
        let direction = 'ascending';
        if (this.data.vehicleStore.sortConfig && this.data.vehicleStore.sortConfig.key === key && this.data.vehicleStore.sortConfig.direction === 'ascending') {
         direction = 'descending';
        }
        this.data.vehicleStore.sortConfig.edit(key, direction)
        if(this.props.isMakePage) this.data.tempModel = this.data.vehicleStore.sortMakes() 
        else this.data.tempModel = this.data.vehicleStore.sortItems(this.data.tempModel)
        this.loadElements(true);
    }  

    setColumnCount = (count) => {
        this.columnCount = count
    }

    resetFormData = () => {
        this.formData = {
            make_id: "",
            make_name: "",
            make_abrv: "",
            model_name: "",
            model_abrv: ""
        }
    }

    onEditClick = (id) => {
        this.isReadOnly.data.map((data) => data.state = true)
        this.isReadOnly.data.find(data => data.id === id).state = false;
        this.resetFormData()
    }

    onCancelClick = (id, makeId) => {
        this.isReadOnly.data.map((data) => data.state = true)
        this.resetFormData()
        this.inputRefs = this.inputRefs.filter(ref => ref !== null)
        if(!this.props.isMakePage){
            this.inputRefs[id].state.value = makeId
        }
        this.nameRefs[id].inputRef.current.value = this.nameRefs[id].props.defaultValue
        this.abrvRefs[id].inputRef.current.value = this.abrvRefs[id].props.defaultValue
    }

    editData = (id) => {
        if(this.props.isMakePage){
            this.data.vehicleStore.makes.find(m => m.id === id).edit(this.formData.make_name, this.formData.make_abrv)
        }else{
            this.data.vehicleStore.models.find(m => m.id === id).edit(this.formData.make_id, this.formData.model_name, this.formData.model_abrv)
        }
        this.isReadOnly.data.map((data) => data.state = true)
        this.resetFormData()
        if(this.props.isMakePage) this.data.tempModel = this.data.vehicleStore.sortMakes() 
        else this.data.tempModel = this.data.vehicleStore.sortItems(this.data.tempModel)
        this.loadElements(true);
    }

    setRef = (ref) => {
        this.inputRefs.push(ref)
    };

    setNameRef = (ref) => {
        this.nameRefs.push(ref)
    }

    setAbrvRef = (ref) => {
        this.abrvRefs.push(ref)
    }

    openCreate = () => {
        this.isCreateOpen = true
    }

    closeCreate = () => {
        this.isCreateOpen = false
    }

    createData = () => {
        let id = 0;
        if(this.props.isMakePage) {
            this.data.vehicleStore.addMake(this.formData.make_name, this.formData.make_abrv)
            if(this.data.vehicleStore.makes.find(m => m.name === this.formData.make_name)) {
                id = this.data.vehicleStore.makes.find(m => m.name === this.formData.make_name).id
                this.isReadOnly.data.push({id: id, state: true})
            }
            this.loadElements();
        }
        else {
            this.data.vehicleStore.addModel(this.formData.make_id, this.formData.model_name, this.formData.model_name)
            if(this.data.vehicleStore.models.find(m => m.name === this.formData.model_name)) { 
                id = this.data.vehicleStore.models.find(m => m.name === this.formData.model_name).id
                this.isReadOnly.data.push({id: id, state: true})
            }
            this.createDropRef.current.clearValue()
            if(this.tempLoadData.find(temp => temp.makeId === this.data.vehicleStore.models.find(m => m.name === this.formData.model_name).makeId)) {
            this.tempLoadData.push(this.data.vehicleStore.models.find(m => m.name === this.formData.model_name))
            this.data.tempModel = this.data.vehicleStore.sortItems(this.tempLoadData);
            this.pageCount = this.data.tempModel.length/per_page;
            }
            this.loadElements(true);
            console.log(this.pageCount, this.data.tempModel.length)
        }

        this.createNameRef.current.inputRef.current.value = ""
        this.createAbrvRef.current.inputRef.current.value = ""
        this.resetFormData()
        this.isCreateOpen = false

        if(this.paginateRef.current) this.paginateRef.current.state.selected = 0;
    }

    onCancelCreate = () => {
        this.resetFormData()
        this.isCreateOpen = false
        if(this.props.isModelPage) this.createDropRef.current.clearValue()
 
        this.createNameRef.current.inputRef.current.value = ""
        this.createAbrvRef.current.inputRef.current.value = ""
    }

    render() {
        const getClassNamesFor = (name) => {
            if (!this.data.vehicleStore.sortConfig) {
              return;
            }
            return this.data.vehicleStore.sortConfig.key === name ? this.data.vehicleStore.sortConfig.direction : undefined;
        };
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

        const brandOptions = _.map(this.tempMakeData, (make, index) => ({
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

        let dropdown;
        if(!this.props.isMakePage){
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
                            options={brandOptions} 
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

        let listItems = "";
        if(this.props.isMakePage){
            this.setColumnCount(3)
            listItems = [
                <Grid.Row key="header">
                    <Grid.Column>
                        Name
                    </Grid.Column>
                    <Grid.Column>
                        Name Abbreviation
                    </Grid.Column>
                    <Grid.Column>
                        <Icon 
                            name='edit outline'
                            size='large'
                        />
                    </Grid.Column>
                </Grid.Row>,
                this.tempLoadData.map((make, index) =>
                    <Grid.Row key={make.id}>
                        <Grid.Column>
                            <Input 
                                ref={this.setNameRef}
                                defaultValue={make.name}
                                readOnly={this.isReadOnly.data.find(data => data.id === make.id).state}
                                className={this.isReadOnly.data.find(data => data.id === make.id).state ? "grid-input make_name readOnly" : "grid-input make_name"}
                                onChange={(e, data) => {
                                    this.formData.make_name = data.value
                                }}
                            />
                        </Grid.Column>
                        <Grid.Column>
                            <Input 
                                ref={this.setAbrvRef}
                                defaultValue={make.abrv}
                                readOnly={this.isReadOnly.data.find(data => data.id === make.id).state}
                                className={this.isReadOnly.data.find(data => data.id === make.id).state ? "grid-input make_abrv readOnly" : "grid-input make_abrv"}
                                onChange={(e, data) => {
                                    this.formData.make_abrv = data.value
                                }}
                            />
                        </Grid.Column>
                        {!this.isReadOnly.data.find(data => data.id === make.id).state ? 
                            <Grid.Column>
                                <Button
                                    onClick={() => this.editData(make.id)}
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
                            <Grid.Column>
                                <Button
                                    onClick={() => this.onEditClick(make.id)}
                                >
                                    Edit
                                </Button>
                            </Grid.Column>
                        }
                            
                        
                    </Grid.Row>
                )           
            ]
        }else if(this.props.isModelPage){
            this.setColumnCount(4)
            listItems = [
                <Grid.Row key="header">
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
                    <Grid.Column>
                        <Icon 
                            name='edit outline'
                            size='large'
                        />
                    </Grid.Column>
                </Grid.Row>,
                this.tempLoadData.map((vehicle, index) =>
                    <Grid.Row key={vehicle.id}>
                        <Grid.Column>
                            <Dropdown 
                                className="dropdown"
                                placeholder='Select Brand' 
                                selection 
                                ref={this.setRef}
                                options={brandOptions} 
                                defaultValue={vehicle.makeId}
                                disabled={this.isReadOnly.data.find(data => data.id === vehicle.id).state}
                                className={this.isReadOnly.data.find(data => data.id === vehicle.id).state ? "grid-input make_name readOnly" : "grid-input make_name"}
                                onChange={(e, data) => {
                                    this.formData.make_id = data.value
                                    console.log(this.formData)
                                }}
                            />
                        </Grid.Column>
                        <Grid.Column>
                            <Input 
                                ref={this.setNameRef}
                                defaultValue={vehicle.name}
                                readOnly={this.isReadOnly.data.find(data => data.id === vehicle.id).state}
                                className={this.isReadOnly.data.find(data => data.id === vehicle.id).state ? "grid-input model_name readOnly" : "grid-input model_name"}
                                onChange={(e, data) => {
                                    this.formData.model_name = data.value
                                }}
                            />
                        </Grid.Column>
                        <Grid.Column>
                            <Input 
                                ref={this.setAbrvRef}
                                defaultValue={vehicle.abrv}
                                readOnly={this.isReadOnly.data.find(data => data.id === vehicle.id).state}
                                className={this.isReadOnly.data.find(data => data.id === vehicle.id).state ? "grid-input model_name readOnly" : "grid-input model_name"}
                                onChange={(e, data) => {
                                    this.formData.model_abrv = data.value
                                }}
                            />
                        </Grid.Column>
                        {!this.isReadOnly.data.find(data => data.id === vehicle.id).state ? 
                            <Grid.Column>
                                <Button
                                    onClick={() => this.editData(vehicle.id)}
                                >
                                    Confirm
                                </Button>
                                <Button
                                    color="google plus"
                                    onClick={() => this.onCancelClick(index, vehicle.makeId)}
                                >
                                    X
                                </Button>
                            </Grid.Column>
                            : 
                            <Grid.Column>
                                <Button
                                    onClick={() => this.onEditClick(vehicle.id)}
                                >
                                    Edit
                                </Button>
                            </Grid.Column>
                        }
                    </Grid.Row>
                )
            ]
        }else{
            this.setColumnCount(4)
            listItems = [
                <Grid.Row key="header">
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
                ,
                this.tempLoadData.map((vehicle) =>
                    <Grid.Row key={vehicle.id}>
                        <Grid.Column>
                            {this.tempMakeData.find(make => make.id === vehicle.makeId).name}
                        </Grid.Column>
                        <Grid.Column>
                            {this.tempMakeData.find(make => make.id === vehicle.makeId).abrv}
                        </Grid.Column>
                        <Grid.Column>
                            {vehicle.name}
                        </Grid.Column>
                        <Grid.Column>
                            {vehicle.abrv}
                        </Grid.Column>
                    </Grid.Row>
                )
            ]
        }

        let reactPaginate;
        if(this.data.dataCount > per_page && this.data.tempModel.length > per_page){
            reactPaginate = 
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
        }else{
            reactPaginate = "";
        }

        let createElement;
        if(this.props.isMakePage){
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
                        columns={this.columnCount} 
                        verticalAlign="middle"
                        textAlign="center"    
                    >
                        <Grid.Row key="createRow">
                            <Grid.Column>
                                <Input 
                                    ref={this.createNameRef}
                                    placeholder='Brand Name'
                                    className="grid-input model_name"
                                    onChange={(e, data) => {
                                        this.formData.make_name = data.value
                                    }}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <Input 
                                    ref={this.createAbrvRef}
                                    placeholder='Brand Abbreviation'
                                    className="grid-input model_name"
                                    onChange={(e, data) => {
                                        this.formData.make_abrv = data.value
                                    }}
                                />
                            </Grid.Column>
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
        }else if(this.props.isModelPage){
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
                        celled='internally' 
                        columns={this.columnCount} 
                        verticalAlign="middle"
                        textAlign="center"    
                    >
                        <Grid.Row key="createRow">
                            <Grid.Column>
                                <Dropdown 
                                    className="dropdown"
                                    placeholder='Select Brand' 
                                    selection 
                                    ref={this.createDropRef}
                                    options={brandOptions} 
                                    className="grid-input make_name"
                                    onChange={(e, data) => {
                                        this.formData.make_id = data.value
                                        console.log(this.formData)
                                    }}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <Input 
                                    ref={this.createNameRef}
                                    placeholder='Model Name'
                                    className="grid-input model_name"
                                    onChange={(e, data) => {
                                        this.formData.model_name = data.value
                                    }}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <Input 
                                    ref={this.createAbrvRef}
                                    placeholder='Model Abbreviation'
                                    className="grid-input model_name"
                                    onChange={(e, data) => {
                                        this.formData.model_abrv = data.value
                                    }}
                                />
                            </Grid.Column>
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
                    {listItems}
                    {reactPaginate}
                    {createElement}
                </Grid>
            </div>
            
        );
    }
}

export default inject("vehicleStore")(observer(MainList));
