
const {ccclass, property} = cc._decorator;

@ccclass
export default class ShaderTime extends cc.Component {
    _material: any;
    @property
    max = 65535;

    start() {
        this._material = this.node.getComponent(cc.Sprite).sharedMaterials[0];
    }
    private _start = 0;

    protected update(dt) {
        if (this.node.active && this._material) {
            this._setShaderTime(dt);
        }
    }
    private _setShaderTime(dt) {
        let start = this._start;
        if (start > this.max) start = 0;
        start += 0.01;
        this._material.effect.setProperty('time', start);

        this._start = start;
    }
}
