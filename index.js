const Nightmare = require('nightmare')
const nightmare = Nightmare({show:true});
const userDetails = require("./config.json");

const loginToAssembla = async (done) => {
    let result = false;
    try {
        let visible = await nightmare
            .visible("#user_login")

        if(visible) {
            await nightmare
                .type("#user_login",userDetails.user)
                .type("#user_password",userDetails.password)
                .click("#signin_button")
                .wait(5000)
                .then(async () => {
                    result = await done()
                });
        }
        else {
            result =  await done();
        }
    } catch(e) {
        console.error(e);
        return "error";
    }

    return result;
};

const getNameList = async (url) => {
    try {
        await nightmare
            .goto(url);

        let result = await loginToAssembla(async () => {
            return await nightmare.evaluate(selector => {
                var x = jQuery("." + selector);
                var returnHtml = {};

                x.each(function() {
                    var value = jQuery(this).val();
                    returnHtml[value] = jQuery(this).parent().children("span").html();
                });
                return returnHtml;
            }, "user_check_box_list");
        });
        return { names:result};
    } catch (e) {
        console.error(e);
        return "error";
    }
};

const runReports = async (url) => {
    let nameList = await getNameList(url);

    console.log(nameList);
};

runReports('https://app.assembla.com/spaces/sdtest/time_entries/report');