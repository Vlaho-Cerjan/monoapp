class ListService {
    constructor(){

        this.sortConfig = {
            key : "",
            direction : ""
        };
    }

    getSortConfig = () => {
        return this.sortConfig;
    }

    setSortConfig = (key, direction = null) => {
        this.sortConfig.key = key;
        if(direction !== null) this.sortConfig.direction = direction;

        return this.sortConfig;
    }

    getClassNamesFor = (name) => {
        return this.sortConfig.key === name ? this.sortConfig.direction : null;
    };

    sortItems = (list) => {
        let sortableItems = [...list];
        if (this.sortConfig.key !== "") {
            let key = this.sortConfig.key;
            let dir = this.sortConfig.direction;

            sortableItems.sort((a, b) => {
                if (a[key].toLowerCase() < b[key].toLowerCase()) {
                return dir === 'ascending' ? -1 : 1;
                }
                if (a[key].toLowerCase() > b[key].toLowerCase()) {
                return dir === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        return sortableItems;
    }
}

const listService = new ListService();
export default listService