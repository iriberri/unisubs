describe('Test the SubtitleList class', function() {
    var dialogManager = null;
    var VideoPlayer;

    beforeEach(function() {
        module('amara.SubtitleEditor.mocks');
        module('amara.SubtitleEditor.modal');
    });

    beforeEach(inject(function($injector) {
        var DialogManager = $injector.get('DialogManager');
        VideoPlayer = $injector.get('VideoPlayer');
        dialogManager = new DialogManager(VideoPlayer);
    }));

    it('starts with no active dialog', function() {
        expect(dialogManager.current()).toBe(null);
    });

    it('shows dialogs using a stack', function() {
        dialogManager.open('foo');
        expect(dialogManager.current()).toEqual('foo');
        dialogManager.close();
        expect(dialogManager.current()).toBe(null);

        dialogManager.open('bar');
        dialogManager.open('foo');
        expect(dialogManager.current()).toEqual('foo');
        dialogManager.close();
        expect(dialogManager.current()).toEqual('bar');
        dialogManager.close();
        expect(dialogManager.current()).toBe(null);
    });

    it('calculates CSS classes for elements', function() {
        expect(dialogManager.overlayCSSClass()).toEqual('');
        expect(dialogManager.dialogCSSClass('foo')).toEqual('');
        dialogManager.open('foo');
        expect(dialogManager.overlayCSSClass()).toEqual('shown');
        expect(dialogManager.dialogCSSClass('foo')).toEqual('shown');
        expect(dialogManager.dialogCSSClass('bar')).toEqual('');
    });

    it('pauses video when showing dialogs', function() {
        dialogManager.open('bar');
        expect(VideoPlayer.pause).toHaveBeenCalled();
    });

    it('does not crash if closeDialog is called too many times', function() {
        // Basically, we're just testing that close() doesn't crash if called
        // more times than open() is.
        dialogManager.close();

        dialogManager.open('foo');
        dialogManager.close();
        dialogManager.close();
        expect(dialogManager.current()).toBe(null);
    });

    it('opens generic dialogs', function() {
        dialogManager.openDialog({
            title: 'foo',
            buttons: [
                dialogManager.button("Foo")
            ]
        });
        expect(dialogManager.current()).toEqual('generic');
    });

    it('handles button clicks for generic dialogs', function() {
        var callback = jasmine.createSpy();
        var button = dialogManager.button("Foo", callback);
        var $event = jasmine.createSpyObj('$event', ['preventDefault',
            'stopPropagation']);
        dialogManager.openDialog({
            title: 'foo',
            buttons: [ button ]
        });
        dialogManager.onButtonClicked(button, $event);
        expect(callback).toHaveBeenCalled();
        expect($event.preventDefault).toHaveBeenCalled();
        expect($event.stopPropagation).toHaveBeenCalled();
        expect(dialogManager.current()).toBe(null);
    });

});

