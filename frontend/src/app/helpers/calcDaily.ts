import { Daily } from "../models/daily.type";

export const calcDaily = (data: Daily) => {
    const habits = data.habits
    const logs = data.logs
    
    const filteredL = logs.filter(l => l.completed == true)
    return {
        "total": habits.length,
        "completed": filteredL.length, 
        "percentage": filteredL.length == 0 ? "0" : (filteredL.length / habits.length  * 100).toFixed(2)}
};