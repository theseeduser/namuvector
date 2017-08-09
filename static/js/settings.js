$(function () {
    $("#saveSkinSettings").click(function () {
        $(".namuvector-setting").each(function () {
            var setting = $(this);
            var setname = setting.data("setname"),
                setvalue = setting.val();
            if (setvalue === "true")
                setvalue = true;
            else if (setvalue === "false")
                setvalue = false;
             var newsets = NamuVector.load(false);
            if (setvalue === "skin-default") {
                if (newsets[setname]) {
                    delete newsets[setname];
                    NamuVector.save(newsets);
                } else {
                    return;
                }
            } else {
                newsets[setname] = setvalue;
                NamuVector.save(newsets);
            }
        })
    });
});