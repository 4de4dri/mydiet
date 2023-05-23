
// Listener for when the DOM is loaded.
$(() => {
    // Listener for when you click on one of the two tabs (BMR or Diet).
    $('div.box-menu-items span').on('click', function (e) {
        e.preventDefault();
        // Picks up the name of the clicked tab.
        let tabName = $(this).text().toLowerCase();
        tabName === 'tmb' ? tabName = 'bmr' : tabName = 'diet';

        // Modifies the style of the tabs depending on which one is clicked.
        // First remove the tab-selected class to the two tabs.
        $('div.box-menu-items span').removeClass('tab-selected'); 
        // Then apply the tab-selected class to the selected tab.
        $(`div.box-menu-items span[class*="tab-${tabName}"]`).addClass('tab-selected');

        // Call to the method that loads the page bmr.html or midieta.html in the view.
        loadSection(tabName);
    });

    // The bmr section is displayed by default.
    loadSection('bmr');

    // Listener for when the Food button is clicked.
    $('#btn-food').on('click', function () {
        window.api.send('open-food');
    });
});

// It listens to the userData call to receive the logged-in user's data and paints it in the view.
window.api.receive('userData', (res) => {
    console.log(res);
    $('.username span').html(`<i class='bi bi-arrow-down-short'></i> ${res[0].USERNAME}`);
});

/**
 * Method that is in charge of loading the page bmr.html or diet.html in the content of the view 
 * depending on the section that has been clicked.
 */
function loadSection(tabName) {
    $.get(`./${tabName}.html`, (data) => {
        $('.load-content').html(data);
    });
}

/**
 * Listener to enable/disable the Food button.
 */
window.api.receive('stateFoodButton', (state) => {
    if(state) {
        $('#btn-food').prop('disabled', true);
    } else {
        $('#btn-food').prop('disabled', false);
    }
});