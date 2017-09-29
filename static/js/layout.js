var isMobileMenuHidden = true;
var isMobile = /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);
var defaultSettings = {
    // available values : minerva, popover, popup, none
    // "minerva" means method of wikimedia mobile frontend
    footnoteDisplay: isMobile ? 'minerva' : 'popup',
    // available values : true, false, 'undelete'
    hideDeletedOnWiki: false,
    // available values : true, false, 'undelete'
    hideDeletedOnTopic: false,
    // available values : true (uses lazyload), false (do nothing)
    useLazyload: isMobile ? true : false
};
var NamuVector = {
    load: function (withDefault) {
        if (typeof withDefault === "undefined")
            var withDefault = true;
        var str = localStorage.getItem("namuvector_skinsettings");
        if (str == null) {
            return withDefault ? defaultSettings : {};
        } else {
            var settings = JSON.parse(str);
            return withDefault ? $.extend(defaultSettings, settings) : settings;
        }
    },
    save: function (val) {
        localStorage.setItem("namuvector_skinsettings", JSON.stringify(val));
    }
};
$(function () {
    $('.alert.fade').addClass('show');
    $(".wiki-article img.wiki-lazy-image").removeClass('wiki-lazy-image').removeClass('wiki-lazy-loading').each(function () {
        switch(NamuVector.load().useLazyload) {
            case true:
                $(this).lazyload({effect: "fadeIn"});
            case false:
            default:
                $(this).attr('src', $(this).attr("data-original"));
        }
    });
    $("#toggle-mobile-menu").click(function (e) {
        e.preventDefault();
        $("#mobile-detail-menu").attr("style", (isMobileMenuHidden = !isMobileMenuHidden) ? "display: none !important" : "");
    });
    if(/^\/([a-zA-Z0-9_])\//.test(location.pathname)) {
        pageInfo.actionName = /^\/([a-zA-Z0-9_])\//.exec(location.pathname)[1];
        pageInfo.wiki = pageInfo.actionName == 'w';
        pageInfo.topic = pageInfo.actionName == 'topic';
        pageInfo.discuss = pageInfo.actionName == 'discuss' || pageInfo.actionName == 'thread';
    }
    $('.wiki-' + pageInfo.actionName + '-nav').addClass('active');
    function customizeWikiCSS() {
        var css = '',
            pathname = location.pathname,
            settings = NamuVector.load();
        if(pageInfo.wiki && settings.hideDeletedOnWiki !== false) {
            css += settings.hideDeletedOnWiki === true ?
                   'article del { display: none; }' :
                   'article del { text-decoration: none; color: initial; }';
        }
        else if((pageInfo.topic || pageInfo.discuss) && settings.hideDeletedOnTopic !== false) {
            css += settings.hideDeletedOnTopic === true ?
                   'article del { display: none; }' :
                   'article del { text-decoration: none; color: initial; }';
        }
    }
    function customizeFnStyle() {
        $("a.wiki-fn-content[href]").each(function () {
            var rfn = $(this);
            var refContentAsHtml = $(rfn.attr("href")).parent().clone();
            refContentAsHtml.find("span.target").remove();
            refContentAsHtml.find("a:first-child").remove();
            refContentAsHtml = refContentAsHtml.html();
            switch (NamuVector.load().footnoteDisplay) {
                case 'minerva':
                    rfn.click(function (evt) {
                        evt.preventDefault();
                        var minervaPopup;
                        if ($(".minerva-fn-pop").length > 0) {
                            minervaPopup = $(".minerva-fn-pop");
                        } else {
                            minervaPopup = $('<div class="minerva-fn-pop"><h1 class="minerva-fn-title"><i class="fa fa-bookmark"></i> <span class="minerva-title-holder"></span><i class="fa fa-times minerva-close"></i></h1><div class="minerva-fn-content"></div></div>');
                            $("article").append(minervaPopup);
                        }
                        minervaPopup.find(".minerva-title-holder").text('주석 ' + rfn.text());
                        minervaPopup.find(".minerva-fn-content").html(refContentAsHtml);
                        minervaPopup.find(".minerva-close").click(function () {
                            minervaPopup.remove();
                        });
                    })
                    break;
                case 'popover':
                    rfn.data("content", refContentAsHtml);
                    rfn.removeAttr('title');
                    rfn.popover({
                        html: true,
                        title: '주석 ' + rfn.text(),
                        trigger: 'hover',
                        container: 'article'
                    });
                    break;
                case 'popup':
                    rfn.click(function (evt) {
                        evt.preventDefault();
                        var fnPopup;
                        if ($(".fn-popup").length > 0) {
                            fnPopup = $(".fn-popup");
                        } else {
                            // fn-popup-title-holder, modal-body
                            fnPopup = $('<div class="modal fade fn-popup"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title"><i class="fa fa-bookmark"></i> <span class="fn-popup-title-holder"></span></h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body"></div></div></div></div>');
                            $("article").append(fnPopup);
                        }
                        fnPopup.find(".fn-popup-title-holder").text('주석 ' + rfn.text());
                        fnPopup.find(".modal-body").html(refContentAsHtml);
                        fnPopup.modal('show');
                    });
                case 'none':
                    // Do nothing
            }
        });
    }
    if(pageInfo.wiki || pageInfo.topic || pageInfo.discuss) {
        customizeFnStyle();
        customizeWikiCSS();
    }
});