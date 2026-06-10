import { useReducer, createContext, type Dispatch, type ReactNode, useMemo } from "react";
import { activityReducer, initialState, type ActivityActions, type ActivityState } from "../reducers/activity-reducer";
import { Activity } from "../types";
import { categories } from "../data/categories";


//definir el tipo de contexto que se va a manejar
type ActivityContextProps = {
    state:ActivityState
    dispatch: Dispatch<ActivityActions>
    caloriesConsumed:number
    caloriesBurned:number
    netCalories:number
    categoryName: (category: number) => string[]
    isEmptyActivities: boolean
}

//definir de que tipo seran los children o los componentes que se les provera el state y el dispatch
type ActivityProviderProp ={
    children: ReactNode
}

export const ActivityContext = createContext<ActivityContextProps>(null!)


//ActivityProvider recibe un componente de tipo nodo read como argumento y el retorna el state y dispatch procesado por el componente recibido
export const ActivityProvider = ({children}: ActivityProviderProp)=>{
    
    const [state,dispatch] = useReducer(activityReducer,initialState) //obteniendo el state y las acciones del ActivityReducer
     
    // Contadores para el componente display
    const caloriesConsumed = useMemo(() => state.activities.reduce((total, activity) => activity.category === 1 ? total + activity.calories : total, 0), [state.activities])
    const caloriesBurned = useMemo(() => state.activities.reduce((total, activity) => activity.category === 2 ? total + activity.calories : total, 0), [state.activities])
    const netCalories = useMemo(() => caloriesConsumed - caloriesBurned, [state.activities])
    
    //
    const categoryName = useMemo(() => 
        (category: Activity['category']) => categories.map( cat => cat.id === category ? cat.name : '' )
    , [state.activities])
    
    const isEmptyActivities = useMemo(() => state.activities.length === 0, [state.activities])
    return(
        //BudgetContext.Provider, rodea toda la app para que el state y dispatch sea global
        <ActivityContext.Provider
            value={{
                state,
                dispatch,
                caloriesConsumed,
                caloriesBurned,
                netCalories,
                categoryName,
                isEmptyActivities
            }}
        >
            {children}
        </ActivityContext.Provider>
        //children es un prop especial que hace referencia a los hijos de un componente, para que acepte cualquier componente
    )
}