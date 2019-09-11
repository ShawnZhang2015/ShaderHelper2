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
        effect: cc.EffectAsset,   //effect资源
        speed: 0.01,              //控制动态Shader的time参数
        props: [ShaderProperty],  //shader参数
    },

    start () {
        if (!this.effect) {
            return;
        }

        //获取精灵组件
        let sprite = this.node.getComponent(cc.Sprite);
        if (!sprite) {
            return;    
        }

        //实例化一个材质对象
        let material = new cc.Material();
        //在材质对象上开启USE_TEXTURE定义
        material.define('USE_TEXTURE', true); 
        //为材质设置effect，也是就绑定Shader了
        material.effectAsset = this.effect;
        material.name = this.effect.name;

        //将材质绑定到精灵组件上，精灵可以绑定多个材质
        //这里我们替换0号默认材质
        sprite.setMaterial(0, material);

        //从精灵组件上获取材质，这步很重要，不然没效果
        this.material = sprite.getMaterial(0);

        //初始化参数
        this.time = 0;
        this.props.forEach(item => this.material.setProperty(item.key, item.value));
    },

    /**
     * 在update事件中更新材质参数
     * 不同的Shader这里可能需要重写
     */
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
