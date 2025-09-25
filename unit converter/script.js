function convert() {
  let value = document.getElementById("valueInput").value;
  let type = document.getElementById("conversionType").value;
  let result = "";

  value = parseFloat(value);

  if (isNaN(value)) {
    result = "⚠️ Please enter a number!";
  } else {
    switch (type) {
      case "kg-lb":
        result = `${value} kg = ${(value * 2.20462).toFixed(2)} lb`;
        break;
      case "lb-kg":
        result = `${value} lb = ${(value / 2.20462).toFixed(2)} kg`;
        break;
      case "c-f":
        result = `${value} °C = ${(value * 9/5 + 32).toFixed(2)} °F`;
        break;
      case "f-c":
        result = `${value} °F = ${((value - 32) * 5/9).toFixed(2)} °C`;
        break;
    }
  }

  document.getElementById("result").innerText = result;
}
