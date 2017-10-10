/**
 * This file is responsible to execute all the functionalities of the application.
 */ 

//Retreive all the UI Elements of the HTML Page
var movieList 	= document.getElementById("movieList"), // form for displaying list of movies  
movieReview 	= document.getElementById("movieReview"), // form for IMDB details
showTimingsForm = document.getElementById("showTimings"), // form for show timings
pageTitle = document.getElementById("header"); // Page header 

// Parameters to retreive movie details.
var options = {
	// Retreive date in yyyy-mm-dd
	startDate: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
	zip: 14623
}

/**
 * This function is executed when the theatres are successfully retreived by the selected
 * sorting criteria and displays the list of movies on the webpage.
 */
function getTheatresBySortingCriteria(value) {
	var movies = JSON.parse(value);

	var number = 1;
	for (var item in movies.results){
		createElement(movieList, "label", "Title" + number, movies.results[item].original_title);
		createElement(movieList, "div", "div" + number);
		createElement(movieList, "label", "overview" + number, movies.results[item].overview);
		createElement(movieList, "div", "div_" + number);
		var reviewButton = createElement(movieList, "button", "review" + number, "Review", false, {type: "button"});
		reviewButton.addEventListener("click", function(item){
			var item = this.id.replace("review", "") - 1;
			// retreive the IMDB details of that movie.
			theMovieDb.movies.getById({"id":movies.results[item].id}, retrieveIMDBDetails, errorCB);
		});
		createElement(movieList, "hr", "hr" + number);
		number += 1;
	}
}

/**
 * This method is invoked if any of the api's have failed.
 * Any error messages will be added to the console.
 */ 
function errorCB(response){
	console.log("ERROR");
	console.log("error" + response);
	
}

/**
 * This method is used to retreive the IMDB Details of the movie using the "omdb" api
 * and pass it to the function that is responsible to display it.
 */
function retrieveIMDBDetails(value) {
	imdb.getImdbData(JSON.parse(value).imdb_id, displayIMDBDetails, errorCB);
}

/**
 * This function is responsible to display the retreived response from the OMDB api for the movie.
 */
function displayIMDBDetails(response){

	// Hide the movies list since the user has selected a movie he wants to focus on.
	movieList.style.display="none"; 

	var noTrailersAdded = true;
	var movie = JSON.parse(response);

	// Change the page title to reflect the new Header
	pageTitle.innerHTML = "IMDB Movie Details";

	createElement(movieReview, "img", "Poster", undefined, false, {src:movie.Poster, width:"200"})
	createElement(movieReview, "br", "br", "", true); // Enter a blank line
	createElement(movieReview, "label", "Title", "Title: " + movie.Title);
	createElement(movieReview, "label", "Actors", "Actors: " + movie.Actors);
	createElement(movieReview, "label", "Plot", "Plot: " + movie.Plot);
	createElement(movieReview, "label", "Awards", "Awards: " + movie.Awards);
	createElement(movieReview, "label", "Director", "Director: " + movie.Director);
	createElement(movieReview, "label", "Writer", "Writer: " + movie.Writer);
	createElement(movieReview, "label", "Genre", "Genre: " + movie.Genre);
	createElement(movieReview, "label", "Year", "Year: " + movie.Year);
	createElement(movieReview, "label", "Runtime", "Runtime: " + movie.Runtime);
	createElement(movieReview, "label", "imdbRating", "IMDB Rating: " + movie.imdbRating + " / 10 "+ "("+movie.imdbVotes + " votes)");
		
	createElement(movieReview, "br", "br", "", true); // Enter a blank line

	// Create a button to add trailer links if the user is interested.
	var getTrailersButton = createElement(movieReview, "button", "trailer", "Get Youtube Trailer Links", false, {type: "button"});
	getTrailersButton.addEventListener("click", function(item){
		if(noTrailersAdded){
			theMovieDb.movies.getTrailers({"id":movie.imdbID }, createTrailerButtons, errorCB);
			noTrailersAdded = false;
		}
	});
	
	createElement(showTimingsForm, "br", "br", "", true);

	// Retreive the list of theatres nearby.
	var getTheatresButton = createElement(showTimingsForm, "button", "gettheatres", "Get Theatres", false, {type: "button"});
	getTheatresButton.addEventListener("click", function(item){
		getListofTheatres(movie.Title);
	});
	createElement(showTimingsForm, "br", "br", "", true);
	
}

/**
 * Display all the trailer buttons to the user.
 */
function createTrailerButtons(value) {
	var getTrailerButton = document.getElementById('trailer');
	
	var trailers = JSON.parse(value).youtube; // retreive youtube keys.

	for(var trailer in trailers){
		
		var getTrailerLink = createElement(movieReview, "button", "trailer" + trailer,
			 				trailers[trailer].name, true, {type: "button"}, getTrailerButton );
		
		// Add action listener so Youtube is opened once the user clicks a link
		getTrailerLink.addEventListener("click", function(item){
			
			var trailerid = this.id.replace("trailer", "");

			// append the key to the youtube link prefix and open it in a new tab.
			window.open("https://www.youtube.com/watch?v=" + trailers[trailerid].source);
		});
	}
}

/**
 * This method invokes the method responsible to get the list of all movies that are
 * present in the theatres nearby from the GraceNoteConnect API (tmsapi).
 */
function getListofTheatres(movieName){
	tms.getMoviesInTheatres(movieName, options, retreiveShowTimingsForMovie,errorCB);
}

/**
 * This method retreives the showtimings for the movie selected by the user and invokes the
 * method responsible to display the various showtimings.
 */
function retreiveShowTimingsForMovie(movieName, response) {
	var moviesInTheatres = JSON.parse(response);
	var showtimes = null;	
	for(var index in moviesInTheatres){
		if(moviesInTheatres[index].title.trim() === (movieName).trim()){
			showtimes = moviesInTheatres[index].showtimes;
			break;
		}
	}

	if(showtimes !== null){ // Movie running in local Theatres.
		displayShowtimes(showtimes)
	}
	else{ // Movie not present in local theatres.
		createElement(showTimingsForm, "label", "NoTheatres", "Sorry, No Theatres in your area have this movie.");
	}
}

/**
 * This method displays the Theatre wise show timings of the movie.
 */
function displayShowtimes(showTimings) {
	var number = 0;
	var TheatreTimings = {};
	for(var item in showTimings){
		var DateAndTime = getDateAndTime(showTimings[item].dateTime);

		// Check if theatre has already been added to the list of theatre wise timings.
		if(!TheatreTimings.hasOwnProperty(showTimings[item].theatre.name)){
			TheatreTimings[showTimings[item].theatre.name] = {};
			TheatreTimings[showTimings[item].theatre.name]["ticketURI"] = "" + showTimings[item].ticketURI;
			TheatreTimings[showTimings[item].theatre.name]["dates"] = {};
			TheatreTimings[showTimings[item].theatre.name]["dates"][DateAndTime.date] = DateAndTime.time;
		}
		else{
			// Append the theatre wise date wise timings seperated by ","
			TheatreTimings[showTimings[item].theatre.name]["dates"][DateAndTime.date] += "," + (DateAndTime.time);
		}
	}
	
	// For each theatre display the timings.
	for(var theatre in TheatreTimings){
		createElement(showTimingsForm, "label", "TheatreName", "Theatre Name: " + theatre);
		// For each date
		for(var date in TheatreTimings[theatre]["dates"]){
			createElement(showTimingsForm, "label", "Date", "Date: " + date);

			// get the timings as an array.
			var timings = TheatreTimings[theatre]["dates"][date].split(",");
			
			createElement(showTimingsForm, "label", "TimeLabel", "Time: ", true);
			
			// Display timings seperated by pipe (|)
			for(var i = 0; i < timings.length; i++){
				createElement(showTimingsForm, "label", "Time" + i, " | " + timings[i], true);
			}

			var div = createElement(showTimingsForm, "div", "divPurchase", "", true);

			// Display a button to purchase the ticket.
			var purchaseLink = createElement(showTimingsForm, "button", "purchaseLink", "Purchase Tickets", false, {type: "button"});
			purchaseLink.addEventListener("click", function(){
				window.open(TheatreTimings[theatre].ticketURI);
			});	

			// insert new Line
			createElement(showTimingsForm, "br", "br", "", true);
			
			number += 1;		
		}
		
		
	}
}

/**
 * Retreive date and time seperated by "T" and return an object of date and time.
 */
function getDateAndTime(dateTime){
	var dateTimeObject = {};
	var timeIndex = dateTime.indexOf("T"); // represents the Time 
	dateTimeObject["date"] = dateTime.substring(0, timeIndex);
	dateTimeObject["time"] = dateTime.substring(timeIndex + 1); // to exclude "T"
	return dateTimeObject;
}

/**
 * This generic function is used to create an HTML element and add it to the form supplied as an argument
 * form: name of the form that tne element is to be added to
 * type: type of element that needs to be created
 * label: name of the element.
 * value: content of that element.
 * nodiv: if true the element will not have any div after its created. (the next element will be created on the same line)
 * properties: any additional properties of the element that need to be customized.
 */
function createElement(form, type, label, value, nodiv, properties){
	var element = document.createElement(type);
	
	element.id = label;
	
	if(value !== undefined){
		element.innerHTML = value;
	}

	if(properties !== undefined){
		for (var item in properties)
		element[item] = properties[item];	
	}
		form.appendChild(element);

	if(!nodiv){
		createElement(form, "div", "div", null, true);
	}
		
		return element;
}