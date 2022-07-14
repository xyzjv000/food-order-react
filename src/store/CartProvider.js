import CartContext from "./cart-context";
import { useReducer } from "react";

const defaultCartState = {
    items: [],
    totalAmount: 0
}

const CartReducer = (state, action) => {
    if (action.type === 'ADD') {
        const updatedTotalAmount = state.totalAmount + (action.item.amount * action.item.price);
        const cartItemIndex = state.items.findIndex(item => item.id === action.item.id);
        const existingCartItem = state.items[cartItemIndex];

        let updatedItems;

        if (existingCartItem) {
            const updatedItem = {
                ...existingCartItem, amount: existingCartItem.amount + action.item.amount
            }
            updatedItems = [...state.items]
            updatedItems[cartItemIndex] = updatedItem
        }
        else {
            updatedItems = state.items.concat(action.item);
        }
        return {
            items: updatedItems,
            totalAmount: updatedTotalAmount
        }
    }

    if (action.type === 'REMOVE') {
        const existingCartItemIndex = state.items.findIndex(item => item.id === action.id);
        const existingCartItem = state.items[existingCartItemIndex];

        const updatedTotalAmount = state.totalAmount - existingCartItem.price;
        let updateItems;

        if (existingCartItem.amount === 1) {
            updateItems = state.items.filter(item => item.id !== action.id)
        }
        else {
            const updateItem = { ...existingCartItem, amount: existingCartItem.amount - 1 }
            updateItems = [...state.items];
            updateItems[existingCartItemIndex] = updateItem;


        }
        return {
            items: updateItems,
            totalAmount: updatedTotalAmount
        }
    }
    return defaultCartState;
}

const CartProvider = props => {
    const [cartState, dispatchCartAction] = useReducer(CartReducer, defaultCartState)

    const addItemToCartHandler = item => {
        dispatchCartAction({ type: 'ADD', item: item })
    };

    const removeItemToCartHandler = id => {
        dispatchCartAction({ type: 'REMOVE', id: id })
    }

    const cartContext = {
        items: cartState.items,
        totalAmount: cartState.totalAmount,
        addItem: addItemToCartHandler,
        removeItem: removeItemToCartHandler
    }
    return <CartContext.Provider value={cartContext}>
        {props.children}
    </CartContext.Provider>
}

export default CartProvider;