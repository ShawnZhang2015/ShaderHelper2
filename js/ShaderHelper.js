const ShaderEnum = cc.Enum({});
let ShaderProperty = require('ShaderProperty');
var ShaderHelper = cc.Class({
        extends: cc.Component,
        properties: {
            _program: 0,
            program: {
                type: ShaderEnum,
                set: function (value) {
                    if (this._program === value) {
                        return;
                    }
                    this._program = value;
                    this.applyEffect();
                },
                get: function () {
                    return this._program;
                }
            },
            _props: [ShaderProperty],
            props: {
                type: [ShaderProperty],
                set: function (value) {
                    this._props = value;
                    this.applyEffect();
                },
                get: function () {
                    return this._props;
                }
            }
        },


        onLoad() {
            this.material = null;
        },

        start() {
            if (CC_EDITOR) {
                setTimeout(() => {
                    this.applyEffect();
                }, 1000);

            } else {
                this.applyEffect();
            }

        },

        applyEffect() {

            //获取精灵组件
            let sprite = this.node.getComponent(cc.Sprite);
            if (!sprite) {
                return;
            }

            let effectAsset = ShaderHelper.effectAssets[this.program];
            //实例化一个材质对象
            let material = new cc.Material();

            //在材质对象上开启USE_TEXTURE定义s
            material.define('USE_TEXTURE', true);

            //为材质设置effect，也是就绑定Shader了
            material.effectAsset = effectAsset;
            material.name = effectAsset.name;

            //将材质绑定到精灵组件上，精灵可以绑定多个材质
            //这里我们替换0号默认材质
            sprite.setMaterial(0, material);

            //从精灵组件上获取材质，这步很重要，不然没效果
            this.material = sprite.getMaterial(0);

            this.props.forEach(item => item.key && this.material.setProperty(item.key, item.value || 0));
        }
    }
);

ShaderHelper.effectAssets = [];

cc.game.on(cc.game.EVENT_ENGINE_INITED, () => {
    cc.dynamicAtlasManager.enabled = false;
    cc.loader.loadResDir('effects', cc.EffectAsset, (error, res) => {
        ShaderHelper.effectAssets = res;
        let array = ShaderHelper.effectAssets.map((item, i) => {
            return {name: item._name, value: i};
        });
        cc.Class.Attr.setClassAttr(ShaderHelper, 'program', 'enumList', array);
    });
});

