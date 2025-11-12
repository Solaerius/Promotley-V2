# Live Chat Admin Guide

## Overview
The Promotely live chat system allows real-time customer support through your Lovable Cloud backend. Messages are stored in Supabase and support real-time updates.

## Database Tables

### `conversations`
Tracks each chat session with customers.
- `id`: Unique conversation identifier
- `user_id`: Reference to authenticated user (nullable for guest chats)
- `user_name`: Display name of the user
- `user_email`: Email address (if provided)
- `status`: Conversation status (`active`, `resolved`, `closed`)
- `created_at`: When the conversation started
- `last_message_at`: Timestamp of the most recent message

### `chat_messages`
Stores all messages within conversations.
- `id`: Unique message identifier
- `conversation_id`: Reference to the conversation
- `sender_type`: Who sent the message (`user`, `support`, `system`)
- `sender_id`: Reference to the sender's user ID (nullable)
- `message`: The message content
- `created_at`: When the message was sent
- `read_at`: When the message was read (nullable)

## Responding to Customer Messages

### Option 1: Direct Database Access
You can respond to messages by inserting records directly into the `chat_messages` table through the Lovable Cloud backend interface:

1. Go to your backend dashboard
2. Navigate to the `chat_messages` table
3. Insert a new row with:
   - `conversation_id`: The ID of the conversation you're responding to
   - `sender_type`: Set to `support`
   - `message`: Your response text
   - Leave other fields to auto-populate

### Option 2: Build an Admin Dashboard (Recommended)
Create a dedicated admin interface where support staff can:
- View all active conversations
- See message history in real-time
- Respond to customers with a chat interface
- Mark conversations as resolved
- View customer information

Example admin dashboard structure:
```
/admin/chat
  - List of active conversations
  - Click to open conversation
  - View messages in real-time
  - Text input to send responses
  - Status management (active/resolved/closed)
```

## Real-time Updates
The chat system uses Supabase Realtime, so:
- Customers see support responses immediately
- Support staff see customer messages in real-time
- No page refresh needed

## Message Persistence
Messages are automatically:
- Stored in the conversation history
- Saved to localStorage on the customer's device
- Preserved between page reloads

## Typing Indicator
When a support agent sends a message:
- The typing indicator appears for the customer
- Automatically hides when the message arrives
- Creates a more natural chat experience

## Security
- RLS policies ensure customers only see their own conversations
- Service role has full access for admin operations
- All messages are stored securely in the database
- Guest users can chat without authentication

## Future Enhancements
Consider adding:
- Email notifications for new messages
- Canned responses for common questions
- File/image sharing
- Chat assignment to specific support agents
- Customer satisfaction ratings
- Chat analytics and metrics

## Support Contact
For technical issues with the chat system, contact:
- Email: support@promotley.se
- Emergency: uf@promotley.se
