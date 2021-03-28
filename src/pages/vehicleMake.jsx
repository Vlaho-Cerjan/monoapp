import React from 'react'

import { inject, observer } from 'mobx-react'

import MainList from '../components/MainList'

import makeService from '../services/MakeService'

import { withAlert } from 'react-alert'

class VehicleMake extends React.Component {
  render() { 
    const items = [ "Name", "Abbreviation", "edit", "delete"]
    const itemKeys = ["makeName", "makeAbrv", "edit", "delete"]

    return (
        <div>
          <MainList 
            store={this.props.vehicleStore}
            service={makeService}
            listData={makeService.getMakeList(this.props.vehicleStore)}
            listItems={items}
            listKeys={itemKeys}
            columnCount={4}
            createColumnCount={3}
            alert={this.props.alert}
          />
        </div>
      )
    }
  }
  
  export default inject("vehicleStore")(withAlert()(observer(VehicleMake))); 