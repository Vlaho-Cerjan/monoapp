import { useMemo } from 'react'
import { getRoot, types, applySnapshot, getSnapshot  } from 'mobx-state-tree'

let store
let per_page = 10

const VehicleMake = types
    .model({
        id: types.identifierNumber,
        name: types.string,
        abrv: types.string
    })
    .actions((self) => ({
        remove() {
            getRoot(self).removeMake(self)
        },
        edit(name, abrv) {
            if (!name.length && !abrv.length) console.log("No Data")
            else {
                if(name.length) self.name = name
                if(abrv.length) self.abrv = abrv
            }
        }
    }))

const VehicleModel = types
    .model({
        id: types.identifierNumber,
        makeId: types.number,
        name: types.string,
        abrv: types.string
    })
    .actions((self) => ({
        remove() {
            getRoot(self).removeModel(self)
        },
        edit(makeId, name, abrv) {
            if (!name.length && !abrv.length && !makeId) console.log("No Data")
            else {
                if(makeId) self.makeId = makeId
                if(name.length) self.name = name
                if(abrv.length) self.abrv = abrv
            }
        }
    }))

const sortConfig = types
    .model({
        key: types.string,
        direction: types.string
    }).actions((self) => ({
        edit(key, dir){
            self.key = key
            self.direction = dir
        }
    }))

const VehicleStore = types
    .model({
        makes: types.array(VehicleMake),
        models: types.array(VehicleModel),
        make: types.reference(VehicleMake),
        model: types.reference(VehicleModel),
        filter: types.string,
        offset: types.integer,
        sortConfig: types.optional(sortConfig, {key: "make_name",direction: "ascending"})
    })
    .views((self) => ({
        filteredVehicles() {
            if(self.make && self.filter !== "") return self.models.filter(model => model.makeId === self.make.id)
            else return self.models
        },
        sortItems(data) {
            let sortableItems = [];
            let tempMake = [...self.makes]
            if(self.filter === "") sortableItems = [...self.models]
            else sortableItems = data
            if (self.sortConfig !== null) {
                let key = self.sortConfig.key;
                let dir = self.sortConfig.direction;
                if(self.sortConfig.key === "make_name" || self.sortConfig.key === "make_abrv"){
                    let sortedItems = [];
                    key = key.substring(key.length - 4);
                    tempMake.sort((a, b) => {
                        if (a[key] < b[key]) {
                        return dir === 'ascending' ? -1 : 1;
                        }
                        if (a[key] > b[key]) {
                        return dir === 'ascending' ? 1 : -1;
                        }
                        return 0;
                    });
    
                    for(let i=0; i < tempMake.length; i++ ){
                        sortableItems.map((vehicle) => {
                            if(vehicle.makeId === tempMake[i].id){
                                sortedItems.push(vehicle);
                            }
                            return 0;
                        })
                    }
    
                    sortableItems = sortedItems;
                }else{
                    key = key.substring(key.length - 4);
                    sortableItems.sort((a, b) => {
                        if (a[key] < b[key]) {
                        return dir === 'ascending' ? -1 : 1;
                        }
                        if (a[key] > b[key]) {
                        return dir === 'ascending' ? 1 : -1;
                        }
                        return 0;
                    });
                }
            }

            return sortableItems
        },
        sortMakes() {
            let sortableItems = [];
            let tempMake = [...self.makes]
            if (self.sortConfig !== null) {
                let key = self.sortConfig.key;
                let dir = self.sortConfig.direction;
                key = key.substring(key.length - 4);
                tempMake.sort((a, b) => {
                    if (a[key] < b[key]) {
                    return dir === 'ascending' ? -1 : 1;
                    }
                    if (a[key] > b[key]) {
                    return dir === 'ascending' ? 1 : -1;
                    }
                    return 0;
                });

                sortableItems = tempMake
            }

            return sortableItems
        }
    }))
    .actions((self) => ({
        addMake(name, abrv) {
            if(!self.makes.find(m => m.name === name) && name.length && abrv.length ){
                const id = self.makes.reduce((maxId, make) => Math.max(make.id, maxId), -1) + 1
                self.makes.unshift({ id, name, abrv })
                return id
            }else{
                console.log('Duplicate Data')
            } 
        },
        removeMake(make) {
            destroy(make)
        },
        addModel(makeId, name, abrv) {
            const id = self.models.reduce((maxId, model) => Math.max(model.id, maxId), -1) + 1
            self.models.unshift({ id, makeId, name, abrv })
        },
        removeModel(model) {
            destroy(model)
        },
        setMake(id){
            self.make = self.makes.find(make => make.id === id)
        },
        setFilter(id){
            if (id===0) self.filter = ""
            else self.filter = self.makes.find(make => make.id === id).name
        },
        setOffset(offset){
            self.offset = offset
        } 
    }))

    export function initializeStore(snapshot = null) {
        const _store = store ?? VehicleStore.create({
            makes: [
                {id: 1, name: "BMW", abrv: "BMW", active:1},
                {id: 2, name: "Ford", abrv: "Ford", active:1},
                {id: 3, name: "Volkswagen", abrv: "VW", active:1}
            ],
            models: [
                {id: 1, makeId: 1, name: "1 Series", abrv: "1", active:1},
                {id: 2, makeId: 1, name: "2 Series", abrv: "2", active:1},
                {id: 3, makeId: 1, name: "3 Series", abrv: "3", active:1},
                {id: 4, makeId: 1, name: "4 Series", abrv: "4", active:1},
                {id: 5, makeId: 1, name: "5 Series", abrv: "5", active:1},
                {id: 6, makeId: 1, name: "7 Series", abrv: "7", active:1},
                {id: 7, makeId: 1, name: "8 Series", abrv: "8", active:1},
                {id: 8, makeId: 1, name: "Z4", abrv: "", active:1},
                {id: 9, makeId: 1, name: "X", abrv: "", active:1},
                {id: 10, makeId: 1, name: "M", abrv: "", active:1},
                {id: 11, makeId: 2, name: "ECOSPORT", abrv: "", active:1},
                {id: 12, makeId: 2, name: "ESCAPE", abrv: "", active:1},
                {id: 13, makeId: 2, name: "BRONCO SPORT", abrv: "", active:1},
                {id: 14, makeId: 2, name: "ECOSPORT", abrv: "", active:1},
                {id: 15, makeId: 2, name: "EDGE", abrv: "", active:1},
                {id: 16, makeId: 2, name: "EXPLORER", abrv: "", active:1},
                {id: 17, makeId: 2, name: "EXPEDITION", abrv: "", active:1},
                {id: 18, makeId: 2, name: "RANGER", abrv: "", active:1},
                {id: 19, makeId: 2, name: "MUSTANG", abrv: "", active:1},
                {id: 20, makeId: 2, name: "FUSION", abrv: "", active:1},
                {id: 21, makeId: 3, name: "ID.4", abrv: "", active:1},
                {id: 22, makeId: 3, name: "ATLAS", abrv: "", active:1},
                {id: 23, makeId: 3, name: "TIGUAN", abrv: "", active:1},
                {id: 24, makeId: 3, name: "JETTA", abrv: "", active:1},
                {id: 25, makeId: 3, name: "PASSAT", abrv: "", active:1},
                {id: 26, makeId: 3, name: "ARTEON", abrv: "", active:1},
                {id: 27, makeId: 3, name: "GOLF", abrv: "", active:1},
                {id: 28, makeId: 3, name: "TAOS", abrv: "", active:1},
                {id: 29, makeId: 3, name: "GOLF GTI", abrv: "GTI", active:1},
                {id: 30, makeId: 3, name: "JETTA GLI", abrv: "GLI", active:1},
                {id: 31, makeId: 3, name: "PASSAT R-LINE", abrv: "R", active:1},
            ],
            make: 1,
            model: 1,
            filter: "",
            offset: 0,
            sortConfig: {
                key: "make_name",
                direction: "ascending"
            }
        })
      
        if (snapshot) {
          applySnapshot(_store, snapshot)
        }


        if (typeof window === 'undefined') return _store

        if (!store) store = _store
      
        return store
      }
      
      export function useStore(initialState) {
        const store = useMemo(() => initializeStore(initialState), [initialState])
        return store
      }