'use client'
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import FeedLayout from "@/app/FeedLayout"
import axiosService from "@/lib/axiosService"
import { 
    CheckCircle, 
    XCircle, 
    User, 
    Calendar, 
    Ticket as TicketIcon, 
    Loader2, 
    AlertTriangle 
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useToast } from "@/hooks/useToast"
import { formatSmartDate } from "@/lib/date"

const CheckTicket = () => {
    const { ticketId } = useParams()
    const [ticket, setTicket] = useState(null)
    const [loading, setLoading] = useState(true)
    const [verifying, setVerifying] = useState(false)
    const toast = useToast()

    useEffect(() => {
        const fetchTicketDetails = async () => {
            try {
                setLoading(true)
                const res = await axiosService.get(`/api/events/check_ticket/${ticketId}`)
                setTicket(res.data)
            } catch (err) {
                console.log(err)
                toast.error(err.response?.data?.error || 'Error fetching ticket')
            } finally {
                setLoading(false)
            }
        }

        if (ticketId) fetchTicketDetails()
    }, [ticketId])

    const handleVerifyEntry = async () => {
        try {
            setVerifying(true)
            const res = await axiosService.post(`/api/events/verify_ticket/${ticketId}`)
            setTicket(res.data)
            toast.success("Entry confirmed!")
        } catch (error) {
            toast.error(error?.response?.data?.message || "Verification failed")
        } finally {
            setVerifying(false)
        }
    }

    if (loading) return (
        <FeedLayout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="animate-spin text-primary size-10" />
                <p className="text-gray-500 animate-pulse">Fetching ticket data...</p>
            </div>
        </FeedLayout>
    )

    if (!ticket) return (
        <FeedLayout>
            <div className="text-center p-8 border border-dashed border-border rounded-2xl">
                <AlertTriangle className="mx-auto text-amber-500 size-12 mb-4" />
                <h1 className="text-xl font-bold">Ticket Not Found</h1>
                <p className="text-gray-500 mb-6">This ticket ID does not exist in our records.</p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
        </FeedLayout>
    )

    const isUsed = ticket.status === 'used' || ticket.scannedAt

    return (
        <FeedLayout>
            <div className="space-y-6">
                {/* Status Card */}
                <div className={`p-8 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${
                    isUsed ? "border-amber-200 bg-amber-50" : "border-green-200 bg-green-50"
                }`}>
                    {isUsed ? (
                        <>
                            <XCircle className="text-amber-600 size-16 mb-4" />
                            <h1 className="text-2xl font-black text-amber-900">ALREADY SCANNED</h1>
                            <p className="text-amber-700">This ticket was used on {new Date(ticket.updatedAt).toLocaleString()}</p>
                        </>
                    ) : (
                        <>
                            <CheckCircle className="text-green-600 size-16 mb-4" />
                            <h1 className="text-2xl font-black text-green-900">VALID TICKET</h1>
                            <p className="text-green-700 mb-6">Ready for check-in</p>
                            <Button 
                                size="lg" 
                                onClick={handleVerifyEntry} 
                                disabled={verifying}
                                className="bg-green-600 hover:bg-green-700 text-white px-12"
                            >
                                {verifying && <Loader2 className="mr-2 animate-spin" />}
                                Confirm Entry
                            </Button>
                        </>
                    )}
                </div>

                {/* Details Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Attendee Info */}
                    <div className="p-6 rounded-xl border border-border bg-card">
                        <div className="flex items-center gap-2 mb-4 text-gray-400">
                            <User size={16} />
                            <span className="text-xs font-bold uppercase">Attendee</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <img src={ticket.user.avatar} className="size-10 rounded-full object-cover" alt="" />
                            <div>
                                <p className="font-bold">{ticket.user.displayName}</p>
                                <p className="text-sm text-gray-500">@{ticket.user.username}</p>
                            </div>
                        </div>
                    </div>

                    {/* Event Info */}
                    <div className="p-6 rounded-xl border border-border bg-card">
                        <div className="flex items-center gap-2 mb-4 text-gray-400">
                            <Calendar size={16} />
                            <span className="text-xs font-bold uppercase">Event</span>
                        </div>
                        <p className="font-bold truncate">{ticket.event.name}</p>
                        <p className="text-sm text-gray-500">{formatSmartDate(new Date(ticket.event.start))}</p>
                    </div>
                </div>

                {/* Technical ID */}
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg text-[10px] font-mono text-gray-400">
                    <span className="flex items-center gap-2 uppercase tracking-tighter">
                        <TicketIcon size={12}/> Ticket ID
                    </span>
                    <span>{ticket._id}</span>
                </div>
            </div>
        </FeedLayout>
    )
}

export default CheckTicket