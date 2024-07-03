function getVehicleDetails(plate) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://www.carjam.co.nz/car/?plate=" + plate, true);
    xhr.setRequestHeader("accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7");
    xhr.setRequestHeader("accept-language", "en-GB,en-US;q=0.9,en;q=0.8");
    xhr.setRequestHeader("cache-control", "max-age=0");
    xhr.setRequestHeader("priority", "u=0, i");
    xhr.setRequestHeader("upgrade-insecure-requests", "1");
    xhr.withCredentials = true;
  
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(xhr.responseText, "text/html");
        scrapeVehicleDetails(doc);
      }
    };
  
    xhr.send(null);
  }
  
  function scrapeVehicleDetails(doc) {
    var vehicleDetails = {};
  
    var keys = doc.querySelectorAll("span.key");
    keys.forEach(function(keyElement) {
      var key = keyElement.getAttribute("data-key");
      var valueElement = keyElement.nextElementSibling;
      if (valueElement && valueElement.classList.contains("value")) {
        var value = valueElement.innerText.trim();
        vehicleDetails[key] = value;
      }
    });
  
    var imgElement = doc.querySelector(".thumb img");
    vehicleDetails.imageURL = imgElement ? imgElement.src : null;
  
    console.log(vehicleDetails);
  }
  
  // Example usage
  getVehicleDetails("AAA270");
  