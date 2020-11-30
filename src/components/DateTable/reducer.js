const reducer = (state, action) => {
    switch (action.type) {
        case 'error':
            return {
                ...state,
                error: action.payload,
            };
        case 'loading':
            return {
                ...state,
                loading: action.payload,
            };
        case 'fetched':
            return {
                ...state,
                fetched: action.payload,
            };
        case 'results':
            return {
                ...state,
                results: action.payload,
            };
        case 'calcTotal':
            return {
                ...state,
                calcTotal: state.calcTotal + action.payload,
            };
        default:
            throw new Error();
    }
};

export default reducer;
