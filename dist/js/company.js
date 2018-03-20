$(function () {
    var swiper = new Swiper('#recommendSwiper', {
        slidesPerView: 5,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',

        breakpoints: {
            1024: {
                slidesPerView: 5,
                spaceBetween: 30
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 20
            },
            640: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            320: {
                slidesPerView: 1,
                spaceBetween: 10
            }
        }
    });
    $(".swiper-slide .panel").hover(function() {
        var a = $(this);
        this.timer = setTimeout(function() {
            a.addClass("hover").parent("div").siblings("div").find(".panel").removeClass("hover")
        }, 100)
    }, function() {
        clearTimeout(this.timer);
        $(this).removeClass("hover")
    });
    /**
     * 公司详情
     **/
    var swiperDetail = new Swiper('#companyDetailSwiper', {
        width: 710,
        height: 340,
        autoplay : 5000,
        loop : true,
        pagination: '.swiper-pagination',
        prevButton:'.swiper-button-prev',
        nextButton:'.swiper-button-next',
    });
    $('#navigator_container .nav_item').click(function () {
        var lis = $('#navigator_container .nav_item');
        for (var i = 0; i < lis.length; i++) {
            var obj = lis[i];
            $(obj).removeClass('nav_selected');
        }
        $(this).addClass('nav_selected');
    });
    $('#navigator_container').pin({padding: {top: 10}});
});
