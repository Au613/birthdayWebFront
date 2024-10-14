export function formatDate(date: Date): string {
    // Ensure the date is a valid Date object
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        throw new Error("Invalid date provided");
    }

    // Create a new date object based on the UTC components
    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())));
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();

    return `${month} ${day}, ${year}`;
}

export function getNextBirthday(birthday: Date): Date {
    const today = new Date();
    const currentYear = today.getFullYear();

    // Create a birthday date for this year
    const nextBirthday = new Date(Date.UTC(currentYear, birthday.getMonth(), birthday.getDate()));

    // If the next birthday has already passed this year, set it for the next year
    if (nextBirthday < today) {
        nextBirthday.setFullYear(currentYear + 1);
    }

    return nextBirthday;
}

