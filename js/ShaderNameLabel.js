let ShaderHelper = require('ShaderHelper');
cc.Class({
    extends: cc.Component,

    properties: {
        shaderHelper:ShaderHelper,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    start () {
        if (!this.shaderHelper) {
            return;
        }

        setTimeout(() => {
            let effectAsset = ShaderHelper.effectAssets[this.shaderHelper.program];
            this.getComponent(cc.Label).string = effectAsset.name;
        }, 1000);

    }

    // update (dt) {},
});
