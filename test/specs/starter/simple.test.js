const expect = require('chai').expect;

describe('webdriver.io test', function() {
    it ('should work');

    it('should have correct title as requested', function() {
        browser.url('http://localhost:3000/');
        var title = browser.getTitle();
        expect(title).to.be.equal('HologramUSA Sales Call Center');

    });

    it('should be able to fill the form', function() {
        browser.url('http://localhost:3000/');
        var fullname = browser.element('input[name="fullname"]');
        expect(fullname.getAttribute('placeholder')).to.be.equal('John Doe');
        fullname.setValue('Amy White');



        var email  = browser.element("input[name='email']");
        expect(email.getAttribute('type')).to.be.equal('email');
        email.setValue("Some.email@somewhere.net");



        var tel = $('input[name="tel"]');
        expect(tel.getAttribute('type')).to.be.equal('tel');
    });


});
