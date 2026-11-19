// Get all breeds: https://dog.ceo/api/breeds/list/all
// Get a randomized image of a dog from a particular breed: https://dog.ceo/api/breed/hound/images/random

// Our goal: use this API to make an application in which users can browse different types of dogs and view images of their chosen dog type.

import { useState, useEffect } from 'react';
const App = props => {
    // This data will be loaded from the API eventually
    const [ dogTypes, setDogTypes ] = useState([]);
    const [ chosenDogType, setChosenDogType ] = useState(null);
    const [ image, setImage ] = useState(null);

    // When the application first loads, need to immediately fetch a list of dog breeds from the API using React's useEffect hook. 
        // useEffect hook often used to call functions at specific times, like when the component mounts, or when the value of a particular state or prop changes.
    useEffect(()=>{
        // load the data from the API here using an HTTP request
        // The fetch function returns a promise, which represents the eventual completion of some task in the future. The program will continue running while we wait. We need to use a special coding technique to make sure code runs in the proper order while we wait.
        fetch(`https://dog.ceo/api/breeds/list/all`)
        .then(response=>{
            // This function will not be called until AFTER we have received a response to the fetch API call.
            // The response will come in a format that we cannot use until we convert it to a JavaScript object. 
            let convertedResponse = response.json();
            return convertedResponse;
        })
        .then(response=>{
            // in this function, response represents the converted object value of the HTTP request.
            console.log(response)
            // Update our state using the response
            // convert the response to an array
            setDogTypes(Object.keys(response.message));
        })
    }, 
    // array of dependencies: in this array we place state and prop variables that will trigger the above function to be called when their values change. If we leave it empty, the above function will run once when the component mounts (is created)
    [])


    return <>
        <h1>Hello React Components!</h1>
        <h2>Chosen dog type is: {chosenDogType}</h2>
        <ul>
            {/* Challenge: when clicking on a type, set the chosen type. */}
            {dogTypes.map(type=><li key={type} onClick={event=>???}>{type}</li>)}
        </ul>
    </>;
}
export default App;
