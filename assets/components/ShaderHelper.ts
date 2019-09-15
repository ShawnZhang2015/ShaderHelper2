const {ccclass, property, executeInEditMode} = cc._decorator;

@ccclass('ShaderProperty')
export class ShaderProperty {
    @property(cc.String)
    key = '';

    @property(cc.String)
    value = '';
};

const ShaderEnum = cc.Enum({a:-1, b:-1});

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
    @property([ShaderProperty])
    props: ShaderProperty[] = [];

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
        
    }

    applyEffect() {
        // if (CC_EDITOR) {
        //     return;
        // }
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

        material.effectAsset = effectAsset
        material.name = effectAsset.name;

        //将材质绑定到精灵组件上，精灵可以绑定多个材质
        //这里我们替换0号默认材质
        sprite.setMaterial(0, material);

        //从精灵组件上获取材质，这步很重要，不然没效果
        this.material = sprite.getMaterial(0);

        this.props.forEach(item => this.material.setProperty(item.key, item.value));
    }
}

cc.game.on(cc.game.EVENT_ENGINE_INITED, () => {
    cc.loader.loadResDir('effects', cc.EffectAsset ,(error, res) => {
        ShaderHelper.effectAssets = res;
        let array = ShaderHelper.effectAssets.map((item, i)  => { 
            return {name:item._name, value: i}; 
        });

        //@ts-ignore
        cc.Class.Attr.setClassAttr(ShaderHelper, 'program', 'enumList', array);
    });
})