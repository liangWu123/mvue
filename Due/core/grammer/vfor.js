import {
    getTempValue,
    str2arr
} from "../rander.js"
import VNode from "../../vdom/vnode.js";
import {constructVnode} from "../mount.js"
/**
 * 
 * @param {*} vm 实例对象
 * @param {*} vnode 有v-for的虚拟节点
 * @param {String}} value v-for属性的对应的value
 */

export function vfor(vm, vnode, value) {
    let parent = vnode.parent;
    let template = vnode.children[0].elm.nodeValue;
    let tag = vnode.tag;
    parent.elm.removeChild(vnode.elm)
    vnode.nodeType = 0;
    let lists = [];
    let arr = analysisVforValue(value);
    if (getTempValue([vm._data], arr[1])) {
        let data = getTempValue([vm._data], arr[1])
        for (let i = 0; i < data.length; i++) {
            let list = document.createElement(tag);
            list.innerHTML = template;
            parent.elm.appendChild(list);
            let vn = constructVnode(vm,list,vnode)// new VNode(tag,list,list.children,template,[],vnode,list.nodeType);
            vn.env[arr[0][0]] = data[i];
            if(arr[0][1]){
                vn.env[arr[0][1]] = i
            }
            lists.push(vn);

        }
        // console.log(lists)
        vnode.children =vnode.children.concat(lists);
    }

}

export function analysisVforValue(string) {
    if (string.indexOf("in") == -1) {
        throw new Error("v-for error")
    }
    string = string.trim();
    let arr = string.split("in");
    if (arr[0].indexOf("(") != -1 && arr[0].indexOf(")") != -1) {
        arr[0] = arr[0].substring(1, arr[0].length - 1)
        arr[0] = arr[0].trim();
        arr[0] = arr[0].split(",")
        for (let i = 0; i < arr[0].length; i++) {
            arr[0][i] = arr[0][i].trim();

        }
    } else {
        arr[0] = [arr[0]];
    }
    arr[1] = arr[1].trim();
    return arr;
}