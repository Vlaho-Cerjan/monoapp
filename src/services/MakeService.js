import { getStore } from "../stores/VehicleStore";

class MakeService{
    constructor(){

        this.store = getStore();
        this.makes = [...this.store.makes];
    }

    getAllMakes = () => {
        return this.makes;
    }

    getMakeList = () => {
        const items = [];
        this.makes.map((make) => {
            items.push({
                    id: make.id,
                    makeName : make.name,
                    makeAbrv : make.abrv
                }
            )
        });
        return items;
    }

    getMakeBrandList = () => {
        const items = [];
        this.makes.map((make) => {
            items.push({   
                key: make.id,
                text: make.name,
                value: make.id      
                }
            )
        });
        return items;
    }

    getMakeBrandListWithDataOnly = (models) => {
        const items = [];
        this.makes.filter(make => models.filter(model => model.makeId === make.id).length > 0).map((make) => {
            items.push({   
                key: make.id,
                text: make.name,
                value: make.id      
                }
            )
        });
        return items;
    }

    getMakeName = (id) => {
        return this.makes.find(make => make.id === id).name;
    }

    remove = (id) => {
        let ind = this.makes.findIndex(make => make.id === id);
        this.makes.splice(ind, 1);

        return this.getMakeList();
    }

    edit = (id, formData) => {
        this.makes.find(make => make.id === id).edit(formData.makeName, formData.makeAbrv);

        return this.getMakeList();
    }

    add = (formData) => {
        const new_id = Math.max(...this.makes.map(make => make.id))+1;
        this.makes.push(
            {
                id: new_id,
                name: formData.makeName,
                abrv: formData.makeAbrv,
                active: 1
            }
        );

        return [this.getMakeList(), new_id];
    }

}
export default new MakeService;