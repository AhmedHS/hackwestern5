import Component from '@ember/component';
import {inject as service} from '@ember/service';
import $ from 'jquery'

export default Component.extend({
    DS: service('store'),

    actions: {
        openModal: function () {
            this.set('title', null);
            this.set('body', null);
            $('.ui.newWellness.modal').modal({
                closable: false,
                detachable: false,

                onDeny: () => {
                    return true;
                },

                onApprove: () => {
                    var newWellness = this.get('DS').createRecord('post', {
                        title: this.get('title'),
                        body: this.get('body')
                    });
                    newWellness.save().then(() => {
                        return true;
                    });
                }
            })
            .modal('show');
        },
    }
});

