import React from 'react'

import { inject, observer } from 'mobx-react'

import MainList from '../components/MainList'

import modelService from '../services/ModelService'
import makeService from '../services/MakeService'

import { withAlert } from 'react-alert'

class VehicleModel extends React.Component {
  render(){

    const items = [ 
      {key: "makeName", title: "Name", type: 'dropdown'},
      {key: "makeAbrv", title: "Abbreviation", type: 'input'},
      {key: "modelName", title: "Model Name", type: 'input'},
      {key: "modelAbrv", title: "Model Abbreviation", type: 'input'},
      {key: "edit", title: "Edit", type: 'button'},
      {key: "delete", title: "Delete", type: 'button'}
    ]

    const brandOptions = makeService.getAllMakes(this.props.vehicleStore).map((make) => {
          return {
              key: make.id,
              text: make.name,
              value: make.id
            }
      }
    )

    return (
      <div>
        <MainList 
          service={modelService}
          listData={modelService.getListItems(this.props.vehicleStore)}
          listItems={items}
          brandList={brandOptions}
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