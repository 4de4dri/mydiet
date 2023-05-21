

function showNotification(message, type = false) {
    if(type) {
        $('.box-notification').css('background-color', '#AAFFA0');
    } else {
        $('.box-notification').css('background-color', '#ffa0a0');
    }
    $('.box-notification').html(message).show();
    setTimeout(() => {
        $('.box-notification').html(message).hide();
    }, 3000);
}