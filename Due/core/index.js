import {initMixin} from "./init.js";
function Due(option){
    //首先对构造函数初始化
    this._init(option)

}

initMixin(Due);


export default Due;