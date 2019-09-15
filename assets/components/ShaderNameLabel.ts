import ShaderHelper from './ShaderHelper';

const {ccclass, property, executeInEditMode} = cc._decorator;

@ccclass
@executeInEditMode
export default class NewClass extends cc.Component {

    @property(ShaderHelper)
    shaderHelper = null;

    start () {
        if (!this.shaderHelper) {
            return;
        }
       
        setTimeout(() => {
            let effectAsset = ShaderHelper.effectAssets[this.shaderHelper.program];
            this.getComponent(cc.Label).string = effectAsset.name;
        }, 1000);
        
    }

    // update (dt) {}
}
