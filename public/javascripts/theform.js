
$(document).ready(function() {

    console.log("Working");
    var form = $('#callcentre-form');
    var inputs = form.find('input,textarea,select').toArray();
    var submit = $('input[type="submit"]');

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
        }).catch(function(err) {
            console.error(err);
            alert("Something went terribly wrong: " + err) ;
        });
        return false;
    });
});

