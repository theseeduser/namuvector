function docEncode(title) {
    if (title === '..') return '..%20';
    if (title === '.') return '.%20';
    return encodeURIComponent(title).replace(/%2F/g, '/');
}

function refreshRecentCard() {
    var recents = $("#recents");
    $.ajax({
        url: "/sidebar.json",
        dataType: "json"
    }).done(function (docs) {
        recents.empty();
        docs.forEach(function (val) {
            var d = new Date(val.date * 1000);

            recents.append(
                '<li><a href="/w/' + docEncode(val.document) + '">' +
                (val.status == "delete" ? "<del>" : "") + val.document + (val.status == "delete" ? "</del>" : "") +
                "</a></li>"
            );
        });

        setTimeout(refreshRecentCard, 30000);
    }).fail(function () {
        recents.html('<li><span style="color: red;">갱신 실패!</span></li>')
    });
}
$(function () {
    $("#searchInput").keypress(function (event) {
        if ((event.keyCode ? event.keyCode : event.which) != 13) {
            return;
        }
        event.preventDefault();
        var val = $(this).val();
        if (val.length > 0) {
            location.href = "/go/" + encodeURIComponent(val);
        }
    });
    $("#searchInput").autocomplete({
        delay: 100,
        source: function (request, response) {
            $.ajax({
                url: '/complete/' + encodeURIComponent(request.term),
                dataType: 'json',
                success: function (data) {
                    response(data);
                },
                error: function (data) {
                    response([]);
                }
            });
        },
        select: function (event, ui) {
            if (ui.item.value) {
                location.href = "/w/" + encodeURIComponent(ui.item.value);
            }
        }
    });
    setTimeout(refreshRecentCard, 1);
});