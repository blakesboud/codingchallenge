const express = require('express');
const app = express();
const port = 3001;

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.static('public'));


// Conversion matrices
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

// Conversion functions
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
app.post('/convert', (req, res) => {
    console.log('Received request on /convert');
    console.log('Request body:', req.body);

    const { input, selectedUnit, outputUnit, operator, outputValue } = req.body;
    let result;

    // Unit categories
    const weightUnits = ["pounds", "kilograms"];
    const distanceUnits = [
        "feet", "inches", "miles", "kilometers", "meters", "centimeters"
    ];

    // Handle conversion
    if (operator === "=") {
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
        let inputInCommonUnit, outputInCommonUnit;

        if (distanceUnits.includes(selectedUnit) && distanceUnits.includes(outputUnit)) {
            inputInMeters = convertToCommonUnit(input, selectedUnit, convertAllValuesToMeters);
            outputInMeters = convertToCommonUnit(outputValueParsed, outputUnit, convertAllValuesToMeters);

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
