$(document).ready(() => {
    $('#search').click(() => {
        $('#number_in').css('borderBottomColor', "#FBA700")
        $('#search').fadeOut(300, () => {
            if($(window).width() <= 800){
                $('.logo h3').fadeOut(500)
            }
            $('.wrapper').css({paddingBottom: "70px"})
            $('.main_text').hide(300, () => {
                $('.wrapper').animate({paddingBottom: "0px"})
            })
            $('.wrapper').animate({height: "10%", top: "0"}, 900)
        })
    })
})