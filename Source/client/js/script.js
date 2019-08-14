"use strict";

(function() {
	var url = "getListOfFavPlaces";
	var xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function() {
	    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {	
	    		console.log(xmlhttp.responseText);
				fillTable(JSON.parse(xmlhttp.responseText));	
	    }
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();


	function fillTable(result) {
			var output = "";
    		for (var i = 0; i < result.length; i++) {
					output+="<tr><td>"
		 			+ result[i]["place_name"]
		 			+ "</td><td>"
		 			+ result[i]["addr_line1"]
		 			+ result[i]["addr_line2"]
		 			+ "</td><td>"
		 			+ result[i]["open_time"]+ "<br>"
					+ result[i]["close_time"]
					+ "</td><td>"
					+ result[i]["add_info"]
					+ "</td><td>"
					+ result[i]["add_info_url"]
					+ "</td></tr>";				
			}
		 document.getElementsByTagName("tbody")[0].innerHTML = output;
    }
})();