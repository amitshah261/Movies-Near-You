/**
 * TMS API: API that is used to provide details about the movie timings by GraceNote
 * API_Key: cwm4ntvj3j6vgrr3na55zgv6
 */

 var tms = {
 	getMoviesInTheatres: function (movieName, options, successCB, errorCB){

 		var api_key = "cwm4ntvj3j6vgrr3na55zgv6";
 		var status = 200;
 		var base_url = "https://data.tmsapi.com/v1.1/movies/showings";
 		query = "?",
 		api = "api_key=" + api_key;

		// append the additional options
		for(item in options){
			query += item + "=" + options[item] + "&";	
		}

		var xhr;

		xhr = new XMLHttpRequest();
		
		xhr.open("GET", base_url + query + api);
		
		xhr.send();
		
		xhr.onload = function (e) {
			if (xhr.readyState === 4) {
				if (xhr.status === status) {
					successCB(movieName, xhr.responseText);
				}
				else{
					errorCB(xhr.responseText);
				}	
			} 
		};
	}

};