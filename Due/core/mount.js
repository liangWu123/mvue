import VNode from "../vdom/vnode.js";
import {preparaRander} from "./rander.js";
export function initMount(due){
    due.prototype.$mount = function (el){
        this.vm = this;
        let dom = document.getElementById(el);
        vm._vnode = mount(this,dom);
    }

}
export default function mount(vm,dom){
 //获取虚拟dom数
 vm._vnode  = constructVnode(vm,dom,null);

 //预备渲染，建立模板到vnode的映射
    preparaRander(vm,vm._vnode);

}
/**
 * 从真实dom的挂载点，得到虚拟dom树
 * @param {*} vm 实例对象
 * @param {*} dom 真实dom
 * @param {*} parent 真实dom的父级
 */
function constructVnode(vm,dom,parent){
    let vnode = null;
    let tag = dom.nodeName;
    let children = [];
    let text = getNodeText(dom);
    let data = null;
    let nodeType = dom.nodeType;
    vnode = new VNode(tag,dom,children,text,data,parent,nodeType);
    //深度优先搜索（得到挂载点的子元素，遍历生成虚拟dom
    let child = vnode.elm.childNodes;
    for(let i = 0;i<child.length;i++){
        let vdom = constructVnode(vm,child[i],vnode);
        if(vdom instanceof VNode){//如果是单一节点
            vnode.children.push(vdom);
        }else{//针对for生成的节点数组
            vnode.children = vnode.children.concat(vdom);
        }

    }
    
    return vnode;
}
//获取文本节点的内容，入果是元素节点则返回“”；
function getNodeText(dom){
    if(dom.nodeType===3){
        return dom.nodeValue;

    }else{
        return "";
    }
}