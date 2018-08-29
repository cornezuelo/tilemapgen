var debug= 1;
var n_rows = 36;
var n_columns = 42;
var gridObj = {};
$(document).ready( function() {			
	create_grid();	
	//IMPORTANTE, PARA LA GENERACION DE AGUA Y BOSQUES: https://gamedevelopment.tutsplus.com/tutorials/generate-random-cave-levels-using-cellular-automata--gamedev-9664
	//CAMBIA A CANVAS: https://codereview.stackexchange.com/questions/190780/terrain-map-generator-with-javascript-and-html5-css
	//create_water();
	//create_woods();
	//Creamos los caminos despues, para asi pintarlos solo en terreno grass y no romper los bosques ni los lagos
	create_roads();
});

//Create a grid
function create_grid() {	
	var grid = $('<table></table>').attr({ id: "grid" });	
	var rows = new Number(n_rows);
	var cols = new Number(n_columns);		
	for (var i = 0; i < rows; i++) {
		var row = $('<tr></tr>').attr({ class: "grid-row", id: "r-"+i }).appendTo(grid);		
		for (var j = 0; j < cols; j++) {
			$('<td></td>').attr({ class: "grid-col land-grass", id: "r-"+i+"-"+j}).html("&#9926;").appendTo(row); 
			gridObj['r-'+i+'-'+j] = 'grass';					
		}
		 		 
	}		
	grid.appendTo("#main-div");		
}

//Create roads
function create_roads() {
	var num_roads = getRandomInt(0,3);
	var changed = false;	
	_debug('roads: '+num_roads);
	if (num_roads > 0) {
		for (i = 0; i < num_roads; i++) {
			//50% posibilities of starting on the left or on the top
			//*********************************************************
			//Starting at the left
			if (getRandomInt(0,100) <= 50) {						
				var c_row = getRandomInt(0,n_rows);			
				var c_col = 0;			
				change_land('r-'+c_row+'-'+c_col, 'road');	//init
				while (c_col < n_columns) {									
					//20% posibilities of changing the row
					if (getRandomInt(0,100) <= 20) {
						//50% up, 50% down
						if (c_row < n_rows && getRandomInt(0,100) <= 50) {						
							c_row++;
							changed = true;
						} else if (c_row > 0) {						
							c_row--;
							changed = true;
						}					
					}
					//If the row changed, we need to create an extra road to the new path
					if (changed) {
						change_land('r-'+c_row+'-'+c_col, 'road');
						changed = false;
					}
					c_col++;			
					change_land('r-'+c_row+'-'+c_col, 'road');	
				}
			} 
			//********************************
			//Starting at the top
			else {
				var c_row = 0;
				var c_col = getRandomInt(0,n_columns);						
				change_land('r-'+c_row+'-'+c_col, 'road');	//init
				while (c_row < n_rows) {									
					//20% posibilities of changing the col
					if (getRandomInt(0,100) <= 20) {
						//50% up, 50% down
						if (c_col < n_columns && getRandomInt(0,100) <= 50) {						
							c_col++;
							changed = true;
						} else if (c_col > 0) {						
							c_col--;
							changed = true;
						}					
					}
					//If the col changed, we need to create an extra road to the new path
					if (changed) {
						change_land('r-'+c_row+'-'+c_col, 'road');
						changed = false;
					}
					c_row++;			
					change_land('r-'+c_row+'-'+c_col, 'road');	
				}
			}
		}
	}
}

//Change a land
function change_land(id, land) {	
	if ($('#'+id).length) {
		$('#'+id).removeClass(function (index, className) {
		    return (className.match (/(^|\s)land-\S+/g) || []).join(' '); //Removes all classes starting with land-
		});
		$('#'+id).addClass('land-'+land);
		gridObj[id] = land;		
	}		
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Debugs
function _debug(t) {
	if (debug == 1) {
		$('#debug').append('<div><pre>'+t+'</pre></div>');
	}
}