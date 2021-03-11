export function loadElements(bool = false) {
    if(bool){
        this.tempModelData = this.data.tempModel.slice(this.data.vehicleStore.offset, this.data.vehicleStore.offset + per_page)
    }else{
        this.tempModelData = this.data.vehicleStore.models.slice(this.data.vehicleStore.offset, this.data.vehicleStore.offset + per_page)
    }
}

export function handlePageClick(data) {
    let selected = data.selected;
    this.data.vehicleStore.setOffset(Math.ceil(selected * per_page));

    if(this.data.vehicleStore.filter === ""){
        this.loadElements();
    }else{
        this.loadElements(true);
    }
}

export function filterBrand(e, data) {
    if(data.value !== ""){
        this.data.vehicleStore.setFilter(data.value);
        this.data.vehicleStore.setMake(data.value)
        this.data.tempModel = this.data.vehicleStore.filteredVehicles();
        let pageClick = [];
        pageClick.selected = 0;
        this.pageCount = this.data.tempModel.length/per_page;
        this.handlePageClick(pageClick);
        this.data.vehicleStore.sortItems(this.data.tempModel);
        this.paginateRef.current.state.selected = 0;
    }
}

export function clearFilter() {
    this.data.vehicleStore.setFilter(0);
    this.dropdownRef.current.clearValue();
    this.pageCount = this.data.vehicleStore.models.length/per_page;
    this.loadElements();
}

export function requestSort(key) {
    let direction = 'ascending';
    if (this.data.vehicleStore.sortConfig && this.data.vehicleStore.sortConfig.key === key && this.data.vehicleStore.sortConfig.direction === 'ascending') {
     direction = 'descending';
    }
    this.data.vehicleStore.sortConfig.edit(key, direction)
    this.data.tempModel = this.data.vehicleStore.sortItems(this.data.tempModel)
    this.loadElements(true);
}