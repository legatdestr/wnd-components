!(function(g, n) {
    "use strict";

    /**
     * @module Em.Model - simplified model class
     */
    var
        observer = n.Utils.observer,
        isValueValid = function(entity, value, props) {
            var valid = false;
            var v = n.isObj(props)? props[entity]: props,
                vType = n.getType(v);
            switch (vType) {
                case 'undefined':
                    valid = false;
                    break;
                case 'null':
                    valid = false;
                    break;
                case 'number':
                    valid = n.isNum(value);
                    break;
                case 'object':
                    valid = n.isObj(value);
                    break;
                case 'array':
                    //   empty - validator should be type of Array
                    //   non empty - валидатор либо пустой массив, либо массив с валидаторами - логика или
                    if (vType.length){
                      valid = isValueValid(entity, value, vType[0]);
                    }
                    valid = n.isArr(value);
                    break;
                default:
                    break;
            }

            return valid;
        },
        methods = {
            is: function(prop) {
                return typeof this._propsAvailable[prop] !== 'undefined';
            },
            get: function(entity) {
                n.Utils.isEmpty(entity) && n.error('no entity name');
                (!this.is(entity)) && n.error('There is no property with given name: ' + entity);
                return this._props[entity] || this._propsAvailable[entity];
            },
            set: function(entity, value, silent) {
                (!n.isStr(entity)) && n.error('property name should be type of String');
                (!this.is(entity)) && n.error('property is not exists: ' + entity);
                (!isValueValid(entity, value, this._propsAvailable)) && n.error('value has no valid type: ' + entity);
                this._props[entity] = value;
                (!!!silent) && this.events.fire('model_update', this);
                return this;
            },
            /**
             * Returns COPY of the properties
             * @method getValues
             * @return {Object} COPY of the Model properties
             */
            getValues: function() {
                return g.JSON.parse(g.JSON.stringify(this._props));
            },
            setValues: function(vals, silent) {
                var self = this;
                (!n.isObj(vals)) && n.error('values should be type of "Object"');
                n.each(vals, function(k, v) {
                    self.set(k, v, silent);
                });
                return this;
            },
            toString: function() {
                return this.toJson();
            },
            toJson: function() {
                return g.JSON.stringify(this.getValues());
            }
        },

        setupModelAvailableProps = function(Model, props) {
            props && (!n.isObj(props)) && n.error('Model properties should be type of "Object" with types');
            Model.prototype._propsAvailable = props;
            return Model;
        },

        setupModelMethods = function(Model) {
            n.each(methods, function(k, v) {
                Model.prototype[k] = v;
            });
            Model.prototype._propsAvailable.methods && n.each(Model.prototype._propsAvailable.methods, function(k, v) {
                n.isF(v) && (Model.prototype[k] = v);
            });
            Model.prototype._propsAvailable.methods && delete Model.prototype._propsAvailable.methods;
            return Model;
        };

    /**
     * Model factory
     * @method Model constructor.
     * @param  {Object} props model definition
     */
    n.Model = function(props) {

        function Model(values) {
            (this.events = {}) && observer(this.events);
            this._props = {};
            values && this.setValues(values);
            return this;
        }

        setupModelAvailableProps(Model, props);
        setupModelMethods(Model);

        return Model;
    };

}(this, typeof EM === 'object' ? EM : this.EM = {}));
