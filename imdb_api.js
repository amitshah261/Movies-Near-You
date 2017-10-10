/**
 * OMDB API: Free open-source API that retreives all the data of the IMDB database.
 * API_Key: NA  // Since its an open API
 */

var imdb = {
	getImdbData: function (imdb_id, successCB, errorCB){
		var api_key = ""; // omdb is an open api
		var status = 200;
		var base_url = "http://www.omdbapi.com/";
		query = "?i=" + imdb_id,
		api = "apikey=d41cf800";
		var xhr;
		xhr = new XMLHttpRequest();
		
		xhr.open("GET", base_url + query + api);
		console.log(base_url + query + api);
		xhr.send();
		
        xhr.onload = function (e) {
        	if (xhr.readyState === 4) {
        		if (xhr.status === status) {
        			successCB(xhr.responseText);
        		}
        		else{
        			errorCB(xhr.responseText);
        		}	
        	}
        };        
    }
};