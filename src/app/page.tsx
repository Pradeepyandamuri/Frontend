// app/page.tsx
import CalendarView from "./components/CalenderView"
import Navbar from "./components/Navbar"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <Navbar />
      <CalendarView />
    </main>
  )
}
