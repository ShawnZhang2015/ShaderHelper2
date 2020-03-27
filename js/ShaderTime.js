cc.Class({
    extends: cc.Component,

    properties: {
        _start:0,
        _material: null,
        _max:65535,
        max:{
            get: function () {
                return this._max;
            },
            set: function (value) {
                this._max = value;
                if (!CC_EDITOR) {
                    return;
                }

                let sprite = this.node.getComponent(cc.Sprite);
                if (sprite) {
                    let material = sprite.getMaterials()[0];
                    material.effect.setProperty('time', value);
                }
            }
        },
    },

    start() {
        this._material = this.node.getComponent(cc.Sprite).getMaterials()[0];
    },


    update(dt) {
        if (this.node.active && this._material) {
            this._setShaderTime(dt);
        }
    },
    _setShaderTime(dt) {
        let start = this._start;
        if (start > this.max) start = 0;
        start += 0.01;
        this._material.effect.setProperty('time', start);

        this._start = start;
    },
});
