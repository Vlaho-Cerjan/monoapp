import React from 'react'

import { inject, observer } from 'mobx-react'

import MainList from '../components/MainList'

import modelService from '../services/ModelService'
import makeService from '../services/MakeService'

import { withAlert } from 'react-alert'

class VehicleModel extends React.Component {
  render(){
    const items = [ "Name", "Abbreviation", "Model Name", "Model Abbreviation", "edit", "delete"]
    const itemKeys = ["makeName", "makeAbrv", "modelName", "modelAbrv", "edit", "delete"]


    const brandOptions = makeService.getAllMakes(this.props.vehicleStore).map((make) => ({
          key: make.id,
          text: make.name,
          value: make.id,
      })
    )

    const abrvOptions = makeService.getAllMakes(this.props.vehicleStore).map((make) => ({
      key: make.id,
      text: make.abrv,
      value: make.id
  })
  )

    return (
      <div>
        <MainList 
          service={modelService}
          listData={modelService.getListItems(this.props.vehicleStore)}
          listItems={items}
          listKeys={itemKeys}
          brandList={brandOptions}
          abrvOptions={abrvOptions}
          columnCount={6}
          createColumnCount={4}
          store={this.props.vehicleStore}
          alert={this.props.alert}
        />
      </div>
    )
  }
}
  
export default inject("vehicleStore")(withAlert()(observer(VehicleModel))); 