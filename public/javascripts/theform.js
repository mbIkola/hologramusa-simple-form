
$(document).ready(function() {

    console.log("Working");
    var form = $('#ipoIntakeForm');
    var inputs = form.find('input,textarea,select').not(':submit').toArray();
    var submit = $('input[type="submit"]');



    // hearAboutUs - Show input fields for referral and other
    const $hearAboutUs = $('#hearAboutUs');
    const $refWrapper = $('#referralSourceWrapper');
    const $otherWrapper = $('#otherSourceWrapper');

    $hearAboutUs.change(function () {
        if ($hearAboutUs.val() === 'referral') {
            $refWrapper.show();
            $otherWrapper.hide();
        } else if ($hearAboutUs.val() === 'other') {
            $otherWrapper.show();
            $refWrapper.hide();
        } else {
            $('#referralSourceWrapper, #otherSourceWrapper').hide();
        }
    });

    $('#formRestartBtn').click(function () {
        inputs.forEach(function(i) { i.value = ""; });
        var divPosition = $("#topContainer").offset();
        $('html, body').animate({scrollTop: divPosition.top}, "slow");
        $("#ipoIntakeForm").removeClass('hidden');
        $('#transferScript').addClass('hidden');
        $('#noTransferScript').addClass('hidden');
    });

    const transfer = true;


    form.on('submit',  function() {
        var to_submit = inputs
            .map( function(a) { var o = {}; o[a.name] = a.value ; return o; }  )
            .reduce( function(a, b) { return  Object.assign({}, a, b); }, {});
        console.log("About to submit the form: ", to_submit);

        submit.attr('disabled', true);

        fetch('api/', {
            headers: { 'Accept': 'application/json', 'Content-Type' : 'application/json'},
            method: 'POST',
            body: JSON.stringify(to_submit)
        }).then(function() {
            inputs.forEach(function(i) { i.value = ""; });
            inputs[0].focus();
            submit.removeAttr('disabled');

            $("#ipoIntakeForm").addClass('hidden');
            if ( transfer == true ) {
                $("#transferScript").removeClass('hidden');
                $('#tsCustomerName').html(to_submit.fullname);
                $('#tsCustomerPhone').html(to_submit.phone);
                $('#tsCustomerEmail').html(to_submit.email);
            } else {
                $("#noTransferScript").removeClass('hidden');
            }

            var divPosition = $("#topContainer").offset();
            $('html, body').animate({scrollTop: divPosition.top}, "slow");

        }).catch(function(err) {
            console.error(err);
            alert("Something went terribly wrong: " + err) ;
        });
        return false;
    });
});

