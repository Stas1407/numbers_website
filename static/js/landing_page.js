$('.spinner-grow').hide()
$('#content-spinner').hide()
$(document).ready(() => {
    $('.logo').click(() => window.location.reload())
    let show_content_spinner = false

    $('#number_in').keypress(e => {
        if(e.which == 13){
            $('#content-spinner').show()
            show_content_spinner = true;
            $('#search').trigger("click")
        }
    })

    $('#search').click(() => {
        $('#content').empty()
        $('#number_in').css('borderBottomColor', "#FBA700")
        $('#search').fadeOut(1, () => {
            if(!show_content_spinner){
                $('.spinner-grow').hide()
            }
            let n = $('#number_in').val()
            const url = 'get_data/'+n
            $.ajax({
                url: url,
                success: (data) => {
                    if(show_content_spinner){
                        console.log('hide')
                        $('#content-spinner').fadeOut()
                    }

                    const div = $('#content');
                    data = JSON.parse(data)
                    
                    div.append(`
                        <div class="col-lg-6 float-left">
                            <div class="box">
                            <h3 class="header">Divisors ${data.timeouts.indexOf('divisors') != -1 ? " (timed out)" : ""}</h3>
                            <div class="content">
                                <div>${data.divisors.map((item) => " "+item)}</div>
                            </div>
                            </div>
                        </div>
                    `)

                    let properties = []
                    for(let [k, v] of Object.entries(data.properties)){
                        if(k == 'semiprime' && v == true){
                            properties.push(
                                `<div>Semi-prime number <p class="semi-prime">${data.properties.semiprime_factors.join("*")}</p></div>`
                            )
                        } else if(k == "palindromic" && v == true){
                            properties.push(
                                `<div>Palindromic number <img src="/static/images/palindromic.svg" alt=""></div>`
                            )
                        } else if(k == 'triangle' && v == true){
                            properties.push(
                                `<div>Triangle number <img src="/static/images/triangle.svg" alt=""></div>`
                            )
                        } else if(k == 'square' && v == true){
                            properties.push(
                                `<div>Square number <img src="/static/images/square.svg" alt=""></div>`
                            )
                        } else if(k == 'taxicab' && v == true){
                            properties.push(
                                `<div>Taxicab number <img src="/static/images/square.svg" alt=""></div>`
                            )
                        } else if(k == "roots" && v && v.length != 0){
                            properties.push(
                                v.map((i) => {
                                    return `<div>The ${i.power} power of ${i.number}</div>`
                                }).join()
                            )
                        } else if(k == 'year' && v == true){
                            properties.push(
                                `<div>If the number was a year it would be a leap year</div>`
                            )
                        } else if(k == 'prime' && v == true){
                            properties.push(
                                `<div>Prime number</div>`
                            )
                        } else if(k == 'composite_number' && v == true){
                            properties.push(
                                `<div>Composite number</div>`
                            )
                        } else if(k == 'perfect' && v == true){
                            properties.push(
                                `<div>Perfect number <img src="/static/images/diamond.svg" alt=""></div>`
                            )
                        }
                    }

                    div.append(`
                        <div class="col-lg-6 float-right">
                            <div class="box">
                            <h3 class="header">Properties</h3>
                            <div class="content properties">
                                ${properties.join("")}
                            </div>
                            </div>
                        </div>
                    `)

                    div.append(`
                        <div class="col-lg-6 float-right">
                        <div class="box">
                        <h3 class="header">Numeric systems</h3>
                        <div class="content properties">
                            <div>dec: ${data.dec}</div>
                            <div>hex: ${data.hex}</div>
                            <div>bin: ${data.bin}</div>
                            <div>oct: ${data.oct}</div>
                        </div>
                        </div>
                    </div>
                    `)

                    div.append(`
                        <div class="col-lg-6 float-left">
                            <div class="box">
                            <h3 class="header">Factors ${data.timeouts.indexOf('factors') != -1 ? " (timed out)" : ""}</h3>
                            <div class="content">
                                <div>${data.factors.join("*")}</div>
                            </div>
                            </div>
                        </div>
                    `)

                    div.append(`
                        <div class="col-lg-6 float-right">
                            <div class="box">
                            <h3 class="header">Speed</h3>
                            <div class="content">
                                <div>${data.dec} m/s = <p class="orange">${data.sound} x</p> speed of sound</div>
                                <div>${data.dec} m/s = <p class="orange">${data.light} x</p> speed of light</div>
                            </div>
                            </div>
                        </div>
                    `)

                    let phone = false;
                    if(!jQuery.isEmptyObject(data.phone)){
                        phone = true;
                        div.append(`
                            <div class="col-lg-6 float-right">
                                <div class="box">
                                <h3 class="header">Phone</h3>
                                <div class="content phone">
                                    <div>Country: <p class="orange">${data.phone.name}</p></div>
                                    <div>Dial code: <p class="orange">${data.phone.dial_code}</p></div>
                                    <div>Country code: <p class="orange">${data.phone.code}</p></div>
                                </div>
                                </div>
                            </div>
                        `)
                    }

                    if(data.bus.length != 0){
                        div.append(`
                            <div class="col-lg-6 ${phone ? "float-left" : "float-right"}">
                            <div class="box">
                            <h3 class="header">Bus - ${data.dec}</h3>
                            <div class="content">
                                <table>
                                ${data.bus.map(item => {
                                    return (`
                                        <tr>
                                            <td>${item}</td>
                                        </tr>
                                    `)
                                }).join("")}
                                </table>
                            </div>
                            </div>
                        `)
                    }
                    $('.spinner-grow').fadeOut()
                    if($(window).width() <= 800){
                        $('.logo h3').fadeOut(500)
                    }
                    $('.wrapper').css({paddingBottom: "70px"})
                    $('.main_text').hide(300, () => {
                        $('.wrapper').animate({paddingBottom: "0px"})
                    })
                    $('.wrapper').animate({height: "10%", top: "0"}, 900)
                    $('body').css('overflow-y', 'scroll')
                }
            });
        })
    })
}) 