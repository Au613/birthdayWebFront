"use client"

import { useState, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Bell, LogOut, Plus, Send } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Birthday, BirthdayContext } from "../app/store/context/birthdays-context"
import { formatDate } from "@/scripts/dateFormat"

export default function BirthdayTracker() {
	const [showAddForm, setShowAddForm] = useState(false)
	const { birthdays, addBirthday, updateMessage, removeBirthday, toggleScheduled, updateScheduledDate } = useContext(BirthdayContext)
	const [selectedBirthday, setSelectedBirthday] = useState(null)

	const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
	const currentDate = new Date()
	const currentMonth = currentDate.toLocaleString("default", { month: "long" })
	const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
	const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
	const weeks = Math.ceil((firstDayOfMonth + daysInMonth) / 7)
	const calendarDays = Array.from({ length: weeks * 7 }, (_, i) => {
		const day = i - firstDayOfMonth + 1
		return day > 0 && day <= daysInMonth ? day : null
	})

	const handleAddBirthday = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const form = event.currentTarget

		// Extract person and date
		const person = form.person.value
		const date = new Date(form.date.value) // Convert to Date object

		// Call addBirthday with just the required fields
		addBirthday(person, date)

		setShowAddForm(false)
	}

	const handleUpdateMessage = (id: string, message: string) => {
		console.log(message, "MESSAGE")
		updateMessage(id, message)
	}

	const handleToggleSchedule = (id: string) => {
		toggleScheduled(id)
	}

	const handleUpdateScheduledDate = (id: string, date: Date) => {
		updateScheduledDate(id, date)
	}

	const sendMessage = (birthday: Birthday) => {
		alert(`Message sent to ${birthday.person}: ${birthday.message}`)
	}

	return (
		<div className="max-w-md mx-auto bg-background min-h-screen flex flex-col">
			<header className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
				<h1 className="text-xl font-bold">Birthday Tracker</h1>
				<Button variant="ghost" size="icon">
					<LogOut className="h-5 w-5" />
				</Button>
			</header>

			<main className="flex-grow p-4 space-y-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">{currentMonth}</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-7 gap-1 text-center">
							{daysOfWeek.map((day) => (
								<div key={day} className="text-xs font-medium text-muted-foreground">
									{day}
								</div>
							))}
							{calendarDays.map((day, index) => (
								<div key={index} className={`aspect-square flex items-center justify-center text-sm ${day === currentDate.getDate() ? "bg-primary text-primary-foreground rounded-full" : ""}`}>
									{day}
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Upcoming Birthdays</CardTitle>
						<Bell className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<ul className="space-y-2">
							{Object.values(birthdays)
								.filter((birthday) => {
									const birthdayDate = birthday.date // birthday.date is already a Date object
									const today = new Date()

									// Check if the birthday is in the current month and the day is today or in the future
									return birthdayDate.getMonth() === today.getMonth() && birthdayDate.getDate() >= today.getDate()
								})
								.map((birthday) => {
									const birthdayDate = birthday.date // birthday.date is already a Date object
									const currentYear = new Date().getFullYear()
									const age = currentYear - birthdayDate.getFullYear() // Calculate age based on the year

									return (
										<li key={birthday.id} className="flex items-center justify-start gap-2">
											<Dialog>
												<DialogTrigger asChild>
													<Button variant="outline" size="sm">
														<Send className="h-4 w-4" />
														<span className="sr-only">Send message</span>
													</Button>
												</DialogTrigger>
												<DialogContent>
													<DialogHeader>
														<DialogTitle>Send Birthday Message</DialogTitle>
													</DialogHeader>
													<Textarea value={birthday.message} onChange={(e) => handleUpdateMessage(birthday.id, e.target.value)} className="mt-2" />
													<Button onClick={() => sendMessage(birthday)} className="mt-2">
														Send Message
													</Button>
												</DialogContent>
											</Dialog>
											<span className="text-sm">
												<span className="font-medium font-semibold">{birthday.person}</span> - {formatDate(birthday.date)} (age: {age + 1})
											</span>
											<div className="flex items-center space-x-2">
												<div className="flex items-center space-x-2">
													<Switch id={`schedule-${birthday.id}`} checked={birthday.scheduled} onCheckedChange={() => handleToggleSchedule(birthday.id)} />
													<Label htmlFor={`schedule-${birthday.id}`} className="sr-only">
														Schedule message
													</Label>
												</div>
											</div>
										</li>
									)
								})}
						</ul>
					</CardContent>
				</Card>

				{showAddForm ? (
					<Card>
						<CardHeader>
							<CardTitle className="text-sm font-medium">Add Birthday</CardTitle>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleAddBirthday} className="space-y-2">
								<Input type="text" name="person" placeholder="Friend's Name" required />
								<Input type="date" name="date" required />
								<Button type="submit" className="w-full">
									Add Birthday
								</Button>
							</form>
						</CardContent>
					</Card>
				) : (
					<Button className="w-full" onClick={() => setShowAddForm(true)}>
						<Plus className="mr-2 h-4 w-4" /> Add Birthday
					</Button>
				)}
			</main>
		</div>
	)
}
