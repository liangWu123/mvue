import {initMixin} from "./init.js";
import {randerMixin} from "./rander.js";
function Due(option){
    //首先对构造函数初始化
    this._init(option)
    //渲染
    this._rander();

}

initMixin(Due);
randerMixin(Due);


export default Due;