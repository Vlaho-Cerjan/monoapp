import { inject, observer } from 'mobx-react'
import React from 'react'

import MainList from '../components/MainList'

import makeService from '../services/MakeService'

import modelService from '../services/ModelService'

class HomePage extends React.Component {
    render() {
        const items = [ "Name", "Abbreviation", "Model Name", "Model Abbreviation"]
        const itemKeys = ["makeName", "makeAbrv", "modelName", "modelAbrv"]

        const brandOptions = []
        const abrvOptions = []

        makeService.getAllMakes(this.props.vehicleStore).filter(make => modelService.getAllModels(this.props.vehicleStore).filter(model => model.makeId === make.id).length > 0).map((make) => {
                brandOptions.push({
                    key: make.id,
                    text: make.name,
                    value: make.id
                    }
                )
                abrvOptions.push({
                    key: make.id,
                    text: make.abrv,
                    value: make.id
                    }
                )
            }
        )
        
        return (
            <div>
                <MainList
                    store={this.props.vehicleStore}
                    listData={modelService.getListItems(this.props.vehicleStore)}
                    listItems={items}
                    listKeys={itemKeys}
                    brandList={brandOptions}
                    abrvOptions={abrvOptions}
                    columnCount={4}
                />
            </div>
        )
    }
}
  
export default inject("vehicleStore")(observer(HomePage)); 