
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getContactMessages } from "@/data/contactMessages";
import { Mail, MessageSquare, User, Phone, CalendarDays, Info } from "lucide-react";
import { MessageActionsCell } from "@/components/admin/MessageActionsCell";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Messages - Admin',
  description: 'View and manage inquiries submitted through the contact form.',
};

export default function AdminMessagesPage() {
  const messages = getContactMessages();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-2xl font-semibold">Contact Messages</h1>
            <p className="text-muted-foreground">Manage inquiries from your website. (Data is in-memory)</p>
          </div>
        </div>
        {/* Add a "Mark all as read" or filter options here in the future */}
      </div>

      {messages.length === 0 ? (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-muted-foreground" /> No Messages Yet
            </CardTitle>
          </CardHeader>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">There are no contact messages to display at this time.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {messages.map((msg) => (
            <Card key={msg.id} className={`flex flex-col shadow-md hover:shadow-lg transition-shadow ${!msg.isRead ? 'border-primary border-2' : 'border'}`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg font-semibold line-clamp-1 break-all">{msg.name}</CardTitle>
                        <CardDescription className="text-xs text-muted-foreground pt-1">
                            <a href={`mailto:${msg.email}`} className="hover:underline flex items-center">
                                <Mail className="h-3 w-3 mr-1" /> {msg.email}
                            </a>
                            {msg.phone && (
                                <span className="flex items-center mt-1">
                                    <Phone className="h-3 w-3 mr-1" /> {msg.phone}
                                </span>
                            )}
                        </CardDescription>
                    </div>
                    {!msg.isRead && <Badge variant="default" className="ml-auto shrink-0">New</Badge>}
                </div>
              </CardHeader>
              <CardContent className="flex-grow pt-2">
                <p className="text-sm text-foreground line-clamp-4 bg-secondary p-3 rounded-md">{msg.message}</p>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 pt-3">
                <div className="text-xs text-muted-foreground flex items-center w-full justify-between">
                    <span className="flex items-center"><CalendarDays className="h-3 w-3 mr-1" /> Received: {new Date(msg.receivedAt).toLocaleString()}</span>
                </div>
                <Separator className="my-2" />
                <MessageActionsCell messageId={msg.id} isCurrentlyRead={msg.isRead} messageFromName={msg.name} />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
