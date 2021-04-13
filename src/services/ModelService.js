import { getStore } from "../stores/VehicleStore";

class ModelService{
    constructor(){

        this.store = getStore();
        this.makes = [...this.store.makes]
        this.models = [...this.store.models]
    }

    getAllModels = () => {
        return this.models
    }

    getListItems = () => {
        const items = []
        this.models.map((model) => {
            items.push({
                    id : model.id,
                    makeId : model.makeId,
                    makeName : this.makes.find(make => make.id === model.makeId).name,
                    makeAbrv : this.makes.find(make => make.id === model.makeId).abrv,
                    modelName : model.name,
                    modelAbrv : model.abrv
                }
            )
        })
        return items
    }

    getFilteredList = (brand) => {
        const items = []
        this.models.map((model) => {
            if(model.makeId === brand){
            items.push({
                    id : model.id,
                    makeId : model.makeId,
                    makeName : this.makes.find(make => make.id === model.makeId).name,
                    makeAbrv : this.makes.find(make => make.id === model.makeId).abrv,
                    modelName : model.name,
                    modelAbrv : model.abrv
                });
            }
        })
        
        return items;
    }

    remove = (id) => {
        let ind = this.models.findIndex(model => model.id === id);
        this.models.splice(ind, 1);

        return this.getListItems();
    }

    edit = (id, formData) => {
        this.models.find(model => model.id === id).edit(formData.makeId, formData.modelName, formData.modelAbrv);

        return this.getListItems();
    }

    add = (formData) => {
        const new_id = Math.max(...this.models.map(model => model.id))+1
        this.models.push(
            {
                id: new_id,
                makeId: formData.makeId,
                name: formData.makeName,
                abrv: formData.makeAbrv
            }
        )

        return [this.getListItems(), new_id];
    }

}
export default new ModelService;