import {setTempValue} from "../rander.js"
/**
 * 
 * @param {*} vm 实例对象
 * @param {*} elm 真实元素
 * @param {*} namespace 命名空间也是v-model的value
 */
export function vmodel(vm,elm,namespace){
    elm.onchange = function (enevt){
        setTempValue(vm,namespace,elm.value);
    }


}