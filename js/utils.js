
export function monthDatesArray (dt = new Date()) {
    if (typeof dt !== "object") return false
    const date          = new Date(dt)
    const monthIndex    = date.getMonth()
    const nextMonth     = new Date(new Date(date).setMonth(monthIndex + 1))
    const last          = new Date(nextMonth.setDate(0)).getDate()
    const array         = []
    for (let i = 1; i <= last; i++) {
        const dtx = dateProp(new Date(date.setDate(i)))
        array.push(dtx)
    }
    return {
        last        : last,
        firstDay    : new Date(new Date(date).setDate(1)).getDay(),
        array       : array,
        monthString : date.toLocaleDateString("id-ID", {month : "long"}),
        year        : date.getFullYear()
    }
}

function dateProp(dt = new Date()) {
    if (typeof dt !== "object") return false
    const date          = new Date(dt)
    const year          = date.getFullYear()
    const monthString   = date.toLocaleDateString("id-ID", {month : "long"})
    const monthIndex    = date.getMonth()
    
    return {
        date        : date.getDate().toString().padStart(2, "0"),
        montNumber  : (monthIndex + 1).toString().padStart(2, "0"),
        monthIndex  : monthIndex,
        monthString : monthString,
        dayNow      : date.getDay(),
        firstDay    : new Date(new Date(date).setDate(1)).getDay(),
        year        : year,
        dateString  : date + "-" + monthString + "-" + year
    }
}