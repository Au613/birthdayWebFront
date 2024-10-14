import { createContext, useState, ReactNode, FC } from "react";

// Define types
export type Birthday = {
    id: string; // Unique identifier
    person: string;
    date: Date; // Birthday date
    message: string; // Default message
    scheduled: boolean; // Whether the message is scheduled
    scheduledDate?: Date; // Date for when the message should be sent
};

type BirthdayContextType = {
    birthdays: Record<string, Birthday>; // Change to an object
    addBirthday: (person: string, date: Date, message?: string, scheduled?: boolean, scheduledDate?: Date) => void;
    removeBirthday: (id: string) => void; // Remove by ID
    updateBirthday: (birthdayObj: Birthday) => void; // Function to update a birthday
    updateMessage: (id: string, message: string) => void; // Function to update the message
    toggleScheduled: (id: string) => void; // Function to toggle scheduled status
    updateScheduledDate: (id: string, date: Date) => void; // Function to update the scheduled date
    scheduleMessage: (id: string, scheduledDate: Date, scheduledMessage: string) => void; // Function to schedule a message
};

// Default value for the context
const defaultContextValue: BirthdayContextType = {
    birthdays: {
        "1": { id: "1", person: 'John Doe', date: new Date('1990-05-15'), message: 'Happy birthday!', scheduled: true, scheduledDate: new Date('1990-05-14') },
        "2": { id: "2", person: 'Jane Smith', date: new Date('1985-07-22'), message: 'Many happy returns!', scheduled: false },
    },
    addBirthday: () => {},
    removeBirthday: () => {},
    updateBirthday: () => {},
    updateMessage: () => {},
    toggleScheduled: () => {},
    updateScheduledDate: () => {},
    scheduleMessage: () => {}, // Add default implementation
};

const BirthdayContext = createContext<BirthdayContextType>(defaultContextValue);

type BirthdayContextProviderProps = {
    children: ReactNode;
};

const BirthdayContextProvider: FC<BirthdayContextProviderProps> = ({ children }) => {
    const [birthdays, setBirthdays] = useState<Record<string, Birthday>>(defaultContextValue.birthdays);

    const addBirthday = (
        person: string, 
        date: Date, // Ensure date is always provided
        message: string = "", 
        scheduled: boolean = false, 
        scheduledDate?: Date
    ) => {
        const id = "" + (Object.keys(birthdays).length + 1); // Generate ID based on number of birthdays
        setBirthdays((prev) => ({
            ...prev,
            [id]: { id, person: person || "Unknown", date: date, message, scheduled, scheduledDate }
        }));
    };

    const updateBirthday = (birthdayObj: Birthday) => {
        setBirthdays((prev) => ({ ...prev, [birthdayObj.id]: birthdayObj }));
    };

    const removeBirthday = (id: string) => {
        setBirthdays((prev) => {
            const { [id]: _, ...rest } = prev; // Destructure to remove the birthday
            return rest;
        });
    };

    const updateMessage = (id: string, message: string) => {
        setBirthdays((prev) => {
            if (prev[id]) {
                return { ...prev, [id]: { ...prev[id], message } }; // Update message
            }
            return prev; // Return unchanged if not found
        });
    };

    const toggleScheduled = (id: string) => {
        setBirthdays((prev) => {
            if (prev[id]) {
                return { ...prev, [id]: { ...prev[id], scheduled: !prev[id].scheduled } }; // Toggle scheduled status
            }
            return prev; // Return unchanged if not found
        });
    };

    const updateScheduledDate = (id: string, date: Date) => {
        setBirthdays((prev) => {
            if (prev[id]) {
                return { ...prev, [id]: { ...prev[id], scheduledDate: date } }; // Update scheduled date
            }
            return prev; // Return unchanged if not found
        });
    };

    const scheduleMessage = (id: string, scheduledDate: Date, scheduledMessage: string) => {
        setBirthdays((prev) => {
            if (prev[id]) {
                return { ...prev, [id]: { ...prev[id], scheduled: true, message: scheduledMessage, scheduledDate } }; // Update scheduled status and message
            }
            return prev; // Return unchanged if not found
        });
    };

    const value = {
        birthdays, 
        addBirthday,
        updateBirthday,
        removeBirthday,
        updateMessage,
        toggleScheduled,
        updateScheduledDate,
        scheduleMessage, // Add the scheduleMessage function to the context
    };

    return <BirthdayContext.Provider value={value}>{children}</BirthdayContext.Provider>;
};

// Exporting both the context and provider
export { BirthdayContext, BirthdayContextProvider };
