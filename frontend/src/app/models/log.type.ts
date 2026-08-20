export type indLog = {
    completed: boolean,
    date: string,
    id?: string
}

export type Log = {
    habit: {name: string, color: string, id: string}
    logs: Array<indLog>
}