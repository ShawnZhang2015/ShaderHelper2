
const {ccclass, executeInEditMode} = cc._decorator;

@ccclass
@executeInEditMode
export default class Shader extends cc.Component {
    _material: any;
    
    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.on('effect-changed', (sender, material: any) => {
            if (material.effect._properties.iResolution) {
                let size = this.node.getBoundingBox().size;
                material.effect.setProperty('iResolution',cc.v2(size.width, size.height));
                this._material = material;    
            } else {
                this._material = null;   
            }
        }, this);
    }

    onDestroy() {
        this.node.targetOff(this);  
    }

    protected _onTouchMove(event) {
        if (this._material) {
            this._material.effect.setProperty('mouse', event.getLocation()); 
        }
           
    }
   
}
