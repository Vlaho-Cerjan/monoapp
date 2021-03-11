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

const per_page = 10;

class TestList extends React.Component {
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
        make_name: "",
        make_abrv: "",
        model_name: "",
        model_abrv: ""
    }


    constructor(data) {
        super(data);

        this.dropdownRef = React.createRef();
        this.paginateRef = React.createRef();

        makeObservable(this, {
            data: observable,
            tempModelData: observable,
            tempMakeData: observable,
            tempLoadData: observable,
            pageCount: observable,
            columnCount: observable,
            isReadOnly: observable,
            formData: observable,
            loadElements: action,
            handlePageClick: action,
            filterBrand: action,
            clearFilter: action,
            setColumnCount: action,
            requestSort: action,
            onInputChange: action,
            onEditClick: action,
            resetFormData: action,
            onCancelClick: action,
            editData: action,
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
            this.pageCount = this.data.tempModel.length/per_page;
            this.handlePageClick(pageClick);
            this.data.vehicleStore.sortItems(this.data.tempModel);
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
        this.loadElements();
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

    onInputChange = (e, data) => {
        console.log(e, data, this.formData)
    }

    resetFormData = () => {
        this.formData = {
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

    onCancelClick = () => {
        this.isReadOnly.data.map((data) => data.state = true)
        this.resetFormData()
    }

    editData = (id) => {
        this.data.vehicleStore.makes.find(m => m.id === id).edit(this.formData.make_name, this.formData.make_abrv)
        this.isReadOnly.data.map((data) => data.state = true)
        this.resetFormData()
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
                this.tempLoadData.map((make) =>
                    <Grid.Row key={make.id}>
                        <Grid.Column>
                            <Input 
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
                                    onClick={() => this.onCancelClick()}
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
                this.tempLoadData.map((vehicle) =>
                    <Grid.Row key={vehicle.id}>
                        <Grid.Column>
                        {this.tempMakeData.find(make => make.id === vehicle.makeId).name}
                        </Grid.Column>
                        <Grid.Column>
                            {vehicle.name}
                        </Grid.Column>
                        <Grid.Column>
                            {vehicle.abrv}
                        </Grid.Column>
                        <Grid.Column>
                            <Button>
                                Edit
                            </Button>
                        </Grid.Column>
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
                </Grid>
            </div>
            
        );
    }
}

export default inject("vehicleStore")(observer(TestList));
