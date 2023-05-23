
$(() => {


});

/**
 * Listener for when you click on one of the arrows
 */
$('i[id*="-arrow"]').on('click', function () {
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    let currentDay = $('#current-day').html(); // The current day is obtained.
    let nameArrow = $(this).attr('id'); // The name of the pressed date is obtained.
    let currentPosition = days.findIndex(elemento => elemento.includes(currentDay)); // The position of the day in the array days is obtained.
    let dayToShow;

    // In case the left arrow has been pressed.
    if (nameArrow.includes('left')) {
        if(currentDay === 'Lunes') {
            dayToShow = "Domingo";
        } else {
            dayToShow = days[currentPosition - 1];
        }
        // Updates the name of the day in the day selection and in the div of the day's total.
        $('#current-day').html(dayToShow); 
        $('#total-day').html(dayToShow);
    }

    // In case the right arrow has been pressed.
    if (nameArrow.includes('right')) {
        if(currentDay === 'Domingo') {
            dayToShow = "Lunes";
        } else {
            dayToShow = days[currentPosition + 1];
        }
        $('#current-day').html(dayToShow);
        $('#total-day').html(dayToShow);
    }
});