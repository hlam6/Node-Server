"use strict";

(function() {
	var url = "getListOfFavPlaces";
	var xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function() {
	    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
	    		var parseJson = JSON.parse(xmlhttp.responseText);
				//console.log(parseJson);					
				fillTable(parseJson);
				
	    }
	}
	xmlhttp.open("GET", url, true);
	xmlhttp.send();


	function fillTable(response) {
		var output = "";
		for (var i = 0; i < response["res"]["placeList"].length; i++) {
		 	output+="<tr><td>"
		 	+ response["res"]["placeList"][i].placename
		 	+ "</td><td>"
		 	+ response["res"]["placeList"][i].addressline1
		 	+ response["res"]["placeList"][i].addressline2
		 	+ "</td><td>"
		 	+ response["res"]["placeList"][i].opentime + "<br>"
			+ response["res"]["placeList"][i].closetime
			+ "</td><td>"
			+ response["res"]["placeList"][i].additionalinfo
			+ "</td><td>"
			+ response["res"]["placeList"][i].additionalinfourl
			+ "</td></tr>";
			//... you fill in the rest of the information from
			// the array of JSON objects held by the variable response
		 }
		 document.getElementsByTagName("tbody")[0].innerHTML = output;
    }
})();