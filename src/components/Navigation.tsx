"use client"
import React, { useState } from "react"
import ContactsPage from "@/components/contactsPage"
import MessageComposer from "@/components/messageComposer"
import BirthdayTracker from "./birthdayTracker"
import { Button } from "@/components/ui/button" // Adjust the import based on your setup

const Navigation = () => {
  const [activeScreen, setActiveScreen] = useState<"directory" | "calendar" | "messages">("calendar")

  const renderScreen = () => {
    switch (activeScreen) {
      case "directory":
        return <ContactsPage />
      case "calendar":
        return <BirthdayTracker />
      case "messages":
        return <MessageComposer />
      default:
        return <ContactsPage />
    }
  }

  return (
    <div>
      <div className="h-full w-full flex gap-2">
        <Button
          onClick={() => setActiveScreen("calendar")}
          className={`flex-1 ${activeScreen === "calendar" ? "text-white bg-black" : "text-black bg-white"}`}
        >
          Calendar
        </Button>
        <Button
          onClick={() => setActiveScreen("directory")}
          className={`flex-1 ${activeScreen === "directory" ? "text-white bg-black" : "text-black bg-white"}`}
        >
          Directory
        </Button>
        <Button
          onClick={() => setActiveScreen("messages")}
          className={`flex-1 ${activeScreen === "messages" ? "text-white bg-black" : "text-black bg-white"}`}
        >
          Messages
        </Button>
      </div>
      <div className="p-4">{renderScreen()}</div>
    </div>
  )
}

export default Navigation
