import Ember from 'ember';
import ensurePromise from '../utils/ensure-promise';

export function validateFieldName(name, fields) {
    // Ensuring that field names don't start with underscores prevents
    // overwriting _item, _template and any future "protected" property
    // we might add to extracted items.
    if (/^_/.test(name)) {
        return "Invalid field name: field can't start with underscores";
    } else if (name === 'url') {
        return ('Invalid field name: naming a field "url" is not allowed as' +
                'there is already a field with this name');
    } else if (fields.findBy('name', name)) {
        return 'Invalid field name: There is already a field with that name';
    }
    return null; // No error
}

export default Ember.Component.extend({
    notificationManager: Ember.inject.service(),
    dispatcher: Ember.inject.service(),

    tagName: '',

    actions: {
        addField() {
            this.get('dispatcher').addField(this.get('schema'), undefined, /* redirect = */true);
        },

        removeField(field) {
            this.get('dispatcher').removeField(field);
        },

        validateFieldName(name) {
            const error = validateFieldName(name, this.get('schema.fields'));
            if(error) {
                this.get('notificationManager').showWarningNotification(error);
                return false;
            }
            return true;
        },

        saveField(field) {
            ensurePromise(field).then(field => field.save());
        }
    }
});