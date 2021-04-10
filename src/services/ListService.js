class ListService {
    getClassNamesFor = (name, sortConfig) => {
        if (!sortConfig) {
          return;
        }
        return sortConfig.key === name ? sortConfig.direction : null;
    };

    sortItems = (list, storeConfig) => {
        let sortableItems = [...list];
        if (storeConfig.key !== "") {
            let key = storeConfig.key;
            let dir = storeConfig.direction;

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