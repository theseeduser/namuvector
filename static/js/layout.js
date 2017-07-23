var isMobileMenuHidden = true;
$(function () {
    $("#toggle-mobile-menu").click(function(e){
        e.preventDefault();
        $("#mobile-detail-menu").attr("style", (isMobileMenuHidden = !isMobileMenuHidden) ? "display: none !important" : "");
    })
});