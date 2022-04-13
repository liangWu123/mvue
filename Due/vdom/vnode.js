/**
 *  @param {String} tag 标签类型{DIV SPAN #TEXT}
 *  @param {dom} elm 此虚拟节点所对应的真实节点
 *  @param {Array} children 此虚拟节点的子节点
 *  @param {String} text 此虚拟节点的文本（一般只有文本节点有内容）
 *  @param {*} data 暂无意义
 *  @param {dom} parent 父级节点
 *  @param {*} nodeType 节点类型{1为元素节点 3为文本节点} 
 */
export default class VNode{
    constructor(tag,elm,children,text,data,parent,nodeType){
        this.tag = tag,
        this.elm = elm,
        this.children = children,
        this.text = text,
        this.data = data,
        this,parent = parent,
        this.nodeType = nodeType,
        this.env = {},//当前节点的环境变量（v-for中用）
        this.instrucrions = [],//存放指令
        this.template = []//节点涉及到的模板

    }
}