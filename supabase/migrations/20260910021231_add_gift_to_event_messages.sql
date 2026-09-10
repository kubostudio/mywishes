-- Migration: add_gift_to_event_messages
-- Description: Add optional giftId relation to EventMessage

-- 1. Add giftId column to EventMessage
ALTER TABLE public."EventMessage" 
ADD COLUMN IF NOT EXISTS "giftId" TEXT;

-- 2. Create index for giftId
CREATE INDEX IF NOT EXISTS "EventMessage_giftId_idx" ON public."EventMessage"("giftId");

-- 3. Add foreign key relation to Gift with onDelete SetNull
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'EventMessage_giftId_fkey'
    ) THEN 
        ALTER TABLE public."EventMessage" 
        ADD CONSTRAINT "EventMessage_giftId_fkey" 
        FOREIGN KEY ("giftId") REFERENCES public."Gift"("id") 
        ON DELETE SET NULL ON UPDATE CASCADE; 
    END IF; 
END $$;
