class ModelService {

    getAllModels = (store) => {
        return store.models
    }

    getListItems = (store) => {
        const items = []
        store.models.map((model) => {
            items.push({
                    id : model.id,
                    makeId : model.makeId,
                    makeName : store.makes.find(make => make.id === model.makeId).name,
                    makeAbrv : store.makes.find(make => make.id === model.makeId).abrv,
                    modelName : model.name,
                    modelAbrv : model.abrv
                }
            )
        })
        return items
    }

    getFilteredModels = (models, brand) => {
        var makeList = [];
        models.map((model) => {
            if(model.makeId === brand){
                makeList.push(model)
            }
        })
        
        return makeList;
    }

    remove = (store, id) => {
        store.removeModel(id)

        return this.getListItems(store)
    }

    edit = (store, id, formData) => {
        store.models.find(make => make.id === id).edit(formData.makeId, formData.modelName, formData.modelAbrv)

        return this.getListItems(store)
    }

    add = (store, formData) => {
        
        const new_id = store.addModel(formData.makeId, formData.modelName, formData.modelAbrv)
        return [this.getListItems(store), new_id]
    }
}

const modelService = new ModelService();
export default modelService