import { db } from '../data/db';
import type { CartItem, Guitar } from './../types/index';

export type CartActions =
    {type: "add-to-cart", payload: {item:Guitar} } |
    {type: "remove-from-cart", payload: {id:Guitar['id']} } |
    {type: "decrease-quantity", payload: {id:Guitar['id']} } |
    {type: "increase-quantity", payload: {id:Guitar['id']} } |
    {type: "clear-cart" }

const initialCart = () : CartItem[] => {
    const localStorageCart = localStorage.getItem('cart')
    return localStorageCart ? JSON.parse(localStorageCart) : []
}

export type CartState ={
    data: Guitar[],
    cart: CartItem[]
}

export const initialState: CartState ={
    data: db,
    cart: initialCart()
}

const MIN_ITEMS = 1
const MAX_ITEMS = 5



export const cartReducer = (
    state:CartState = initialState,
    action:CartActions
)=>{    
    if (action.type =='add-to-cart') {
        const itemExists = state.cart.find(guitar => guitar.id === action.payload.item.id)
        let updatedCart: CartItem[] =[]
        if(itemExists) { // existe en el carrito
            updatedCart= state.cart.map(item=> {
                if (item.id === action.payload.item.id) {
                    if(item.quantity < MAX_ITEMS) {
                        return {...item, quantity: item.quantity++}
                    }
                    return item
                }
                return item
            })
        } else {
            const newItem : CartItem = {...action.payload.item, quantity : 1}
            updatedCart=[...state.cart, newItem]
        }
        return{
            ...state,
            cart: updatedCart,
        }
    }

    if (action.type =='remove-from-cart') {
        return{
            ...state,
            cart: state.cart.filter(guitar => guitar.id !== action.payload.id)
        } 
    }

    if (action.type =='decrease-quantity') {
        const updatedCart= state.cart.map(item=> {
            if (item.id === action.payload.id && item.quantity > MIN_ITEMS) {
                return {...item, quantity: item.quantity--}
            }
            return item
        })
        return{
            ...state,
            cart: updatedCart
        }
        return{
            ...state
        }
    }

    if (action.type =='increase-quantity') {
        const updatedCart= state.cart.map(item=> {
            if (item.id === action.payload.id && item.quantity < MAX_ITEMS) {
                return {...item, quantity: item.quantity++}
            }
            return item
        })
        return{
            ...state,
            cart: updatedCart
        }
    }

    if (action.type =='clear-cart') {
        return{
            ...state,
            cart: []
        }
    }

    return state;
}