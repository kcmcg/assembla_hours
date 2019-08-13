const Nightmare = require('nightmare')
const nightmare = Nightmare({show:true});
const userDetails = require("./config.json");

const getAddress = async id => {
    try {
        const result = await nightmare
            .goto('https://app.assembla.com/spaces/sdtest/time_entries/report')
            .type("#user_login",userDetails.user)
            .type("#user_password",userDetails.password)
            .click("#signin_button")
            .wait(5000)
            .evaluate(selector => {
                var x = jQuery("." + selector);
                var returnHtml = {};

                x.each(function() {
                    var value = jQuery(this).val();
                    var name = jQuery(this).parent().children("span").html();

                    returnHtml[value] = name;
                });

                return returnHtml;
        }, "user_check_box_list");

        console.log(result);

        return { id, address:result[0], lease: result[1]};
    } catch (e) {
        console.error(e);
        return undefined;
    }
}

getAddress(1);