$('.spinner-grow').hide()
$('#content-spinner').hide()
$('.messages').hide()
$(document).ready(() => {
    // Hide logo on scroll
    $('body').scroll(() => {
        var st = $('body').scrollTop();
        if (st == 0){
            $('.logo').fadeIn(500)
        } else {
            $('.logo').fadeOut(500)
        }
    })

    $('.logo').click(() => window.location.reload())
    let show_content_spinner = false;
    let search_count = 0;

    // On enter click in input click the search button
    $('#number_in').keypress(e => {
        if(e.which == 13){
            // if this isn't the first search show spinner in the content section
            if(search_count != 0){
                $('#content-spinner').show()
                show_content_spinner = true;
            }
            $('#search').trigger("click")
        }
    })

    $('#search').click(() => {
        search_count += 1;
        // Warning for big numbers
        if(parseInt($('#number_in').val()) > 999999999999999){
            $('.messages').append(`<p>Some information cannot be obtained with such a large number </br> (It can take up to 30 seconds)</p>`)
            $('.messages').fadeIn()
            setTimeout(() => {
                $('.messages').hide(500, () => {
                    $('.messages').empty()
                })
            }, 6000)
        }

        $('#content').empty()
        $('#number_in').css('borderBottomColor', "#FBA700")
        $('#search').fadeOut(100, () => {
            if(!show_content_spinner){
                $('#first-spinner').show()
            }

            let n = $('#number_in').val()
            const url = 'get_data/'+n

            // Get data about the number
            $.ajax({
                url: url,
                success: (data) => {
                    // "unfocus" the input
                    $('#number_in').blur()
                    // hide spinner
                    if(show_content_spinner){
                        $('#content-spinner').fadeOut()
                    }

                    const div = $('#content');
                    data = JSON.parse(data)
                    
                    // Prepare divisors section
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

                    // Prepare list of properties (dict to array with html)
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
                                `<div>Triangular number <img src="/static/images/triangle.svg" alt=""></div>`
                            )
                        } else if(k == 'square' && v == true){
                            properties.push(
                                `<div>Square number <img src="/static/images/square.svg" alt=""></div>`
                            )
                        } else if(k == 'taxicab' && v == true){
                            properties.push(
                                `<div>Taxicab number <img src="/static/images/taxi.svg" alt=""></div>`
                            )
                        } else if(k == "roots" && v && v.length != 0){
                            properties.push(
                                v.map((i) => {
                                    return `<div>The ${i.power} power of ${i.number}</div>`
                                }).join("")
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

                    // Add properties to the content section
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
                    
                    // Add numeric system to the content section
                    div.append(`
                        <div class="col-lg-6 float-left">
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

                    // Add factors to the content section
                    div.append(`
                        <div class="col-lg-6 float-right">
                            <div class="box">
                            <h3 class="header">Factors ${data.timeouts.indexOf('factors') != -1 ? " (timed out)" : ""}</h3>
                            <div class="content">
                                <div>${data.factors.join("*")}</div>
                            </div>
                            </div>
                        </div>
                    `)

                    // Add speed to the content section
                    div.append(`
                        <div class="col-lg-6 float-left">
                            <div class="box">
                            <h3 class="header">Speed</h3>
                            <div class="content">
                                <div>${data.dec} m/s = <p class="orange">${data.sound} x</p> speed of sound</div>
                                <div>${data.dec} m/s = <p class="orange">${data.light} x</p> speed of light</div>
                            </div>
                            </div>
                        </div>
                    `)

                    // If exists add phone information to the content section
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

                    // If exists add bus data to the content section
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

                    // Hide spinner
                    $('.spinner-grow').fadeOut()

                    // On mobile devices hide logo text
                    if($(window).width() <= 800){
                        $('.logo h3').fadeOut(500)
                    }

                    // Move input to the top and show content section
                    $('.wrapper').css({paddingBottom: "70px"})
                    $('.main_text').hide(300, () => {
                        $('.wrapper').animate({paddingBottom: "0px"})
                    })
                    $('.wrapper').animate({height: "10%", top: "0"}, 900)
                    $('body').css('overflow-y', 'scroll')
                },
                error: () =>{
                    // On error show error message in messages box
                    $('.spinner-grow').fadeOut()
                    $('#search').fadeIn()
                    $('.messages').append(`<p>Please type in a positive integer bigger than 1</p>`)
                    $('.messages').fadeIn()
                    setTimeout(() => {
                        $('.messages').hide(500, () => {
                            $('.messages').empty()
                        })
                    }, 3000)
                }
            });
        })
    })
}) 