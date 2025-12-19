-- CreateTable
CREATE TABLE "ytmusic_info" (
    "video_id" VARCHAR(50) NOT NULL,
    "track_name" VARCHAR(255) NOT NULL,
    "album_id" VARCHAR(50) NOT NULL,
    "album_name" VARCHAR(255) NOT NULL,
    "release_year" INTEGER,
    "lyrics" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_ytmusic_info" PRIMARY KEY ("video_id")
);

-- CreateTable
CREATE TABLE "ytmusic_artists" (
    "artist_id" VARCHAR(50) NOT NULL,
    "artist_name" VARCHAR(255) NOT NULL,

    CONSTRAINT "pk_ytmusic_artists" PRIMARY KEY ("artist_id")
);

-- CreateTable
CREATE TABLE "ytmusic_track_artists" (
    "video_id" VARCHAR(50) NOT NULL,
    "artist_id" VARCHAR(50) NOT NULL,

    CONSTRAINT "pk_ytmusic_track_artists" PRIMARY KEY ("video_id","artist_id")
);

-- CreateTable
CREATE TABLE "ytmusic_tags" (
    "id" SERIAL NOT NULL,
    "tag_name" VARCHAR(50) NOT NULL,
    "deprecated" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ytmusic_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ytmusic_track_tags" (
    "video_id" VARCHAR(50) NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "pk_ytmusic_track_tags" PRIMARY KEY ("video_id","tag_id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "email_verified" TIMESTAMP(3),
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ytmusic_tags_tag_name_key" ON "ytmusic_tags"("tag_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- AddForeignKey
ALTER TABLE "ytmusic_track_artists" ADD CONSTRAINT "fk_ytmusic_track_artists_video_id" FOREIGN KEY ("video_id") REFERENCES "ytmusic_info"("video_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ytmusic_track_artists" ADD CONSTRAINT "fk_ytmusic_track_artists_artist_id" FOREIGN KEY ("artist_id") REFERENCES "ytmusic_artists"("artist_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ytmusic_track_tags" ADD CONSTRAINT "fk_ytmusic_track_tags_video_id" FOREIGN KEY ("video_id") REFERENCES "ytmusic_info"("video_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ytmusic_track_tags" ADD CONSTRAINT "fk_ytmusic_track_tags_tag_id" FOREIGN KEY ("tag_id") REFERENCES "ytmusic_tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
