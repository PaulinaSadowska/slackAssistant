const workingDays = {
    "2022": [19, 20, 23, 20, 21, 21, 22, 22, 21, 20, 21, 21],
    "2023": [21, 20, 23, 19, 21, 21, 21, 22, 21, 22, 20, 19]
}

// date is passed in 2023-01 format
export function calculateFte(date: String, hours: number) : number {
    const year : string = date.slice(0, 4)
    const month : number = +date.slice(5, 6)
    const workingDaysInMonth = ((year == "2023") ? workingDays[2023] : workingDays[2022])[month]
    return hours / (workingDaysInMonth * 7)
}