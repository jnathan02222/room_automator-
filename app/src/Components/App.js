import appStyles from '../StyleSheets/App.module.css'
import React, {useState, useEffect, useRef} from 'react'
import SerialManager from './SerialManager.js'
function App() {
  const buttonNames = ["Toggle lights", "Water plant"] //Edit this to add more buttons
  
  const [connected, setConnected] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState([]);
  const [schedule, setSchedule] = useState([]);

  const buttonDisabledRef = useRef();
  const scheduleRef = useRef([]);
  const form = useRef();
  const timerList = useRef([]);

  const serialManager = useRef(new SerialManager());


  useEffect(
    () => {
      //Initialize list of button states
      updateButtonDisabled(Array(buttonNames.length).fill(true));

      //Start checking schedule
      (timerList.current).push(setTimeout(()=>{checkSchedule("00:00")}, 1000));

      //Load saved schedule
      getCookie();

      //Cleanup
      return () => {
        for(let i = 0; i < (timerList.current).length; i++){
          clearTimeout((timerList.current)[i]);
        }
      };
    }
  ,[]);
  
  async function connect(){
    const success=  await (serialManager.current).connect();
    if(success){
      setConnected(true);
      updateButtonDisabled(Array(buttonNames.length).fill(false));
    }
    //await (serialManager.current).readFrom((i) => {toggleButton(i, false)});
  }

  /*
  COOKIE FUNCTIONS
  */
  function setCookie(schedule, exdays){
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires="+d.toUTCString();
    let scheduleString = "";
    for(let i = 0; i < schedule.length; i++){
      scheduleString += schedule[i]["time"] + "-" + schedule[i]["key"] + ","
    }
    document.cookie = "schedule=" + scheduleString + ";" + expires + ";path=/";
  }

  function getCookie() {
    let decodedCookie = decodeURIComponent(document.cookie).replace("schedule=", "");
    const items = decodedCookie.split(",");
    const newSchedule = [];
    for(let i = 0; i < items.length; i++){
      if(items[i] !== ""){
        const item = items[i].split("-");
        newSchedule.push({time: item[0], key: item[1]});
      }
    }
    updateSchedule(newSchedule);
  }
  /*
  SCHEDULE FUNCTIONS
  */
  //Must use ref for current value
  function checkSchedule(previousTime) {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const time =  (hours < 10 ? "0":"") + hours + ":" + (minutes < 10 ? "0":"") + minutes;

    if(previousTime !== time){
      for(let i = 0; i < (scheduleRef.current).length; i++){
        
        if((scheduleRef.current)[i]["time"] === time){
          handleButtonClick((scheduleRef.current)[i]["key"])
        }
      }
    }
    (timerList.current).push(setTimeout(()=>{checkSchedule(time)}, 1000));
    
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const newSchedule = [...schedule];
    const time = (form.current)["time"].value;
    let index = 0;
    for(let i = 0; i < newSchedule.length; i++){
      if(time > newSchedule[i]["time"]){
        index = i + 1;
      }
    }
    newSchedule.splice(index, 0, {time: time, key: (form.current)["tasks"].selectedIndex});
    (form.current).reset();
    updateSchedule(newSchedule);
  }
  function removeTask(i){
    const newSchedule = [...schedule];
    newSchedule.splice(i, 1);

    updateSchedule(newSchedule);
  }
  function updateSchedule(newSchedule) {
    setSchedule(newSchedule);
    scheduleRef.current = newSchedule;
    setCookie(newSchedule, 365);
  }

  /*
  BUTTON FUNCTIONS
  */
  function handleButtonClick(key){
    if((buttonDisabledRef.current)[key]){
      return;
    }
    //toggleButton(key, true);

    (serialManager.current).writeTo(key.toString());
  }
  function toggleButton(key, value){
    const buttonDisabledNew = [...(buttonDisabledRef.current)];
    buttonDisabledNew[key] = value;
    updateButtonDisabled(buttonDisabledNew);
  }
  function updateButtonDisabled(newButtonDisabled){
    setButtonDisabled(newButtonDisabled);
    buttonDisabledRef.current = newButtonDisabled;
  }

  return (
    <div className={appStyles.app}>
      <div>
        <div className={appStyles.section + " " + appStyles.header}>
          <h1 className={appStyles.title}>HUB</h1>
          <div onClick={connected ? ()=>{} : connect} className={appStyles.status + " " + (connected ? appStyles.statusOK  :  appStyles.statusERROR)}>{connected ? "CONNECTED" : "DISCONNECTED"}</div>
        </div>

        <div className={appStyles.container}>
          <div className={appStyles.section}>
          {
            buttonNames.map(
              (val, i) => {
                  return <div key={i} onClick={buttonDisabled[i] ? (()=>{}) : (()=>{handleButtonClick(i)})} className={appStyles.button + " " + (buttonDisabled[i] && appStyles.disabled)}>{val}</div>
              }
            )
          }
          </div>

          <div className={appStyles.section}>
            <div>Schedule</div>
            <form ref={form} onSubmit={handleSubmit} className={appStyles.form}>
              <input type="time" name="time" id="time" required />
              <select name="tasks" id="tasks" required>
                {
                  buttonNames.map(
                    (val, i) => {
                        return <option key={i} value={val}>{val}</option>
                    }
                  )
                }
              </select>
              <input type="submit"/>
            </form>
            {
              schedule.map(
                (val, i) => {
                  return (
                    <div key={i} className={appStyles.task}>
                      <div >{val["time"] + " - " + buttonNames[val["key"]]}</div>
                      <div onClick={() => {removeTask(i)}}className={appStyles.trash}> 🗑️</div>
                    </div>
                  )
                }
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
