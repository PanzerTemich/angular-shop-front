export interface IAppState{
    // name:string,
    // lastname:string,
    // email:string,
    cart:Object
    // logged:boolean
}

export function rootReducer(state,action){
    switch(action.type){
        case "REGISTER": return {cart:action.payload.cart}
        break;
        case "LOGGED": return {cart:action.payload.cart}
        break;
        case "UPDATE": return {cart:action.payload.cart}
        break;
        default: return state;
    }
    return state;
}