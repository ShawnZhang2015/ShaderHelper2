let ShaderProperty = cc.Class({
    name: 'ShaderProperty',
    properties: {
        key: '',
        value: '',         
    }
});

cc.Class({
    extends: cc.Component,

    properties: {
        effect: cc.EffectAsset,
        speed: 0.01,
        props: [ShaderProperty],
    },

    start () {
        if (!this.effect) {
            return;
        }

        let sprite = this.node.getComponent(cc.Sprite);
        if (!sprite) {
            return;    
        }

        let material = new cc.Material();
        material.define('USE_TEXTURE', true); 
        material.effectAsset = this.effect;
        material.name = this.effect.name;
        sprite.setMaterial(0, material);
        this.material = sprite.getMaterial(0);
        this.time = 0;

        this.props.forEach(item => this.material.setProperty(item.key, item.value));
    },

    update () {
       
        if (!this.material || !this.speed) {
            return;
        }

       
        if (this.flag) {
            this.time += this.speed;
        } else {
            this.time -= this.speed;
        }
        
        if (this.time >= 1.2) {
            this.flag = 0;
        } else if (this.time <= -0.2 ) {
            this.flag = 1;
        }
        this.material.setProperty('time', this.time);  
    },
});
