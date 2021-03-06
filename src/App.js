import { VehicleMake, VehicleModel } from './common/VehicleStore';

import MainLayout from './layouts/MainLayout';
import ListItems from './components/ListItems';

import './App.css';

function App() {
  return (
    <div className="App">
      <MainLayout>
        <ListItems 
          vehicleMake={VehicleMake} 
          vehicleModel={VehicleModel} 
        />
      </MainLayout>
    </div>
  );
}

export default App;
