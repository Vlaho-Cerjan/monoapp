import { inject, observer } from 'mobx-react'
import React from 'react'

import MainList from '../components/MainList'

import makeService from '../services/MakeService'

import modelService from '../services/ModelService'

class HomePage extends React.Component {
    render() {
        const items = [ 
            {key: "makeName", title: "Name", type: 'input'},
            {key: "makeAbrv", title: "Abbreviation", type: 'input'},
            {key: "modelName", title: "Model Name", type: 'input'},
            {key: "modelAbrv", title: "Model Abbreviation", type: 'input'}
        ]

        const brandOptions = makeService.getAllMakes(this.props.vehicleStore).filter(make => modelService.getAllModels(this.props.vehicleStore).filter(model => model.makeId === make.id).length > 0).map((make) => {
            return {    
                key: make.id,
                text: make.name,
                value: make.id      
            }
        })
        
        return (
            <div>
                <MainList
                    store={this.props.vehicleStore}
                    listData={modelService.getListItems(this.props.vehicleStore)}
                    listItems={items}
                    brandList={brandOptions}
                    columnCount={4}
                />
            </div>
        )
    }
}
  
export default inject("vehicleStore")(observer(HomePage)); 