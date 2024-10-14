'use client'

import { useContext, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { BirthdayContext } from '../app/store/context/birthdays-context'; // Adjust the path as necessary

export default function MessageComposer() {
  const { birthdays, updateScheduledDate, updateMessage, toggleScheduled } = useContext(BirthdayContext);
  const [selectedFriend, setSelectedFriend] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(undefined); // Change to undefined

  const handleScheduleMessage = () => {
    if (!selectedFriend || !message || !scheduleDate) {
      alert('Please fill in all fields');
      return;
    }
    
    // Update the birthday in context with scheduled message and date
    const birthday = birthdays[selectedFriend];
    if (birthday) {
      updateMessage(selectedFriend, message); // Update message for the selected friend
      toggleScheduled(selectedFriend); // Toggle the scheduled status
      updateScheduledDate(selectedFriend, scheduleDate); // Set the scheduled date
    }

    // Reset the input fields
    setSelectedFriend('');
    setMessage('');
    setScheduleDate(undefined); // Reset to undefined
  };

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground p-4 flex items-center">
        <h1 className="text-xl font-bold">Message Composer</h1>
      </header>

      <main className="flex-grow p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Compose Birthday Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="friend-select" className="text-sm font-medium">
                Select Friend
              </label>
              <Select value={selectedFriend} onValueChange={setSelectedFriend}>
                <SelectTrigger id="friend-select">
                  <SelectValue placeholder="Select a friend" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(birthdays).map(([id, friend]) => (
                    <SelectItem key={id} value={id}>
                      {friend.person}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Birthday Message
              </label>
              <Textarea
                id="message"
                placeholder="Type your birthday message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="schedule-date" className="text-sm font-medium">
                Schedule Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${!scheduleDate && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduleDate ? format(scheduleDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={scheduleDate}
                    onSelect={setScheduleDate}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button className="w-full" onClick={handleScheduleMessage}>
              Schedule Message
            </Button>
          </CardContent>
        </Card>
        <Card>
  <CardHeader>
    <CardTitle className="text-lg font-medium">Scheduled Messages</CardTitle>
  </CardHeader>
  <CardContent>
    <ul className="space-y-2">
      {Object.entries(birthdays)
        .filter(([, friend]) => friend.scheduledDate) // Filter friends with scheduledDate
        .map(([id, friend]) => (
          <li key={id} className="text-sm">
            <span className="font-medium">{friend.person}</span> - {friend.scheduledDate && format(friend.scheduledDate, 'PPP')}
          </li>
        ))}
    </ul>
  </CardContent>
</Card>
      </main>
    </div>
  );
}
