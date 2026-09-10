-- Migration: add_event_messages
-- Description: Create MessageStatus enum and EventMessage table for guest dedications

-- 1. Create MessageStatus enum if it doesn't already exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'MessageStatus') THEN
        CREATE TYPE public."MessageStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
    END IF;
END $$;

-- 2. Create EventMessage table
CREATE TABLE IF NOT EXISTS public."EventMessage" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "authorName" TEXT,
    "content" TEXT NOT NULL,
    "status" public."MessageStatus" NOT NULL DEFAULT 'PENDING'::public."MessageStatus",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventMessage_pkey" PRIMARY KEY ("id")
);

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS "EventMessage_eventId_idx" ON public."EventMessage"("eventId");
CREATE INDEX IF NOT EXISTS "EventMessage_status_idx" ON public."EventMessage"("status");
CREATE INDEX IF NOT EXISTS "EventMessage_createdAt_idx" ON public."EventMessage"("createdAt");

-- 4. Add foreign key relation to Event with cascade delete
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'EventMessage_eventId_fkey'
    ) THEN 
        ALTER TABLE public."EventMessage" 
        ADD CONSTRAINT "EventMessage_eventId_fkey" 
        FOREIGN KEY ("eventId") REFERENCES public."Event"("id") 
        ON DELETE CASCADE ON UPDATE CASCADE; 
    END IF; 
END $$;

-- 5. Grant permissions to standard Supabase roles
GRANT ALL ON TABLE public."EventMessage" TO postgres;
GRANT ALL ON TABLE public."EventMessage" TO service_role;
GRANT ALL ON TABLE public."EventMessage" TO authenticated;
GRANT ALL ON TABLE public."EventMessage" TO anon;
