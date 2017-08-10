/**
 * Created by lcassidy on 6/28/17.
 */

$('#getData').click(function() {
    console.log("button clicked");
    $.get( "http://localhost:49160/getData", function( data ) {
        $( "#contentToBeUpdated" ).empty();
        $( "#contentToBeUpdated" ).html( data );
        console.log("loaded data");
    });
});