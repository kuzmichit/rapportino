import {isValid} from './support.js';

export function btnRegisterFormHandler(currentDate, evt) {
  const workForm = evt.target.form,
        building = workForm.building.value,
        description = workForm.description.value,
        userData = JSON.parse(localStorage.getItem('userData') ),        
        workedHour = workForm.querySelector('.item_checked');

if(!workedHour) {alert('Scegli le ore effettuate'); return};
if(!isValid(building)) {alert('Inserire il nome di cantiere valido'); return}
if(!isValid(description, /(\w|\s){10,}/)) {alert('Inserire il lavoro svolto valido'); return}
      
const dataForSaveInDatabase = new CreateObjectForDatabase(currentDate, building, description, workedHour.textContent);
  
//  putScheduleInDatabase(userData, dataForSaveInDatabase);
 saveDataInLocalStorage(dataForSaveInDatabase, currentDate);
}

function CreateObjectForDatabase(currentDate, building, description, workedHour) {
  this[`${currentDate}`] =
      {
        building,
        description,
        workedHour
      };
}

function authWithEmailAndPassword(userData) {
  const apiKey = 'AIzaSyDMLR1XYP9NpvZbXZbBxBLEWB1Ssx528ms'
  ;

  return fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
    method: 'POST',
    body: JSON.stringify( {
      email:userData.email,
      password: userData.password,
      returnSecureToken: true
    } ) ,
    headers: {
      'Content-Type': 'application/json'
    }
  } )
    .then(response => response.json() )
    .then(data => data.idToken);

}

const putScheduleInDatabase = (userData, dataForSaveInDatabase) => {
   authWithEmailAndPassword(userData)
     .then(idToken => {

      //if (!idToken) { return console.log(Error.message); }
      
      fetch(`https://la-sceda-di-lavoro-default-rtdb.firebaseio.com/rapportinoBorys.json?auth=${idToken}`,
        {
          method: 'PATCH',
          body: JSON.stringify(dataForSaveInDatabase),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      //.catch(error => console.log(error))


    } )
    .then(response => response);
  // .catch(error => console.log(error.message));
};

function getScheduleFromDatabase(email, password) {

  authWithEmailAndPassword('zucca@gmail.com', 123456)
    .then(idToken => fetch(`https://la-sceda-di-lavoro-default-rtdb.firebaseio.com/test.json?auth=${idToken}`) )
    .then(response => response.json() )
    .then(console.log);
}

function saveDataInLocalStorage(data, currentDate) {

  let rapportino = localStorage.getItem('rapportino');

  if (rapportino === null) localStorage.setItem('rapportino', '{}');
  rapportino = JSON.parse(localStorage.getItem('rapportino') );
  rapportino[currentDate] = data;
  localStorage.setItem('rapportino', JSON.stringify(rapportino) );
	 } 

function getRapportinoFromLocal() {
  if(!localStorage.getItem('rapportino')) localStorage.setItem('rapportino', '{}');
  return localStorage.getItem('rapportino');
}

