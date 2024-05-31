/*
 * Copyright (c) 2024. 
 * @49nhn 
 */

export const getDay = (date: Date) => {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7',];
    return days[date?.getDay()||new Date().getDay()];

}