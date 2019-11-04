const {ccclass, property, executeInEditMode} = cc._decorator;

@ccclass('ShaderProperty')
export class ShaderProperty {
    @property({readonly: true})
    key = '';

    @property(cc.Float)
    value = 0.0;
};

const ShaderEnum = cc.Enum({});

@ccclass
@executeInEditMode
export default class ShaderHelper extends cc.Component {
    
    //枚举Shader程序
    @property
    _program = 0;
    @property({type:ShaderEnum})
    get program() {
        return this._program;
    }
    set program(value) {
        if (this._program === value) {
            return;
        }
        this._program = value;
        this.applyEffect();
    }

    //shader参数
    @property({type: [ShaderProperty]})
    _props: ShaderProperty[] = [];
    
    @property({type: [ShaderProperty]})
    get props() : ShaderProperty[] {
        return this._props;
    }

    set props(value) {
        this._props = value;    
        this.applyEffect();
    }

    //材质对象
    material: cc.Material = null;
    
    //effect的数组
    static effectAssets: any[] = null;

    start () {
        if (CC_EDITOR) {
            setTimeout(() => {
                this.applyEffect();
            }, 1000);
            
        } else {
            this.applyEffect();
        }
        //this.node.on(cc.Node.EventType.TOUCH_END, this.next, this);
    }

    applyEffect() {
  
        //获取精灵组件
        let sprite = this.node.getComponent(cc.Sprite);
        if (!sprite) {
            return;    
        }

        let effectAsset = ShaderHelper.effectAssets[this.program];
        //实例化一个材质对象
        let material = new cc.Material();
        
        //在材质对象上开启USE_TEXTURE定义
        let defineUserTexture = !!effectAsset.shaders.find(shader => shader.defines.find(def => def.name === 'USE_TEXTURE'));
        if (defineUserTexture) {
            material.define('USE_TEXTURE', true); 
        }

        //为材质设置effect，也是就绑定Shader了
        material.effectAsset = effectAsset
        material.name = effectAsset.name;

        //将材质绑定到精灵组件上，精灵可以绑定多个材质
        //这里我们替换0号默认材质
        sprite.setMaterial(0, material);

        //从精灵组件上获取材质，这步很重要，不然没效果
        this.material = sprite.getMaterial(0);
        this.setProperty(effectAsset);
        this.node.emit('effect-changed', this, this.material);
    }

    setProperty(effectAsset) {
        if (CC_EDITOR) {
            let oldProps = this._props;
            this._props = [];

            let keys = Object.keys(effectAsset._effect._properties);
            //@ts-ignore
            let values = Object.values(effectAsset._effect._properties);
            
            for (let i = 0; i < values.length; i++) {
                let value: number = values[i].value;
                let key = keys[i];
                let type = values[i].type;
                if (value !== null && (type === 4 || type === 13)) {
                    let oldItem = oldProps.find(item => item.key === key);
                    if (oldItem) {
                        value = oldItem.value;
                    }
                    let sp = new ShaderProperty()
                    sp.key = key;
                    sp.value = typeof(value) === 'object'  ? value[0] : value;
                    this._props.push(sp);    
                }
            }

            // setTimeout(() => {
                let shaderTimer = this.getComponent('ShaderTime');
                //cc.log(shaderTimer.max);
                if (shaderTimer) {
                    shaderTimer.max =  shaderTimer.max;      
                }  
            //}, 1000);
        }

        if (this._props.length) {
            this._props.forEach(item => item.key && this.material.setProperty(item.key, item.value || 0));
        }
        // @ts-ignore
        cc.Class.Attr.setClassAttr(ShaderHelper, 'props', 'visible', !!this._props.length);    
    }

    next() {
        this.program = (this.program + 1) % ShaderHelper.effectAssets.length;
    }

    prev() {
        if (this.program === 0) {
            this.program = ShaderHelper.effectAssets.length - 1;    
            return;
        }
        this.program = (this.program - 1) % ShaderHelper.effectAssets.length;
    }

}

cc.game.on(cc.game.EVENT_ENGINE_INITED, () => {
    cc.dynamicAtlasManager.enabled = false;
    cc.loader.loadResDir('effect', cc.EffectAsset ,(error, res) => {
        ShaderHelper.effectAssets = res;
        let array = ShaderHelper.effectAssets.map((item, i)  => { 
            return {name:item._name, value: i}; 
        });

        //@ts-ignore
        cc.Class.Attr.setClassAttr(ShaderHelper, 'program', 'enumList', array);
    });
})