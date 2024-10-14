"use client"
import Navigation from "@/components/Navigation"
import {BirthdayContextProvider} from './store/context/birthdays-context'

export default function Home() {
	return (
		<div>
      <BirthdayContextProvider>
		  	<Navigation />
      </BirthdayContextProvider>
		</div>
	)
}
