-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

DROP EXTENSION pg_net;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT DELETE, INSERT, SELECT, UPDATE ON TABLES TO anon;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT, USAGE ON SEQUENCES TO anon;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON ROUTINES TO anon;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT DELETE, INSERT, SELECT, UPDATE ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT, USAGE ON SEQUENCES TO authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON ROUTINES TO authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT DELETE, INSERT, SELECT, UPDATE ON TABLES TO service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT, USAGE ON SEQUENCES TO service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON ROUTINES TO service_role;

CREATE TYPE public."EventType" AS ENUM (
  'BABY_SHOWER',
  'BIRTHDAY',
  'WEDDING',
  'BAPTISM',
  'GENDER_REVEAL',
  'CHRISTMAS',
  'OTHER'
);

CREATE TYPE public."Gender" AS ENUM (
  'MALE',
  'FEMALE'
);

CREATE TYPE public."GiftStatus" AS ENUM (
  'AVAILABLE',
  'PURCHASED'
);

CREATE TABLE public._prisma_migrations (
  id                  character varying(36)    NOT NULL,
  checksum            character varying(64)    NOT NULL,
  finished_at         timestamp with time zone,
  migration_name      character varying(255)   NOT NULL,
  logs                text,
  rolled_back_at      timestamp with time zone,
  started_at          timestamp with time zone DEFAULT now() NOT NULL,
  applied_steps_count integer                  DEFAULT 0 NOT NULL
);

ALTER TABLE public._prisma_migrations
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public._prisma_migrations
  ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);

GRANT ALL ON public._prisma_migrations TO anon;

GRANT ALL ON public._prisma_migrations TO authenticated;

GRANT ALL ON public._prisma_migrations TO service_role;

CREATE TABLE public."Account" (
  id                  text    NOT NULL,
  "userId"            text    NOT NULL,
  type                text    NOT NULL,
  provider            text    NOT NULL,
  "providerAccountId" text    NOT NULL,
  refresh_token       text,
  access_token        text,
  expires_at          integer,
  token_type          text,
  scope               text,
  id_token            text,
  session_state       text
);

ALTER TABLE public."Account"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."Account"
  ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);

GRANT ALL ON public."Account" TO anon;

GRANT ALL ON public."Account" TO authenticated;

GRANT ALL ON public."Account" TO service_role;

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON public."Account" (PROVIDER, "providerAccountId");

CREATE TABLE public."Event" (
  id              text                           NOT NULL,
  type            public."EventType"             NOT NULL,
  name            text                           NOT NULL,
  "honoreeName"   text,
  date            timestamp(3) without time zone NOT NULL,
  location        text                           NOT NULL,
  description     text,
  "coverImageUrl" text,
  slug            text                           NOT NULL,
  "creatorId"     text                           NOT NULL,
  "deletedAt"     timestamp(3) without time zone,
  "createdAt"     timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt"     timestamp(3) without time zone NOT NULL,
  "locationURL"   text                           DEFAULT ''::text NOT NULL,
  "birthdayAge"   integer,
  "dressCode"     text,
  gender          public."Gender",
  "endDate"       timestamp(3) without time zone,
  timezone        text
);

ALTER TABLE public."Event"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."Event"
  ADD CONSTRAINT "Event_pkey" PRIMARY KEY (id);

GRANT ALL ON public."Event" TO anon;

GRANT ALL ON public."Event" TO authenticated;

GRANT ALL ON public."Event" TO service_role;

CREATE UNIQUE INDEX "Event_slug_key" ON public."Event" (slug);

CREATE INDEX "Event_creatorId_idx" ON public."Event" ("creatorId");

CREATE INDEX "Event_slug_idx" ON public."Event" (slug);

CREATE TABLE public."Gift" (
  id                  text                           NOT NULL,
  "eventId"           text                           NOT NULL,
  name                text                           NOT NULL,
  "imageUrl"          text,
  brand               text,
  price               numeric(10,2),
  currency            text                           DEFAULT 'PEN'::text NOT NULL,
  description         text,
  color               text,
  size                text,
  dimensions          text,
  "originalUrl"       text,
  status              public."GiftStatus"            DEFAULT 'AVAILABLE'::public."GiftStatus" NOT NULL,
  "position"          integer                        DEFAULT 0 NOT NULL,
  "purchasedAt"       timestamp(3) without time zone,
  "deletedAt"         timestamp(3) without time zone,
  "createdAt"         timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt"         timestamp(3) without time zone NOT NULL,
  "purchasedQuantity" integer                        DEFAULT 0 NOT NULL,
  quantity            integer                        DEFAULT 1 NOT NULL
);

ALTER TABLE public."Gift"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."Gift"
  ADD CONSTRAINT "Gift_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES public."Event"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE public."Gift"
  ADD CONSTRAINT "Gift_pkey" PRIMARY KEY (id);

GRANT ALL ON public."Gift" TO anon;

GRANT ALL ON public."Gift" TO authenticated;

GRANT ALL ON public."Gift" TO service_role;

CREATE INDEX "Gift_position_idx" ON public."Gift" ("position");

CREATE INDEX "Gift_eventId_idx" ON public."Gift" ("eventId");

CREATE INDEX "Gift_status_idx" ON public."Gift" (status);

CREATE TABLE public."Session" (
  id             text                           NOT NULL,
  "sessionToken" text                           NOT NULL,
  "userId"       text                           NOT NULL,
  expires        timestamp(3) without time zone NOT NULL
);

ALTER TABLE public."Session"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."Session"
  ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);

GRANT ALL ON public."Session" TO anon;

GRANT ALL ON public."Session" TO authenticated;

GRANT ALL ON public."Session" TO service_role;

CREATE UNIQUE INDEX "Session_sessionToken_key" ON public."Session" ("sessionToken");

CREATE TABLE public."User" (
  id              text                           NOT NULL,
  name            text,
  email           text                           NOT NULL,
  "emailVerified" timestamp(3) without time zone,
  image           text,
  "passwordHash"  text,
  "createdAt"     timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt"     timestamp(3) without time zone NOT NULL
);

ALTER TABLE public."User"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."User"
  ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);

ALTER TABLE public."Account"
  ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE public."Event"
  ADD CONSTRAINT "Event_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE public."Session"
  ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;

GRANT ALL ON public."User" TO anon;

GRANT ALL ON public."User" TO authenticated;

GRANT ALL ON public."User" TO service_role;

CREATE UNIQUE INDEX "User_email_key" ON public."User" (email);

CREATE TABLE public."VerificationToken" (
  identifier text                           NOT NULL,
  token      text                           NOT NULL,
  expires    timestamp(3) without time zone NOT NULL
);

ALTER TABLE public."VerificationToken"
  ENABLE ROW LEVEL SECURITY;

GRANT ALL ON public."VerificationToken" TO anon;

GRANT ALL ON public."VerificationToken" TO authenticated;

GRANT ALL ON public."VerificationToken" TO service_role;

CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON public."VerificationToken" (identifier, token);

CREATE UNIQUE INDEX "VerificationToken_token_key" ON public."VerificationToken" (token);
