import {constructProxy} from "./proxy.js"
let uid = 0;
export function initMixin(due){
    due.prototype._init = function (option){
        let vm = this;
        this.uid = uid++;
        this._isVue = true;

        //初始化data
        if(option&&option.data){
            this._data = constructProxy(vm,option.data,"");
        }
        //初始化created
        //初始化methods
        //初始化computed
        //挂在el

    }

}
