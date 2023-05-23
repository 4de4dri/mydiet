
// Listener for when the DOM is loaded.
$(() => {
    // Listener for when you click on one of the two tabs (login or register).
    $('div.box-tabs-login-register span').on('click', function (e) {
        e.preventDefault();
        // Picks up the name of the clicked tab.
        let tabName = $(this).text().toLowerCase();
        if(tabName === 'registro') tabName = 'register';

        // Modifies the style of the tabs depending on which one is clicked.
        // First remove the tab-selected class to the two tabs.
        $('div.box-tabs-login-register span').removeClass('tab-selected'); 
        // Then apply the tab-selected class to the selected tab.
        $(`div.box-tabs-login-register span[class*="tab-${tabName}"]`).addClass('tab-selected');

        // Cleans the form inputs.
        $('form input').val('');
        
        // Hides the two sections and displays the selected section.
        $('div[class*="box-form-"]').hide();
        $(`div.box-form-${tabName}`).show();
    });

    // Listener for when you click on the Enter button of the Login form.
    $('#btn-login').on('click', (e) => {
        e.preventDefault();
        login();
    });

    // Listener for when you click on the Register button of the Register form.
    $('#btn-register').on('click', (e) => {
        e.preventDefault();
        register();
    })
});

/**
 * Log in
 */
function login() {
    const data = {
        username: $('#form-login-username').val(),
        password: $('#form-login-password').val()
    }

    // Check that the fields are filled in.
    if(data.username !== '' && data.password !== '') {
        // Send the data to the preload.
        window.api.send('login', data);

        // Receives data from the preload when it does not find the credentials.
        window.api.receive('failLogin', (res) => { 
            showNotification('Datos incorrectos');
        });
    } else {
        showNotification('Debes rellenar todos los datos');
    }
}

/**
 * Register
 */
function register() {
    const data = {
        username: $('#form-register-username').val(),
        password: $('#form-register-password').val(),
        weight: $('#form-register-weight').val(),
        height: $('#form-register-height').val(),
        age: $('#form-register-age').val()
    }

    if(data.username !== '' && data.password !== '' && data.weight !== '' && data.height !== '' && data.age !== '') {
        // Send the data to the preload.
        window.api.send('register', data);

        // Receives data from the preload when an error has occurred.
        window.api.receive('failRegister', (res) => { 
            showNotification(res);
        });

        // Receives data from the preload when the registration has been performed.
        window.api.receive('successRegister', (res) => {
            showNotification(res, true);
        });
    } else {
        showNotification('Debes rellenar todos los datos');
    }

}
