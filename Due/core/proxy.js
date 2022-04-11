/**
 * 
 * @param {*} vm 实例对象
 * @param {*} obj 要代理的对象
 * @param {*} namespace 作用域
 */
export function constructProxy(vm,obj,namespace){
    let proxtObj = null;
    //如果要代理的数据为数组
    if(obj instanceof Array){
        proxtObj = new Array(obj.length);
        for(let i = 0;i<obj.length;i++){
            if(obj[i] instanceof Object){
                proxtObj[i] = constructProxy(vm,obj[i],getNameSpace(namespace,"["+i+"]"));
            }else{
                proxtObj[i] = obj[i];
            }
        }
        //改写数组proxObj的隐式原型
        proxyObjFunc(vm,proxtObj,namespace);

    }
    //如果要代理的对象是对象
    else if(obj instanceof Object){
        proxtObj = constructObjProxy(vm,obj,namespace);
    }
    //否则报错
    else{
         throw new Error("proxy is not Object")
    }
    return proxtObj;

}
/**
 * 代理对象函数
 * @param {*} vm 
 * @param {*} obj 
 * @param {*} namespace 
 */
function constructObjProxy(vm,obj,namespace){
    let proxyObj = {};
    for(let prop in obj){
        //obj[prop]是对象或数组
        if(obj[prop] instanceof Object){
            let proxy = constructProxy(vm,obj[prop],getNameSpace(namespace,prop));
            proxyObj[prop] = proxy
            vm[prop] = proxy
            continue
        }
        Object.defineProperty(proxyObj,prop,{
            configurable:true,
            get(){
                return obj[prop];
            },
            set:function(value){
                obj[prop] = value;
                //响应式
                console.log(getNameSpace(namespace,prop))
            }
        })
        if(namespace==null || namespace == ''){
            Object.defineProperty(vm,prop,{
                configurable:true,
                get(){
                    return obj[prop];
                },
                set:function(value){
                    obj[prop] = value;
                    //响应式
                    console.log(getNameSpace(namespace,prop))
    
                }
    
            })
    
        }
    }
    return proxyObj;

}
//改写数组的隐式原型
function proxyObjFunc(vm,arr,namespace){
    let obj = {
        eleType:Array,
        toString:function(){
            console.log("这是改写后的Array的toString方法")
        },
        push(){},
        pop(){},
        shift(){},
        unshift(){},
    }
    defArrayFunc(obj,"push",namespace,vm);
    defArrayFunc(obj,"pop",namespace,vm);
    defArrayFunc(obj,"shift",namespace,vm);
    defArrayFunc(obj,"unshift",namespace,vm);


    arr.__proto__ = obj;
}
let arrayPorot = Array.prototype;
function defArrayFunc(obj,func,namespace,vm){
    Object.defineProperty(obj,func,{
        configurable:true,
        enumerable:true,
        value:function(...arg){
            let original = arrayPorot[func];
            original.apply(this,arg);
            console.log("arr:"+namespace);
        }
    })


}
//用于得到news的作用域
function getNameSpace(oldS,newS){
    if(oldS === null || oldS === ""){
        return newS
    }else if(newS === null || newS === ""){
        return oldS
    }else{
        if(newS.indexOf("[") == 0){
            return oldS + newS;
        }
        return oldS+"."+newS;
    }
}