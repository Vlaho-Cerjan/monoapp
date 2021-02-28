import { observable } from "mobx"

export const VehicleMake = observable([
    {id: 1, name: "BMW", abrv: "BMW", active:1},
    {id: 2, name: "Ford", abrv: "Ford", active:1},
    {id: 3, name: "Volkswagen", abrv: "VW", active:1}
])

export const VehicleModel = observable([
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
])