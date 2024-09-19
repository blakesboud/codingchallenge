const express = require('express'); //imports express module.
const app = express(); //Creates instance of express application, app to configure and run server
const port = 3001; //sets up port number for server to listen to incoming requests

app.use(express.json()); // Middleware to parse JSON bodies, to make available to req.body
app.use(express.static('public')); //serves my static html file from public directory


// Conversion matrices, these were taken from Google. 
const convertAllValuesToMeters = {
    feet: 0.3048,
    inches: 0.0254,
    miles: 1609.34,
    kilometers: 1000,
    meters: 1,
    centimeters: 0.01,
};

const convertAllValuesToKilograms = {
    pounds: 0.454,
    kilograms: 1,
};

// Conversion functions to stop from having a myriad of functions. Now it can look in the arrays and matrix depending on user input. 
function convertToCommonUnit(value, unit, conversionMatrix) {
    return value * conversionMatrix[unit];
}

function convertFromCommonUnit(value, unit, conversionMatrix) {
    return value / conversionMatrix[unit];
}

// Export the conversion functions for testing
module.exports = {
    convertToCommonUnit,
    convertFromCommonUnit,
};

// Conversion endpoint
app.post('/convert', (req, res) => { //sets up route to handle POST, doing my conversion
    console.log('Received request on /convert');
    console.log('Request body:', req.body);

    const { input, selectedUnit, outputUnit, operator, outputValue } = req.body; //i want to get these specific properties from the request body
    let result;

    // Unit categories, mostly checking if they are in own types of measurement
    const weightUnits = ["pounds", "kilograms"];
    const distanceUnits = [
        "feet", "inches", "miles", "kilometers", "meters", "centimeters"
    ];

    //if the operator is picked as an equal
    if (operator === "=") {
        //using the arrays above to not allow weight to be converted to distance
        if (distanceUnits.includes(selectedUnit) && distanceUnits.includes(outputUnit)) {
            const inputInMeters = convertToCommonUnit(input, selectedUnit, convertAllValuesToMeters);
            result = convertFromCommonUnit(inputInMeters, outputUnit, convertAllValuesToMeters);
        } else if (weightUnits.includes(selectedUnit) && weightUnits.includes(outputUnit)) {
            const inputInKilograms = convertToCommonUnit(input, selectedUnit, convertAllValuesToKilograms);
            result = convertFromCommonUnit(inputInKilograms, outputUnit, convertAllValuesToKilograms);
        } else {
            res.json({ error: "Invalid Conversion" });
            return;
        }
        res.json({ result: `Result in ${outputUnit}: ${result}` }); //becomes data object in server.js
    } 
    
    if (operator != '=') {
        const outputValueParsed = parseFloat(outputValue);

        if (distanceUnits.includes(selectedUnit) && distanceUnits.includes(outputUnit)) {
            //converts input unit with selected unit to meters, so 2 miles in kilometers
            inputInMeters = convertToCommonUnit(input, selectedUnit, convertAllValuesToMeters);
            //converts output unit to same
            outputInMeters = convertToCommonUnit(outputValueParsed, outputUnit, convertAllValuesToMeters);

            //now that units are common measurement, perform arithmetic
            switch (operator) {
                case "+":
                    resultInMeters = inputInMeters + outputInMeters;
                    break;
                case "-":
                    resultInMeters = inputInMeters - outputInMeters;
                    break;
                case "*":
                    resultInMeters = inputInMeters * outputInMeters;
                    break;
                case "/":
                    resultInMeters = inputInMeters / outputInMeters;
                    break;
                default:
                    res.json({ error: "Invalid Operator" });
                    return;
            }

            //we want to display both units, so if you originally had 2 kilometers, need to divide by the conversion to meters to get result in kilometers
            let resultInSelectedUnit = convertFromCommonUnit(resultInMeters, selectedUnit, convertAllValuesToMeters);
            let resultInOutputUnit = convertFromCommonUnit(resultInMeters, outputUnit, convertAllValuesToMeters);

            res.json({ result: `Result in ${selectedUnit}: ${resultInSelectedUnit}, Result in ${outputUnit}: ${resultInOutputUnit}` });
        } else if (weightUnits.includes(selectedUnit) && weightUnits.includes(outputUnit)) {
            inputInKilograms = convertToCommonUnit(input, selectedUnit, convertAllValuesToKilograms);
            outputInKilograms = convertToCommonUnit(outputValueParsed, outputUnit, convertAllValuesToKilograms);

            let resultInKilograms;

            switch (operator) {
                case "+":
                    resultInKilograms = inputInKilograms + outputInKilograms;
                    break;
                case "-":
                    resultInKilograms = inputInKilograms - outputInKilograms;
                    break;
                case "*":
                    resultInKilograms = inputInKilograms * outputInKilograms;
                    break;
                case "/":
                    resultInKilograms = inputInKilograms / outputInKilograms;
                    break;
                default:
                    res.json({ error: "Invalid Operator" });
                    return;
            }

            let resultInSelectedUnit = convertFromCommonUnit(resultInKilograms, selectedUnit, convertAllValuesToKilograms);
            let resultInOutputUnit = convertFromCommonUnit(resultInKilograms, outputUnit, convertAllValuesToKilograms);

            res.json({ result: `Result in ${selectedUnit}: ${resultInSelectedUnit}, Result in ${outputUnit}: ${resultInOutputUnit}` });
        } else {
            res.json({ error: "Invalid Conversion" });
        }
    }
});

app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}...`);
});
