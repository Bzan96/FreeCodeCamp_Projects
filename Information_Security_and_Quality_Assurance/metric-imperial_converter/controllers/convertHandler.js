/*
*
*
*       Complete the handler logic below
*       
*       
*/

function ConvertHandler() {
  
  this.getNum = function(input) {
    let splitByRegex = input.split(/[a-z]/);
    console.log(splitByRegex[0])
    
    return splitByRegex[0] !== "" ? eval(splitByRegex[0]).toFixed(5) : 1;
  };
  
  this.getUnit = function(input) {
    let splitByRegex = input.split(/\d/);
    
    return splitByRegex[splitByRegex.length-1]
  };
  
  this.getReturnUnit = function(initUnit) {
    let splitByRegex = initUnit.split(/[a-z]/);
    
    return splitByRegex[0]
  };

  this.spellOutUnit = function(unit) {
    let splitByRegex = unit.split(/\d/);
    
    return splitByRegex[splitByRegex.length-1]
  };
  
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    
    switch(initUnit) {
      case "mi":
        return (initNum * miToKm).toFixed(5) + "km";
      case "gal":
        return (initNum * galToL).toFixed(5) + "l";
      case "lbs":
        return (initNum * lbsToKg).toFixed(5) + "kg";
      case "kg":
        return (initNum / lbsToKg).toFixed(5) + "lbs";
      case "l":
        return (initNum / galToL).toFixed(5) + "gal";
      case "km":
        return (initNum / miToKm).toFixed(5) + "mi";
    }
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    let fullInitUnit = "";
    let fullReturnUnit = "";
    
    switch(initUnit) {
      case "km":
        fullInitUnit = "kilometers";
        fullReturnUnit = "miles";
        break;
      case "l":
        fullInitUnit = "liters";
        fullReturnUnit = "gallons";
        break;
      case "kg":
        fullInitUnit = "kilograms";
        fullReturnUnit = "pounds";
        break;
      case "mi":
        fullInitUnit = "miles";
        fullReturnUnit = "kilometers";
        break;
      case "gal":
        fullInitUnit = "gallons";
        fullReturnUnit = "liters";
        break;
      case "lbs":
        fullInitUnit = "pounds";
        fullReturnUnit = "kilograms";
        break;
    }
    
    return `${initNum} ${fullInitUnit} converts to ${returnNum} ${fullReturnUnit}`;
  };
  
}

module.exports = ConvertHandler;