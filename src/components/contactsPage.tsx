"use client"

import {useContext, useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Avatar, AvatarFallback} from "@/components/ui/avatar"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog"
import {Label} from "@/components/ui/label"
import {Calendar} from "@/components/ui/calendar"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {CalendarIcon, PlusCircle} from "lucide-react"
import {BirthdayContext} from "../app/store/context/birthdays-context" // Adjust the path as necessary
import {format} from "date-fns"
import {toZonedTime} from "date-fns-tz"
import { formatDate, getNextBirthday } from "@/scripts/dateFormat"

export default function ContactsPage() {
	const {birthdays, addBirthday} = useContext(BirthdayContext)
	const [newContact, setNewContact] = useState({
		person: "",
		date: new Date(), // Ensure date is a Date object
		message: "Happy birthday!",
	})
	const [isAddingContact, setIsAddingContact] = useState(false)
	const [searchTerm, setSearchTerm] = useState("")

	const filteredContacts = Object.values(birthdays)
		.filter((contact) => contact.person.toLowerCase().includes(searchTerm.toLowerCase()))
		.sort((a, b) => a.person.localeCompare(b.person))

	const handleAddContact = () => {
		if (newContact.person) {
			addBirthday(newContact.person, newContact.date, newContact.message, false) // Pass the Date object directly
			setNewContact({
				person: "",
				date: new Date(), // Reset to current date as a Date object
				message: "Happy birthday!",
			})
			setIsAddingContact(false)
		}
	}

	return (
		<div className="max-w-4xl mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Contacts and Birthdays</h1>

			<div className="flex justify-between items-center mb-4 gap-2">
				<div className="relative flex-1 max-w-sm">
					<Input type="text" placeholder="Search contacts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8" />
				</div>
				<Dialog open={isAddingContact} onOpenChange={setIsAddingContact}>
					<DialogTrigger asChild>
						<Button>
							<PlusCircle className="mr-2 h-4 w-4" />
							Add Contact
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Add New Contact</DialogTitle>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="name" className="text-right">
									Name
								</Label>
								<Input id="name" value={newContact.person} onChange={(e) => setNewContact({...newContact, person: e.target.value})} className="col-span-3" />
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="birthday" className="text-right">
									Birthday
								</Label>
								<Popover>
									<PopoverTrigger asChild>
										<Button variant={"outline"} className={`col-span-3 justify-start text-left font-normal ${!newContact.date && "text-muted-foreground"}`}>
											<CalendarIcon className="mr-2 h-4 w-4" />
											{newContact.date ? format(newContact.date, "PPP") : "Pick a date"}
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0">
										<Calendar
											mode="single"
											selected={newContact.date} // Keep it as a Date object
											onSelect={(date) => {
												if (date) {
													const timeZone = "America/New_York" // Replace with desired timezone
													const zonedDate = toZonedTime(date, timeZone)
													setNewContact({...newContact, date: zonedDate}) // Ensure this is a Date object
												}
											}}
										/>
									</PopoverContent>
								</Popover>
							</div>
						</div>
						<Button onClick={handleAddContact}>Add Contact</Button>
					</DialogContent>
				</Dialog>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{filteredContacts.map((contact) => {
					const birthdayDate = new Date(contact.date) // Assuming this is stored as a Date object
					const nextBirthday = new Date(new Date().getFullYear(), birthdayDate.getMonth(), birthdayDate.getDate())

					// If the birthday has already passed this year, move to next year
					if (nextBirthday < new Date()) {
						nextBirthday.setFullYear(nextBirthday.getFullYear() + 1)
					}

					return (
						<Card key={contact.id}>
							<CardHeader className="flex flex-row items-center gap-4">
								<Avatar>
									<AvatarFallback>
										{contact.person
											.split(" ")
											.map((n) => n[0])
											.join("")}
									</AvatarFallback>
								</Avatar>
								<div>
									<CardTitle>{contact.person}</CardTitle>
									<p>{formatDate(birthdayDate)}</p>
								</div>
							</CardHeader>
							<CardContent>
								<p className="text-sm">Next birthday: {formatDate(getNextBirthday(birthdayDate))}</p>
							</CardContent>
						</Card>
					)
				})}
			</div>
		</div>
	)
}



