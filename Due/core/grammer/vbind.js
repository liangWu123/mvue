import { getAttr } from "./util.js";
import { getTempValue } from "../rander.js";

/**
 * 
 * @param {*} vm 实例
 * @param {*} vnode 虚拟dom
 */
export default function VBind(vm,vnode){
 let attrArr = getAttr(vnode);
    for (let i = 0; i < attrArr.length; i++) {
        if(attrArr[i].indexOf("v-bind:")!==-1||attrArr[i].indexOf(":") ===0){
            let temp =vnode.elm.getAttribute(attrArr[i]);
            let k = attrArr[i].split(":")[1].trim()
           
            if(temp.indexOf("{")!==-1&&temp.indexOf("}")!==-1){

            }else{
                let v = getTempValue([vm._data,vnode.env,vm.computed],temp);
                vnode.elm.setAttribute(k,v);
            }

        }
        
    }
}