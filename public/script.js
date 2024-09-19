

document.querySelector(".convert-button").addEventListener("click", function () {
  const input = parseFloat(document.querySelector(".input").value); // Selects the input value from input field
  const selectedUnit = document.querySelector(".unit-select").value; // Selects the unit selected from list
  const outputUnit = document.querySelector(".output-conversion").value; // Selects value from output field
  const operator = document.querySelector(".operator-select").value;
  const outputValue = parseFloat(document.querySelector(".output").value); // Added this

  //Sending a post request to to /convert endpoint with the input data
  fetch('http://localhost:3001/convert', {
      method: 'POST',  //data sent to server to be processed
      headers: {
          'Content-Type': 'application/json' //request is going to be in JSON 
      },
      body: JSON.stringify({ //contains data being sent, stringify converts js to json
          input,
          selectedUnit,
          outputUnit,
          operator,
          outputValue
      })
  })
  .then(response => response.json()) //then method handles response from server, response.json parses json response into js object
  .then(data => {
      if (data.error){
        document.querySelector('.result-display').textContent = data.error;
      }
      else{
        document.querySelector(".result-display").textContent = data.result; //updates the text content of the element with conversion result
      }
      
  })
  .catch(error => console.error('Error:', error));
});
