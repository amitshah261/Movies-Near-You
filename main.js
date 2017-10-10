/**
 * This is the main javascript file which initiates the entire application.
 */

// sorting_criteria options = 
// popularity.asc, popularity.desc, release_date.asc,
// release_date.desc, revenue.asc, revenue.desc, primary_release_date.asc, 
// primary_release_date.desc, original_title.asc, original_title.desc,
// vote_average.asc, vote_average.desc, vote_count.asc, vote_count.desc
var sorting_criteria = "popularity.desc";

theMovieDb.discover.getMovies({"sort_by":sorting_criteria}, getTheatresBySortingCriteria, errorCB);