class MakeService{
    getAllMakes = (store) => {
        return store.makes;
    }

    getMakeList = (store) => {
        const items = []
        store.makes.map((make) => {
            items.push({
                    id: make.id,
                    makeName : make.name,
                    makeAbrv : make.abrv
                }
            )
        })
        return items;
    }

    getMakeBrandList = (store) => {
        const items = []
        store.makes.map((make) => {
            items.push({   
                key: make.id,
                text: make.name,
                value: make.id      
                }
            )
        })
        return items;
    }

    getMakeName = (store, id) => {
        return store.makes.find(make => make.id === id).name
    }

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

    remove = (store, id) => {
        store.removeMake(id);

        return this.getMakeList(store);
    }

    edit = (store, id, formData) => {
        store.makes.find(make => make.id === id).edit(formData.makeName, formData.makeAbrv);

        return this.getMakeList(store);
    }

    add = (store, formData) => {
        const new_id = store.addMake(formData.makeName, formData.makeAbrv);

        return [this.getMakeList(store), new_id];
    }
}

const makeService = new MakeService();
export default makeService