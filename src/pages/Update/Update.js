import React, { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import "./style.css";

const Update = ({ match, history }) => {
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [userAge, setUserAge] = useState('');
    const [userGender, setUserGender] = useState('');
    const [userPointFormatedLocation,SetUseserPointFormatedLocation] = useState('')
    const [userCurrentLongitude, setUserCurrentLongitude] = useState('');
    const [userCurrentLatitude, setUserCurrentLatitude] = useState('');
    const [userNewLongitude, setUserNewLatitude] = useState('');
    const [displayCurrentPosition, setDisplayCurrentPosition] = useState(false);
    const [userNewLocation, setUserNewLocation] = useState('');
    const inputRef = useRef(null);
    const[mouseXCoordinate,mouseYCoordinate] = useState('');



    async function handleIdSearch(e) {
        e.preventDefault()
        if (userId !== match.params.id) {
            alert("This is not your id, try again, please");
        } else {
            try {
                // colocar numa função que retorna um objeto de states
                const response = await api.get("/people/" + match.params.id + ".json")
                setUserName(response.data.name);
                setUserAge(response.data.age);
                setUserGender(response.data.gender);
                const pointFormattedLocation = response.data.lonlat;
                //POINT (65.6 65.6)
                const treeStringsArray = pointFormattedLocation.split(' ');
                const extractedLatitude = treeStringsArray[2].replace(')', ' ')
                const extractedLongitude = treeStringsArray[1].replace('(', ' ');
                console.log('Latitude: ' + extractedLatitude + 'Longitude: ' + extractedLongitude)
                setUserCurrentLongitude(extractedLongitude);
                setUserCurrentLatitude(extractedLatitude);
                setDisplayCurrentPosition(true);
            } catch (e) {
                console.log(e);
            }
        }
        inputRef.current.focus();
        setUserId('');
    }

    async function handleUpdate(e){
        e.preventDefault();
        const stringArray =userNewLocation.trim().split(',');
        setUserCurrentLongitude(stringArray[0])
        setUserCurrentLatitude(stringArray[1])
        const userNewLocationFormated = 'POINT ('+stringArray[0]+' '+stringArray[1]+')';
        const config = {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          };
          const data = new FormData();
          data.append("person[name]", userName);
          data.append("person[age]", userAge);
          data.append("person[gender]", userGender);
          data.append("person[lonlat]", userNewLocationFormated);
          try{
             const response =  await api.patch("/people/"+match.params.id+".json", data, config);
             if(response.status===200){
                 alert('You successufully updated your location');
             }
         
          }catch(e){
            console.log(e);
            alert('An Error Ocurred ! Try again, please!');
     //       history.push("/" + match.params.id + "/update")
          }

    }
    function handleMouseHover(e){
        e.preventDefault()

    }
    function handleMouseLeaving(e){
        e.preventDefault()
        
    }

    
    return (<div className="update-container">
        <form className="search-form" onSubmit={handleIdSearch}>
            <input
                type="text"
                className="search-field search-id-input"
                placeholder="Enter Your Id"
                value={userId}
                onChange={e => setUserId(e.target.value)}
                ref={inputRef}
                data-testid="searchField"
            />
            <button 
            className="search-id-button"
            data-testid="searchButton"
            ><h3>Search</h3></button>
        </form>

        <div className="update-title">
            <h1>YOU CAN SET YOUR LOCATION IN THE FORM BELOW</h1>
        </div>
        <div className="update-area">

            <div className="translucent"></div>
            <div className="update-content">
                <div className="profile-info-container">
                    <div className="profile-name-box profile-box">
                        <h2>Name:</h2>
                        <div className="profile-field">
                            <h1>{userName}</h1>
                        </div>

                    </div>
                    <div className="profile-age-box profile-box">
                        <h2>Age:</h2>
                        <div className="profile-field">
                            <h1>{userAge}</h1>
                        </div>

                    </div>
                    <div className="profile-sex-box profile-box">
                        <h2>Gender:</h2>
                        <div className="profile-field">
                            <h1>{userGender}</h1>
                        </div>
                    </div>
                    <div className="profile-location-box profile-box">
                        <h3 style={{ position: 'absolute', top: "3%",whiteSpace:'nowrap' }}>Enter your new location (longitude, latitude):</h3>
                        <div className="profile-field">
                            <form className="update-location-form">
                                <input
                                    type="text"
                                    className="update-location-input"
                                    value={userNewLocation}
                                    onChange={e => setUserNewLocation(e.target.value)}
                                    data-testid="updateLocationField"

                                />
                                <button 
                                className="update-location-button"
                                onClick={e=>{handleUpdate(e)}}
                                data-testid="updateButton"

                                ><h3>
                                    update location
                                    </h3>
                                </button>
                            </form>

                        </div>
                    </div>
                </div>
                <div className="location-map-container">
                    <h1 className="current-location-displayer"
                     data-testid="newLocationDisplay"
                    >
                        Current Position:{displayCurrentPosition ?
                            (<span> (Longitude: {userCurrentLongitude},
                          Latitude: {userCurrentLatitude})
                            </span>) : ''}
                    </h1>
                    <div className="location-map"
                        onMouseEnter={(e) => handleMouseHover(e)}
                        onMouseLeave={(e) => handleMouseLeaving(e)}
                    >
                    </div>
                </div>
            </div>
        </div>
    </div>)
}

export default Update

