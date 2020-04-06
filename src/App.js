import React, {Component} from 'react';
import ApiClient from './ApiClient';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      wpsus : []
    };
  }

    setBasestationPneumatics = (signal) => {
      ApiClient.post('pneumatic_ctrl', {signal}).then(() => {
        console.log("finished sending basestation signal:" + signal)
      })
    }

    renameWpsu = (wpsu) => {
      var new_name = prompt("Enter a new name for the WPSU. Leave blank to clear name. ", wpsu.name)

      if(new_name === ""){
        ApiClient.post('clear_device_label', {device_label: wpsu.name}).then(() => {
          console.log("finished clearing wpsu name")
        })
      }
      else if(new_name != null){
        ApiClient.post('label_device', {old_label: wpsu.name, device_label: new_name}).then(() => {
          console.log("finished renaming wpsu")
        })
      }

    }

    render() {
        return (
          <div>
            <table style={{border: '1px solid black', borderCollapse: 'collapse'}}>
              <tbody>
              <tr>
                <th style={{border: '1px solid black', borderCollapse: 'collapse'}}>Name</th>
                <th style={{border: '1px solid black', borderCollapse: 'collapse'}}>Pressure</th>
                <th style={{border: '1px solid black', borderCollapse: 'collapse'}}>Battery</th>
              </tr>
              {this.state.wpsus.map((wpsu) => {
                  return(<tr>
                    <td style={{border: '1px solid black', borderCollapse: 'collapse'}}>
                      {wpsu.name}
                    </td>
                    <td style={{border: '1px solid black', borderCollapse: 'collapse'}}>
                      {wpsu.pressure}
                    </td>
                    <td style={{border: '1px solid black', borderCollapse: 'collapse'}}>
                      {wpsu.battery ? wpsu.battery.value : null}% {wpsu.battery && wpsu.battery.charging==="1" ? "Charging" : null}
                    </td>
                    <td>
                      <button onClick={() => {this.renameWpsu(wpsu)}}>Rename</button>
                    </td>
                  </tr>)
              })}
              </tbody>
            </table>
            <div>
              Main:
              <button onClick={(event) => {this.setBasestationPneumatics('hold_main')}}>Hold</button>
              <button onClick={(event) => {this.setBasestationPneumatics('charge_main')}}>Charge</button>
              <button onClick={(event) => {this.setBasestationPneumatics('drain_main')}}>Drain</button>
            </div>
            <div>
              Brake:
              <button onClick={(event) => {this.setBasestationPneumatics('hold_brake')}}>Hold</button>
              <button onClick={(event) => {this.setBasestationPneumatics('charge_brake_256')}}>Charge</button>
              <button onClick={(event) => {this.setBasestationPneumatics('drain_brake_500')}}>Drain</button>
              <button onClick={(event) => {this.setBasestationPneumatics('emerg_drain_brake')}}>Emergency</button>
            </div>
          </div>
        )
    }

    getWpsuInfo = () => {
      ApiClient.get('get_readings').then((pressures) =>{
        ApiClient.get('battery').then((battery) =>{
          //map pressure readings to battery readings
          var wpsus = [];
          for(var wpsu_key in pressures){
            var wpsu = {"name": wpsu_key, "pressure": pressures[wpsu_key]}
            if(wpsu_key in battery){
              wpsu["battery"] = battery[wpsu_key];
            }
            wpsus.push(wpsu);
          }
          this.setState({wpsus});
          
        }).catch((err) =>{
          console.error(err);
          this.setState({wpsus: []});
        });
      }).catch((err) =>{
        console.error(err);
        this.setState({wpsus: []});
      });
    }

    componentDidMount() {
      this.timer = setInterval(()=> this.getWpsuInfo(), 200);
    }
}

export default App;