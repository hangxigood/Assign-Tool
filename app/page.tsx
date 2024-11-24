import { Calendar } from "@/components/calendar"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { StatsBar } from "@/components/stats-bar"

export default function Page() {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 p-4 overflow-hidden">
            <Calendar />
          </div>
          <StatsBar />
        </main>
      </div>
    </div>
  )
}

