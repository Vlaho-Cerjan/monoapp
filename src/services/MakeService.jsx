class MakeService{
    getAllMakes = (store) => {
        return store.makes
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
        return items
    }

    remove = (store, id) => {
        store.removeMake(id)

        return this.getMakeList(store)
    }

    edit = (store, id, formData) => {
        store.makes.find(make => make.id === id).edit(formData.makeName, formData.makeAbrv)

        return this.getMakeList(store)
    }

    add = (store, formData) => {
        const new_id = store.addMake(formData.makeName, formData.makeAbrv)

        return [this.getMakeList(store), new_id]
    }
}

const makeService = new MakeService();
export default makeService