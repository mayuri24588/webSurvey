
var userListData = [];
var maleSurvey = 0;
var femaleSurvey = 0;
var jsonData;
var totalResponder;

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

});

// Functions =============================================================

function formatdate(date)
{
    var date = new Date(date);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    var formatDate= (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear() + "  " + strTime;
    return(formatDate);
}

function populateTable() {
    // Empty content string
    var tableContent = '';
    var date= '';

    // jQuery AJAX call for JSON
    $.getJSON( '/surveys/surveylist', function( data ) {

        jsonData = data;
        totalResponder = data.length;
        $.each(data, function(){
            //TODO - display result only if data is valid
            var date1 = new Date(this.reg_date);
            tableContent += '<tr>';
            tableContent += '<td>' + this.gender + '</td>';
            tableContent += '<td>' + this.condition + '</td>';
            tableContent += '<td>' + this.state + '</td>';
            tableContent += '<td>' + formatdate(this.reg_date) + '</td>';
            tableContent += '</tr>';
            if (this.gender == "F") { 
                femaleSurvey++;
            } else {
                maleSurvey++;
            } 
        });
        totalResponder = data.length;
        $('#total').html(totalResponder);
        // Inject the whole content string into our existing HTML table
        $('#surveyList table tbody').html(tableContent);       
    loadChart();
    });
};

function loadChart() {
    var chart = new CanvasJS.Chart("chartContainer",
    {
        title:{
            text: "Survey gender division",
            fontFamily: "arial black",
            fontSize : 14
        },
                animationEnabled: true,
        legend: {
            verticalAlign: "bottom",
            horizontalAlign: "center"
        },
        theme: "theme1",
        data: [
        {        
            type: "pie",
            indexLabelFontFamily: "Garamond",       
            indexLabelFontSize: 20,
            indexLabelFontWeight: "regular",
            startAngle:0,
            indexLabelFontColor: "MistyRose",       
            indexLabelLineColor: "darkgrey", 
            indexLabelPlacement: "inside", 
            toolTipContent: "{name}: {y} members",
            showInLegend: true,
            indexLabel: "#percent%", 
            dataPoints: [
                {  y: femaleSurvey, name: "Female", legendMarkerType: "triangle"},
                {  y: maleSurvey, name: "Male", legendMarkerType: "square"}
            ]
        }
        ]
    });
    chart.render();
    avgResponderPerHour();
}

function avgResponderPerHour() {
    //find Date Range
    var oldestdate = new Date(); 
    var latestdate = new Date();
    var avgresponse = totalResponder;
            $.each(jsonData, function(){
                var this_date = new Date(this.reg_date);
                if (oldestdate.getTime() > this_date.getTime()) {
                    oldestdate = this_date; }  
                else {
                    latestdate = this_date; }               
            })
    var surveyHours = Math.abs(new Date(latestdate) - new Date(oldestdate)) / 36e5;
    if (surveyHours>0) {
        avgresponse = Math.ceil(totalResponder / Math.ceil(surveyHours));
    } 
    $('#avgResponder').html(avgresponse);
}

// Add User button click
$('#btnAddUser').on('click', addUser);
 // Add User
function addUser(event) {
    event.preventDefault();
    var errorCount = 0;
    $('#surveyForm input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });
    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'gender': $('#surveyForm input:radio[name=gender]:checked').val(),
            'condition': $('#surveyForm select#EmotionType :selected').text(),
            'state': $('#surveyForm select#StateValue :selected').text(),
            'reg_date' : Date()
        }
        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/surveys/addsurvey',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#surveyForm fieldset input').val('');
                window.location.href = response.redirect;
                // Update the table
                //populateTable();
                //$.('/view').replaceWith(data.form);
            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);
            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};
