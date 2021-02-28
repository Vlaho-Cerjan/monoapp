import './App.css';
import { VehicleMake, VehicleModel } from './common/VehicleStore';
import ListItems from './components/ListItems';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <div className="App">
      <MainLayout>
        <ListItems vehicleMake={VehicleMake} vehicleModel={VehicleModel} />
      </MainLayout>
    </div>
  );
}

export default App;
