import {
    vmodel
} from "./grammer/vmodel.js"
import {
    getAttr
} from "./grammer/util.js";
//vnode to template 的映射
let vnode2template = new Map();
//template to vnode 的映射
let template2vnode = new Map();
/**
 * 查找所有的模板字符串，生成模板to vnode的相互映射关系
 * @param {*} vm 实例
 * @param {*} vnode 虚拟dom
 */
export function preparaRander(vm, vnode) {
    if (!vnode) {
        return
    }
    //是文本节点才有模板
    if (vnode.nodeType === 3) {
        let templateList = getTemplateString(vnode.text);
        for (let i = 0; templateList && i < templateList.length; i++) {
            setTemplate2Vnode(vnode, wipe(templateList[i]));
            setVnode2Template(vnode, wipe(templateList[i]));
        }
    }
    //是元素节点就遍历元素的子节点和另作处理
    if (vnode.nodeType === 1) {
        //元素有v-model的情况
        if (vnode.elm.nodeName == "INPUT" && getAttr(vnode).indexOf('v-model') != -1) {
            vmodel(vm, vnode.elm, vnode.elm.getAttribute('v-model'));
            setTemplate2Vnode(vnode, vnode.elm.getAttribute('v-model'));
            setVnode2Template(vnode, vnode.elm.getAttribute('v-model'));
        }
        for (let i = 0; vnode.children && i < vnode.children.length; i++) {
            preparaRander(vm, vnode.children[i]);

        }
    }

}
//用正则查找节点中的大胡子语法
function getTemplateString(text) {
    return text.match(/{{[a-z,A-Z,0-9,\[\].]+}}/g)
}
//工具函数把大胡子语法的花括号去掉
function wipe(text) {
    if (text.substring(0, 2) == "{{" && text.substring(text.length - 2, text.length) == "}}") {
        return text.substring(2, text.length - 2);
    } else {
        return text;
    }
}
//设置vnode to template 的映射函数
function setVnode2Template(vnode, template) {
    let templateArr = vnode2template.get(vnode);
    if (templateArr) {
        templateArr.push(template);
    } else {
        vnode2template.set(vnode, [template]);
    }
}
//设是template to vnode 的映射函数
function setTemplate2Vnode(vnode, template) {
    let vnodeArr = template2vnode.get(template);
    if (vnodeArr) {
        vnodeArr.push(vnode);
    } else {
        template2vnode.set(template, [vnode]);
    }
}


//在构造函数的原型上添加方法_rander
export function randerMixin(due) {
    due.prototype._rander = function () {
        randerVnode(this);
    }

}
/**
 * 渲染函数先试试自己想的方法
 * @param {*} vm 实例对象
 * @param {*} vnode 初始化的时候不传用vnode2template渲染，数据更新是传要更新的虚拟vnode
 */
function randerVnode(vm, vnode) {
    if (vnode) { //数据更新是进
        let temps = vnode2template.get(vnode);
        // let rul = vnode.text;
        // if (vnode.nodeType == 1) {
        //     if (vnode.tag == "INPUT" && getAttr(vnode).indexOf('v-model') != -1) {
        //         if (getTempValue([vm._data], temps)) {
        //             rul = getTempValue([vm._data], temps);
        //         }
        //         vnode.elm.value = rul
        //     }
        // } else {
        //     for (let i = 0; i < temps.length; i++) {
        //         if (getTempValue([vm._data], temps[i])) {
        //             rul = rul.replace("{{" + temps[i] + "}}", getTempValue([vm._data], temps[i]))
        //         }
        //     }
        //     vnode.elm.nodeValue = rul;
        // }
        getElmValue(vm, vnode, temps);
    }
    //初始化是vnode不传进用vnode2template进行初始化
    else {
        for (let key of vnode2template.keys()) {
            let temps = vnode2template.get(key);

            getElmValue(vm, key, temps);

        }
    }
}
//模板到数据的处理，用于处理vnode.nodeType的各种情况
function getElmValue(vm, vnode, temps) {
    let rul = vnode.text;
    //元素是标签
    if (vnode.nodeType == 1) {
        //v-model的情况
        if (vnode.tag == "INPUT" &&  getAttr(vnode).indexOf('v-model') != -1) {
            if (getTempValue([vm._data], temps)) {
                rul = getTempValue([vm._data], temps);

            }
            vnode.elm.value = rul

        }
    }
    //是文本元素 
    else {
        for (let i = 0; i < temps.length; i++) {
            // console.log(getTempValue([vm._data],temps[i]))
            if (getTempValue([vm._data], temps[i])) {
                // console.log(getTempValue([vm._data],temps[i]))
                rul = rul.replace("{{" + temps[i] + "}}", getTempValue([vm._data], temps[i]))
            }
        }
        vnode.elm.nodeValue = rul;
    }
}

//得到模板的数据
function getTempValue(objs, string) {
    let arr = str2arr(string);
    for (let i = 0; i < objs.length; i++) {
        let str = objs[i];
        //针对数组
        for (let i = 0; i < arr.length; i++) {
            if (str[arr[i]]) {
                str = str[arr[i]]
            } else {
                return null;
            }

        }
        return str
    }

}
export function setTempValue(obj, string, value) {
    let arr = str2arr(string);
    let str = obj;
    for (let i = 0; i < arr.length; i++) {
        if (str[arr[i]]) {
            if (i == arr.length - 1) {
                str[arr[i]] = value;
            }
            str = str[arr[i]];
        }

    }
}
//针对作用域的字符转化为数组
function str2arr(string) {
    let arr = [];
    pushArr(arr, string);

    return arr;

}

function pushArr(arr, string) {
    if (!string) {
        return
    }
    let conArr = [];
    if (string.indexOf("[") === -1 && string.indexOf("]") === -1 && string.indexOf(".") === -1) {
        arr.push(string);
    } else if (string.indexOf(".") !== -1) {
        conArr = string.split(".");
        for (let i = 0; i < conArr.length; i++) {
            pushArr(arr, conArr[i]);

        }
    } else if (string.indexOf("[") !== -1 && string.indexOf("]") !== -1) {

        conArr = string.split("[")
        for (let i = 0; i < conArr.length; i++) {
            if (i !== 0) {
                conArr[i] = conArr[i].slice(0, conArr[i].length - 1);

            }
            pushArr(arr, conArr[i]);
        }
    }
}

/**
 * 数据更改引起的重新渲染
 * 
 */
export function randerData(vm, template) {
    let vnodes = template2vnode.get(template);
    if (vnodes) {
        for (let i = 0; i < vnodes.length; i++) {
            randerVnode(vm, vnodes[i]);

        }
    }

}